import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Trophy } from "lucide-react";
import { login } from "@/lib/auth";

export function LoginScreen() {
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!login(pw)) {
      setError(true);
      setTimeout(() => setError(false), 800);
    }
  };

  return (
    <div className="min-h-screen bg-amplify flex items-center justify-center px-6">
      <motion.form
        onSubmit={submit}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass w-full max-w-sm rounded-2xl p-6 shadow-2xl"
      >
        <div className="flex flex-col items-center text-center mb-5">
          <div className="w-14 h-14 rounded-full bg-cup-bg/70 flex items-center justify-center border border-white/20 mb-3">
            <Trophy className="text-cup-gold" />
          </div>
          <div className="text-[10px] tracking-[0.25em] font-bold text-white/80">
            FIFA WORLD CUP 26
          </div>
          <h1 className="modular-display text-3xl text-white text-stroke-shadow mt-1">
            COPA 2026
          </h1>
          <p className="text-xs text-white/70 mt-2">
            Digite a senha para acessar seu álbum
          </p>
        </div>

        <motion.div
          animate={error ? { x: [0, -8, 8, -6, 6, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="relative"
        >
          <Lock
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60"
          />
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="Senha"
            autoFocus
            className={`w-full bg-white/10 backdrop-blur text-white placeholder:text-white/50 rounded-xl pl-9 pr-3 py-3 text-sm font-medium outline-none border ${
              error ? "border-cup-red" : "border-white/20"
            } focus:border-cup-gold transition-colors`}
          />
        </motion.div>

        {error && (
          <p className="text-cup-red text-xs mt-2 text-center font-bold">
            Senha incorreta
          </p>
        )}

        <button
          type="submit"
          className="mt-4 w-full bg-cup-green text-white font-display font-bold rounded-xl py-3 active:scale-[0.98] transition shadow-lg"
          style={{ boxShadow: "0 8px 24px -8px rgba(0,198,113,0.6)" }}
        >
          Entrar
        </button>
      </motion.form>
    </div>
  );
}
