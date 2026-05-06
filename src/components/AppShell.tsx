import { BottomNav } from "./BottomNav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background max-w-md mx-auto shadow-2xl">
      <main className="flex-1 flex flex-col">{children}</main>
      <BottomNav />
    </div>
  );
}
