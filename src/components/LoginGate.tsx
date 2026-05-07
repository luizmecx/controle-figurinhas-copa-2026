import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Trophy, User } from "lucide-react";
import { signIn, signUp, useAuth } from "@/lib/auth";

// TODO: Trocar foto de fundo aqui
const STADIUM_BG =
  "https://www.seropedicaonline.com/wp-content/uploads/2022/06/2002-brazil-1200x800-1.jpg";

export function LoginGate({ children }: { children: React.ReactNode }) {
  const { signedIn, hydrated } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState("");

  if (!hydrated) return null;
  if (signedIn) return <>{children}</>;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    
    if (!user.trim() || !pwd.trim()) {
      setErr("Preencha usuário e senha");
      return;
    }

    const result = isRegistering ? signUp(user, pwd) : signIn(user, pwd);
    
    if (!result.success) {
      setErr(result.error || "Erro desconhecido");
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center flex items-center justify-center px-6"
      style={{ backgroundImage: `url(${STADIUM_BG})` }}
    >
      <div className="absolute inset-0 bg-black/60" />
      <motion.form
        onSubmit={submit}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-sm rounded-3xl p-7 bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl"
      >
        <div className="flex items-center justify-center mb-3">
          <div className="w-14 h-14 rounded-full bg-green-600 flex items-center justify-center border-2 border-white shadow-lg">
            <Trophy className="text-white" size={26} />
          </div>
        </div>
        <h1 className="modular-display text-center text-3xl text-white text-stroke-shadow">
          COPA 2026
        </h1>
        <p className="text-center text-white/85 text-xs tracking-[0.2em] font-bold mt-1">
          CONTROLE DE FIGURINHAS
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="text-white/80 text-xs font-semibold mb-2 block">
              Usuário
            </label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70" />
              <input
                type="text"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                placeholder="Seu nome"
                className={`w-full bg-white/15 backdrop-blur-md border rounded-xl pl-9 pr-4 py-3 text-white placeholder:text-white/50 outline-none focus:ring-2 focus:ring-yellow-400 ${
                  err && err.includes("usuário") ? "border-red-400" : "border-white/25"
                }`}
                autoFocus
              />
            </div>
          </div>

          <div>
            <label className="text-white/80 text-xs font-semibold mb-2 block">
              Senha de acesso
            </label>
            <motion.div
              animate={err ? { x: [-8, 8, -6, 6, 0] } : {}}
              transition={{ duration: 0.4 }}
              className="relative"
            >
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70" />
              <input
                type="password"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                placeholder="••••••••"
                className={`w-full bg-white/15 backdrop-blur-md border rounded-xl pl-9 pr-4 py-3 text-white placeholder:text-white/50 outline-none focus:ring-2 focus:ring-yellow-400 ${
                  err && err.includes("Senha") ? "border-red-400" : "border-white/25"
                }`}
              />
            </motion.div>
          </div>

          {err && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-300 text-xs mt-2 text-center font-bold"
            >
              {err}
            </motion.p>
          )}
        </div>

        <button
          type="submit"
          className="w-full mt-6 py-3 rounded-xl font-display font-black text-white bg-gradient-to-r from-green-600 to-yellow-500 shadow-lg hover:opacity-95 active:scale-[0.98] transition"
        >
          {isRegistering ? "CADASTRAR" : "ENTRAR"}
        </button>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => {
              setIsRegistering(!isRegistering);
              setErr("");
            }}
            className="text-white/80 text-xs font-medium hover:text-white underline underline-offset-2 transition"
          >
            {isRegistering ? "Já tenho uma conta. Entrar!" : "Não tem conta? Cadastre-se"}
          </button>
        </div>
      </motion.form>
    </div>
  );
}
