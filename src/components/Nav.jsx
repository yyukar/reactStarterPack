import { NavLink } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const linkStyle = ({ isActive }) => ({
  padding: "8px 10px",
  borderRadius: 8,
  textDecoration: "none",
  border: "1px solid #ccc",
  fontWeight: isActive ? 700 : 400,
});

export default function Nav() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
      <NavLink to="/" style={linkStyle}>Home</NavLink>
      <NavLink to="/counter" style={linkStyle}>Counter</NavLink>
      <NavLink to="/users" style={linkStyle}>Users (Fetch)</NavLink>
      <NavLink to="/form" style={linkStyle}>Form</NavLink>
      <NavLink to="/localization" style={linkStyle}>Localization</NavLink>

      <button onClick={toggleTheme} style={{ marginLeft: "auto", padding: "8px 10px" }}>
        Tema: {theme} (değiştir)
      </button>
    </header>
  );
}
