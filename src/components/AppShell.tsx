import { BottomNav } from "./BottomNav";
import { LoginScreen } from "./LoginScreen";
import { useAuth } from "@/lib/auth";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { ready, authed } = useAuth();
  if (!ready) {
    return <div className="min-h-screen bg-cup-bg" />;
  }
  if (!authed) return <LoginScreen />;

  return (
    <div className="min-h-screen flex flex-col bg-cup-bg max-w-md mx-auto shadow-2xl">
      <main className="flex-1 flex flex-col">{children}</main>
      <BottomNav />
    </div>
  );
}
