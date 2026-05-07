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
            
            let serverData: any = { users: {}, albums: {}, timestamps: {} };
            if (fs.existsSync(dbPath)) {
              serverData = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
              if (!serverData.timestamps) serverData.timestamps = {};
            }

            const clientTimestamps = clientData.timestamps || {};
            const serverTimestamps = serverData.timestamps || {};

            // Merge users
            const mergedUsers = { ...serverData.users, ...clientData.users };

            // Merge albums using Last-Write-Wins based on timestamps
            const mergedAlbums = { ...serverData.albums };
            for (const [user, album] of Object.entries(clientData.albums || {})) {
              const clientTs = clientTimestamps[user] || 0;
              const serverTs = serverTimestamps[user] || 0;
              
              if (clientTs > serverTs || !mergedAlbums[user]) {
                mergedAlbums[user] = album;
                serverTimestamps[user] = clientTs;
              }
            }

            const newDb = { users: mergedUsers, albums: mergedAlbums, timestamps: serverTimestamps };
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
