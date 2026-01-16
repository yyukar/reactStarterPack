import { useState } from "react";

export default function LocalizationPage() {
  const [locale, setLocale] = useState("tr-TR");
  const amount = 12345.67;
  const date = new Date();

  const currency = locale === "tr-TR" ? "TRY" : "USD";

  const money = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);

  const formattedDate = new Intl.DateTimeFormat(locale, {
    dateStyle: "full",
    timeStyle: "short",
  }).format(date);

  return (
    <>
      <h2>Localization (Intl)</h2>

      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <span>Dil:</span>
        <select value={locale} onChange={(e) => setLocale(e.target.value)}>
          <option value="tr-TR">tr-TR</option>
          <option value="en-US">en-US</option>
        </select>
      </div>

      <p style={{ marginTop: 12 }}>Tutar: <b>{money}</b></p>
      <p>Tarih: <b>{formattedDate}</b></p>
    </>
  );
}
