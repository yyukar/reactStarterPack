import { useEffect, useState } from "react";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // lifecycle: mount -> fetch başlat
    // cleanup örneği (request iptali)
    const controller = new AbortController();

    async function load() {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("https://jsonplaceholder.typicode.com/users", {
          signal: controller.signal,
        });

        if (!res.ok) throw new Error("İstek başarısız");
        const data = await res.json();
        setUsers(data);
      } catch (e) {
        if (e.name !== "AbortError") setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    load();

    // unmount olunca cleanup
    return () => controller.abort();
  }, []);

  return (
    <>
      <h2>Users (Fetch + useEffect)</h2>

      {loading && <p>Yükleniyor...</p>}
      {error && <p>Hata: {error}</p>}

      {!loading && !error && (
        <ul>
          {users.map((u) => (
            <li key={u.id}>
              {u.name} — <small>{u.email}</small>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
