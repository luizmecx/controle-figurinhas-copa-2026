import { BottomNav } from "./BottomNav";
import { LoginGate } from "./LoginGate";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <LoginGate>
      <div className="min-h-screen flex flex-col bg-background w-full shadow-2xl">
        <main className="flex-1 flex flex-col">{children}</main>
        <BottomNav />
      </div>
    </LoginGate>
  );
}
