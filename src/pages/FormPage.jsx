import { useMemo, useState } from "react";

export default function FormPage() {
  const [values, setValues] = useState({ email: "", password: "" });
  const [touched, setTouched] = useState({ email: false, password: false });

  const errors = useMemo(() => {
    const e = {};
    if (!values.email.includes("@")) e.email = "Geçerli email gir";
    if (values.password.length < 6) e.password = "Şifre en az 6 karakter";
    return e;
  }, [values]);

  const isValid = Object.keys(errors).length === 0;

  function handleSubmit(ev) {
    ev.preventDefault();
    setTouched({ email: true, password: true });
    if (!isValid) return;

    alert(`Kayıt OK ✅\nEmail: ${values.email}`);
    setValues({ email: "", password: "" });
    setTouched({ email: false, password: false });
  }

  return (
    <>
      <h2>Form (Controlled + Validation)</h2>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12, maxWidth: 420 }}>
        <label>
          Email
          <input
            value={values.email}
            onChange={(e) => setValues((p) => ({ ...p, email: e.target.value }))}
            onBlur={() => setTouched((p) => ({ ...p, email: true }))}
            placeholder="ornek@mail.com"
            style={{ display: "block", width: "100%", marginTop: 6 }}
          />
          {touched.email && errors.email && <small>{errors.email}</small>}
        </label>

        <label>
          Şifre
          <input
            type="password"
            value={values.password}
            onChange={(e) => setValues((p) => ({ ...p, password: e.target.value }))}
            onBlur={() => setTouched((p) => ({ ...p, password: true }))}
            placeholder="******"
            style={{ display: "block", width: "100%", marginTop: 6 }}
          />
          {touched.password && errors.password && <small>{errors.password}</small>}
        </label>

        <button type="submit" disabled={!isValid}>
          Kaydol
        </button>
      </form>
    </>
  );
}
