const USERS_KEY = "fifa26-users";

function getLocalAlbums() {
  const albums: Record<string, any> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith("fifa26-album-v2-")) {
      const user = key.replace("fifa26-album-v2-", "");
      try {
        albums[user] = JSON.parse(localStorage.getItem(key) || "{}");
      } catch {}
    }
  }
  return albums;
}

function getLocalUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
  } catch {
    return {};
  }
}

export async function syncWithServer() {
  try {
    const payload = {
      users: getLocalUsers(),
      albums: getLocalAlbums()
    };

    const res = await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error("Sync failed");
    
    const serverData = await res.json();

    // Overwrite local data with merged server data
    localStorage.setItem(USERS_KEY, JSON.stringify(serverData.users));
    
    for (const [user, album] of Object.entries(serverData.albums)) {
      localStorage.setItem(`fifa26-album-v2-${user}`, JSON.stringify(album));
    }
    
    window.dispatchEvent(new CustomEvent("database-synced"));
    return true;
  } catch (err) {
    console.error("Erro ao sincronizar com o servidor:", err);
    return false;
  }
}
