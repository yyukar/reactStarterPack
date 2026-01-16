import { useState } from "react";

export default function CounterPage() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h2>Counter (State + Event)</h2>
      <p>Sayaç: <b>{count}</b></p>

      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => setCount((c) => c + 1)}>Artır</button>
        <button onClick={() => setCount((c) => c - 1)}>Azalt</button>
        <button onClick={() => setCount(0)}>Sıfırla</button>
      </div>
    </>
  );
}
