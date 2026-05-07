import { Search, Settings, X, Share2, RotateCcw, LogOut, Check, User, Key, ChevronDown, Eye, EyeOff } from "lucide-react";
import { useState, useMemo } from "react";
import { ALL_CODES } from "@/lib/stickers-data";
import { getEntry, resetAlbum, useAlbum } from "@/lib/album-store";
import { signOut, changePassword, getCurrentUser, getCurrentPassword } from "@/lib/auth";
import { motion, AnimatePresence } from "framer-motion";

type Filter = "all" | "missing" | "duplicates";

export function AppHeader({
  query,
  onQuery,
  owned,
  total,
  totalDuplicates,
  filter,
  onFilter,
}: {
  query: string;
  onQuery: (q: string) => void;
  owned: number;
  total: number;
  totalDuplicates: number;
  filter: Filter;
  onFilter: (f: Filter) => void;
}) {
  const pct = total ? (owned / total) * 100 : 0;

  const pills: { id: Filter; label: string }[] = [
    { id: "all", label: "Todas" },
    { id: "missing", label: "Faltantes" },
    { id: "duplicates", label: `Repetidas (${totalDuplicates})` },
  ];

  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
    <header className="sticky top-0 z-30 shadow-lg">
      <div 
        className="relative bg-cover bg-center"
        style={{ backgroundImage: 'url(https://www.seropedicaonline.com/wp-content/uploads/2022/06/2002-brazil-1200x800-1.jpg)' }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-md" />
        <div className="relative">
          <div className="px-4 pt-4 pb-2 flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center border-2 border-white shrink-0 shadow-sm overflow-hidden">
              <img 
                src="https://s2-ge.glbimg.com/RGU5LEYpvpcPRro8r9wxAEvmltU=/0x0:2048x2048/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_bc8228b6673f488aa253bbcb03c80ec5/internal_photos/bs/2023/q/Q/e3U1thRemgE9lEG0J4gQ/logo-fifa.jpg" 
                alt="2026 Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-bold tracking-[0.22em] text-white/85">
                FIFA WORLD CUP 26
              </div>
              <div className="modular-display text-2xl text-white text-stroke-shadow">
                COPA 2026
              </div>
            </div>
            <button onClick={() => setSettingsOpen(true)} className="w-10 h-10 flex items-center justify-center text-white/90 hover:text-white transition bg-black/20 rounded-full border border-white/20 active:scale-95">
              <Settings size={20} />
            </button>
          </div>

          <div className="px-4 pb-3">
            <div className="relative mb-2">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                value={query}
                onChange={(e) => onQuery(e.target.value)}
                placeholder="Buscar por país ou código (ex: Brasil, BRA, FWC1)"
                className="w-full bg-white/95 text-foreground placeholder:text-neutral-500 rounded-full pl-9 pr-4 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-yellow-300"
              />
            </div>

            <div className="bg-black/35 rounded-full h-3 overflow-hidden border border-white/25">
              <div
                className="h-full bg-[#00C671] transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] mt-1 font-medium text-white/95">
              <span>{owned} coladas</span>
              <span className="font-bold">{pct.toFixed(1)}%</span>
              <span>{total - owned} faltantes</span>
            </div>

            <div className="flex gap-2 mt-3">
              {pills.map((p) => {
                const active = filter === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => onFilter(p.id)}
                    className={`px-3 py-1 rounded-full text-[11px] font-display font-bold transition ${
                      active
                        ? "bg-white text-neutral-900 shadow"
                        : "bg-white/15 text-white border border-white/30"
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </header>
    <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}

function SettingsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const album = useAlbum();
  const [confirm, setConfirm] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const [profileOpen, setProfileOpen] = useState(false);
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [pwdModalOpen, setPwdModalOpen] = useState(false);
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [pwdErr, setPwdErr] = useState("");
  const [pwdSuccess, setPwdSuccess] = useState("");

  const currentUser = getCurrentUser() || "Visitante";
  const currentPwd = getCurrentPassword() || "";

  const duplicatesList = useMemo(() => {
    return ALL_CODES
      .map((c) => ({ c, e: getEntry(album, c) }))
      .filter((x) => x.e.duplicates > 0)
      .map((x) => `${x.c} (x${x.e.duplicates})`);
  }, [album]);

  const share = async () => {
    const text =
      duplicatesList.length === 0
        ? "Ainda não tenho figurinhas repetidas 🙃"
        : `Minhas repetidas Copa 2026:\n${duplicatesList.join(", ")}`;
    try {
      if (navigator.share) await navigator.share({ text });
      else {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }
    } catch {}
  };

  const handlePwdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPwdErr("");
    setPwdSuccess("");
    if (!newPwd || !confirmPwd) {
      setPwdErr("Preencha as senhas");
      return;
    }
    if (newPwd !== confirmPwd) {
      setPwdErr("As senhas não coincidem");
      return;
    }
    const res = changePassword(currentUser, newPwd);
    if (!res.success) {
      setPwdErr(res.error || "Erro ao trocar");
    } else {
      setPwdSuccess("Senha atualizada!");
      setNewPwd("");
      setConfirmPwd("");
      setTimeout(() => setPwdModalOpen(false), 1500);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 z-50 bg-background flex flex-col"
          >
            <div className="bg-white px-4 pt-6 pb-4 border-b border-neutral-200 flex items-center justify-between">
              <div>
                <div className="text-[10px] tracking-[0.22em] font-bold text-neutral-500">
                  CONFIGURAÇÕES
                </div>
                <div className="modular-display text-3xl text-neutral-900">AJUSTES</div>
              </div>
              <button onClick={onClose} className="p-2 text-neutral-500 active:scale-95 transition">
                <X size={28} />
              </button>
            </div>

            <div className="bg-neutral-50 p-4 space-y-3 flex-1 overflow-y-auto">
              {/* Profile Section */}
              <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="w-full p-4 flex items-center justify-between bg-white hover:bg-neutral-50 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-400 text-yellow-900 rounded-full flex items-center justify-center">
                      <User size={20} />
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Perfil</div>
                      <div className="font-display font-black text-neutral-800 text-lg uppercase">{currentUser}</div>
                    </div>
                  </div>
                  <ChevronDown
                    className={`text-neutral-400 transition-transform ${profileOpen ? "rotate-180" : ""}`}
                  />
                </button>
                
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden border-t border-neutral-100 bg-neutral-50/50"
                    >
                      <div className="p-3 space-y-2">
                        <div className="w-full bg-white border border-neutral-200 rounded-lg p-3 flex items-center justify-between shadow-sm">
                          <div>
                            <div className="text-[10px] font-bold text-neutral-400 uppercase">Sua senha atual</div>
                            <div className="font-mono text-sm text-neutral-700 mt-0.5 tracking-wider">
                              {showCurrentPwd ? currentPwd : "•".repeat(Math.max(currentPwd.length, 6))}
                            </div>
                          </div>
                          <button
                            onClick={() => setShowCurrentPwd(!showCurrentPwd)}
                            className="p-2 text-neutral-500 hover:text-neutral-800 active:scale-95 transition bg-neutral-100 rounded-lg"
                          >
                            {showCurrentPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                        
                        <button
                          onClick={() => {
                            setPwdModalOpen(true);
                            setPwdSuccess("");
                            setPwdErr("");
                            setNewPwd("");
                            setConfirmPwd("");
                          }}
                          className="w-full bg-white border border-neutral-200 text-neutral-800 rounded-lg p-3 flex items-center gap-3 font-bold shadow-sm active:scale-[0.98] transition"
                        >
                          <Key size={18} className="text-neutral-500" />
                          <span>Trocar de senha</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={share}
                className="w-full bg-[#00C671] text-white rounded-xl p-4 flex items-center gap-3 font-display font-bold shadow active:scale-[0.98] transition"
              >
                {copied ? <Check /> : <Share2 />}
                <div className="text-left flex-1">
                  <div>Compartilhar repetidas</div>
                  <div className="text-xs font-normal opacity-90">
                    {duplicatesList.length} tipos disponíveis
                  </div>
                </div>
              </button>

              {!confirm ? (
                <button
                  onClick={() => setConfirm(true)}
                  className="w-full bg-white border border-neutral-200 text-neutral-800 rounded-xl p-4 flex items-center gap-3 font-display font-bold shadow-sm active:scale-[0.98] transition"
                >
                  <RotateCcw />
                  <span>Zerar álbum</span>
                </button>
              ) : (
                <div className="bg-white border-2 border-rose-500 rounded-xl p-4 space-y-3">
                  <div className="text-sm font-bold">Tem certeza? Esta ação não pode ser desfeita.</div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { resetAlbum(); setConfirm(false); }}
                      className="flex-1 bg-rose-600 text-white rounded-lg py-2 font-display font-bold"
                    >
                      Sim, zerar
                    </button>
                    <button
                      onClick={() => setConfirm(false)}
                      className="flex-1 bg-neutral-100 text-neutral-800 rounded-lg py-2 font-display font-bold"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={() => signOut()}
                className="w-full bg-neutral-900 text-white rounded-xl p-4 flex items-center gap-3 font-display font-bold shadow active:scale-[0.98] transition"
              >
                <LogOut />
                <span>Sair</span>
              </button>

              <div className="bg-white border border-neutral-200 rounded-xl p-4 text-xs text-neutral-600">
                <p className="font-bold text-neutral-900 mb-1">Como usar</p>
                <p>Toque na figurinha para marcar como <b className="text-[#00C671]">colada</b>.</p>
                <p>Use <b>−</b> / <b>+</b> abaixo para controlar suas <b className="text-rose-600">repetidas</b> na aba Todas.</p>
                <p>Toque na lixeira para voltar a <b>faltante</b>.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {pwdModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.form
              onSubmit={handlePwdSubmit}
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl relative"
            >
              <button
                type="button"
                onClick={() => setPwdModalOpen(false)}
                className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 active:scale-95"
              >
                <X size={20} />
              </button>
              <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                <Key className="text-neutral-700" size={24} />
              </div>
              <h2 className="text-xl font-display font-black text-neutral-900 mb-4 tracking-tight">Trocar de senha</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-neutral-500 block mb-1">Nova senha</label>
                  <input
                    type="password"
                    value={newPwd}
                    onChange={(e) => setNewPwd(e.target.value)}
                    className="w-full bg-neutral-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-yellow-400 text-neutral-800"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-500 block mb-1">Confirmar senha</label>
                  <input
                    type="password"
                    value={confirmPwd}
                    onChange={(e) => setConfirmPwd(e.target.value)}
                    className="w-full bg-neutral-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-yellow-400 text-neutral-800"
                  />
                </div>
              </div>

              {pwdErr && <p className="text-rose-500 text-xs font-bold mt-3 text-center">{pwdErr}</p>}
              {pwdSuccess && <p className="text-[#00C671] text-xs font-bold mt-3 text-center">{pwdSuccess}</p>}

              <button
                type="submit"
                className="w-full mt-5 py-3 bg-neutral-900 text-white font-bold rounded-xl active:scale-95 transition shadow-lg shadow-neutral-900/20"
              >
                Confirmar
              </button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
