import { Routes, Route } from "react-router-dom";
import Nav from "./components/Nav";
import Home from "./pages/Home";
import CounterPage from "./pages/CounterPage";
import UsersPage from "./pages/UsersPage";
import FormPage from "./pages/FormPage";
import LocalizationPage from "./pages/LocalizationPage";
import { useTheme } from "./context/ThemeContext";

export default function App() {
  const { theme } = useTheme();

  const bg = theme === "dark" ? "#111" : "#fafafa";
  const fg = theme === "dark" ? "#f5f5f5" : "#111";

  return (
    <div style={{ minHeight: "100vh", background: bg, color: fg }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: 16 }}>
        <Nav />
        <main style={{ marginTop: 16, padding: 16, border: "1px solid #ccc", borderRadius: 12 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/counter" element={<CounterPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/form" element={<FormPage />} />
            <Route path="/localization" element={<LocalizationPage />} />
            <Route path="*" element={<h2>404</h2>} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

