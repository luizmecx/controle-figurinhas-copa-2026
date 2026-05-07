// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import fs from 'node:fs';
import path from 'node:path';

function localDbPlugin() {
  return {
    name: 'local-db-api',
    configureServer(server: any) {
      server.middlewares.use('/api/sync', (req: any, res: any) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end('Method Not Allowed');
          return;
        }

        let body = '';
        req.on('data', (chunk: any) => { body += chunk; });
        req.on('end', () => {
          try {
            const clientData = JSON.parse(body);
            const dbPath = path.resolve(process.cwd(), 'database.json');
            
            let serverData: any = { users: {}, albums: {} };
            if (fs.existsSync(dbPath)) {
              serverData = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
            }

            // Merge users
            const mergedUsers = { ...serverData.users, ...clientData.users };

            // Merge albums
            const mergedAlbums = { ...serverData.albums };
            for (const [user, album] of Object.entries(clientData.albums || {})) {
              if (!mergedAlbums[user]) mergedAlbums[user] = {};
              const userAlbum = album as Record<string, { isCollected: boolean; duplicates: number }>;
              
              for (const [code, entry] of Object.entries(userAlbum)) {
                const serverEntry = mergedAlbums[user][code] || { isCollected: false, duplicates: 0 };
                
                mergedAlbums[user][code] = {
                  isCollected: serverEntry.isCollected || entry.isCollected,
                  duplicates: Math.max(serverEntry.duplicates || 0, entry.duplicates || 0)
                };
              }
            }

            const newDb = { users: mergedUsers, albums: mergedAlbums };
            fs.writeFileSync(dbPath, JSON.stringify(newDb, null, 2));

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(newDb));
          } catch (err: any) {
            console.error(err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message }));
          }
        });
      });
    }
  };
}

// Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
// @cloudflare/vite-plugin builds from this — wrangler.jsonc main alone is insufficient.
export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    plugins: [localDbPlugin()]
  }
});
