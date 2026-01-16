# Mini React Demo – Adım Adım Açıklama (Eğitim Notları)

Bu README, çalışan “mini demo app” projesindeki tüm parçaları **en baştan en sona** adım adım açıklar. Proje tek yerde şu konuları gösterir:

- **Component / Props**
- **State**
- **Event handling**
- **Context API (tema)**
- **Lifecycle / useEffect + cleanup**
- **Fetching**
- **Routing**
- **Form handling + validation**
- **Localization (Intl)**
- **Testing (Vitest + React Testing Library)**

---

## 1) Projenin amacı: “React’in temel taşlarını tek yerde görmek”

Bu mini app aynı anda şunları göstermek için tasarlandı:

- **Component / Props** (Home sayfasında)
- **State** ve **Event handling** (Counter)
- **Context API** (Tema)
- **Lifecycle / useEffect + cleanup** (Users sayfası)
- **Fetching** (Users sayfası)
- **Routing** (Sayfalar arası geçiş)
- **Form handling + validation** (Form sayfası)
- **Localization (Intl)** (Localization sayfası)
- **Testing (Vitest + React Testing Library)** (Counter testi)

---

## 2) React uygulaması nasıl ayağa kalkıyor? (`main.jsx`)

`src/main.jsx` en kritik dosyalardan biri. Burada React uygulamasını DOM’a bağlıyoruz:

```jsx
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
```

### Sıralama neden önemli?
- `<App />` en “ana” component.
- `BrowserRouter` → App içindeki sayfa yönlendirmelerini çalıştırır (`<Routes>`, `<Link>` vs).
- `ThemeProvider` → bütün uygulama içinde tema bilgisini paylaşır (Context).
- `StrictMode` → geliştirme ortamında bazı şeyleri ekstra kontrol eder (özellikle `useEffect`’leri dev’de 2 kez tetikleyebilir; aşağıda notu var).

> Özet: **App, Router + ThemeProvider’ın içinde** render ediliyor; bu sayede her sayfa tema bilgisine erişebiliyor ve routing çalışıyor.

---

## 3) Context API: Tema bilgisini “global” paylaşma

`src/context/ThemeContext.jsx` içinde 3 şey yapıyoruz:

1) `createContext()` ile bir context oluşturuyoruz.  
2) Provider component yazıp uygulamanın etrafına sarıyoruz.  
3) `useTheme()` diye kolay kullanım hook’u veriyoruz.

Mantık:
- `theme` state’i Provider’da duruyor.
- `toggleTheme` ile state değişiyor.
- `value={{ theme, toggleTheme }}` ile bütün alt component’lere paylaşılıyor.

Bu sayede, örneğin `Nav.jsx` içinde prop taşımadan şunu yapabiliyoruz:

```jsx
const { theme, toggleTheme } = useTheme();
```

### Neden `useMemo`?
Provider her render olduğunda `value` objesi yeniden oluşursa alt component’ler gereksiz render olabilir. `useMemo` bunu azaltır.

> Context API, “tema / auth / dil” gibi ortak veriler için ideal. Çok sık değişen veriler için bazen performans düşünmek gerekir.

---

## 4) Routing: Sayfalar arası geçiş (`App.jsx` + `Nav.jsx`)

### `src/App.jsx`
Burada layout + route’lar var:

- `<Nav />` üst menü
- `<Routes>` içinde sayfa eşleşmeleri:
  - `/` → Home
  - `/counter` → CounterPage
  - `/users` → UsersPage
  - `/form` → FormPage
  - `/localization` → LocalizationPage
  - `*` → 404

### `src/components/Nav.jsx`
`NavLink` kullanıyoruz:
- `isActive` ile aktif linki farklı gösterebiliyoruz.
- Ayrıca tema butonu da burada (Context’ten geliyor).

> Routing’in olayı: “Sayfa değişiyor gibi görünür ama aslında tek sayfa içinde component değişir (SPA).”

---

## 5) Component / Props: “Veri parent’tan child’a” (`Home.jsx`)

Home sayfasında:

```jsx
function Greeting({ name }) {
  return <p>Merhaba, <b>{name}</b></p>;
}
```

- `Greeting` bir component
- `{ name }` props
- Parent (`Home`) `name="Yusuf"` gibi değer gönderiyor.

### Props kuralı
- Child props’u değiştirmez (read-only).
- Değişecek veri state olmalı (parent’ta veya context’te).

---

## 6) State + Event Handling: Counter (`CounterPage.jsx`)

Counter’da:
- `const [count, setCount] = useState(0);` → state tanımı
- `onClick={() => setCount(c => c + 1)}` → event ile state güncelleme

### Neden `setCount((c) => c + 1)` daha iyi?
React state güncellemeleri bazen “batch” olur. “Bir önceki değere göre” güncelleme yaparken functional updater daha güvenlidir.

### Ne oluyor?
- Button’a tıklıyorsun → event çalışıyor → state değişiyor → component re-render → yeni sayı ekranda.

---

## 7) Lifecycle / useEffect + Fetching + Cleanup: Users (`UsersPage.jsx`)

Bu sayfa React’in “side effect” mantığını gösteriyor.

### 7.1 `useEffect(() => { ... }, [])` ne demek?
- `[]` boş bağımlılık dizisi → effect **ilk mount** olduğunda çalışır (sayfaya ilk girince).

### 7.2 Fetch akışı
- `loading` true yapılır
- `fetch(...)` ile veri çekilir
- başarılıysa `setUsers(data)`
- hata varsa `setError(...)`
- en sonda `setLoading(false)`

Bu sayede UI’da 3 durum yönetilir:
1) Yükleniyor  
2) Hata  
3) Başarılı veri  

### 7.3 Cleanup (AbortController) niye var?
Effect içinde:

```js
const controller = new AbortController();
...
return () => controller.abort();
```

Bu şunun için:
- Sayfadan çıkarsan (unmount) → devam eden request iptal olsun
- “unmounted component’a state basma” gibi sorunları engeller

### 7.4 StrictMode notu (önemli)
Dev ortamında `React.StrictMode` bazı effect’leri **2 kez tetikleyebilir** (sadece development’ta). Bu yüzden bazen “2 kez fetch attı” gibi görünebilir. Öğrenme amaçlı projede bu normal; gerçek projede:
- cache (React Query) veya
- idempotent fetch / guard
kullanılır.

---

## 8) Form Handling + Validation: (`FormPage.jsx`)

Bu sayfa şunları öğretir:
- Controlled input
- Validation
- “Touched” mantığı (hata mesajını hemen değil, kullanıcı etkileşince gösterme)
- Submit yönetimi

### 8.1 Controlled input
Input’un değeri state’den gelir:

```jsx
value={values.email}
onChange={(e) => setValues(p => ({...p, email: e.target.value}))}
```

Yani input “kendi kendine” yaşamıyor; React state kontrol ediyor.

### 8.2 Validation (useMemo)
```js
const errors = useMemo(() => {
  const e = {};
  if (!values.email.includes("@")) e.email = "Geçerli email gir";
  ...
  return e;
}, [values]);
```

- `values` değişince `errors` yeniden hesaplanır
- `isValid = Object.keys(errors).length === 0`

### 8.3 Touched
Kullanıcı inputtan çıkınca (`onBlur`) touched true olur. Böylece hata mesajını **kullanıcı etkileşmeden** göstermemiş olursun.

### 8.4 Submit
- `preventDefault()` ile sayfa yenileme engellenir
- önce touched set edilir
- valid değilse stop
- valid ise “kayıt başarılı” + form reset

> Bu, gerçek hayattaki form mantığının temel versiyonudur.

---

## 9) Localization: `Intl` ile formatlama (`LocalizationPage.jsx`)

Burada iki şey formatlanır:
- Para
- Tarih/saat

`locale` state’i değişince formatlar değişir:

```js
new Intl.NumberFormat(locale, { style: "currency", currency }).format(amount)
new Intl.DateTimeFormat(locale, { dateStyle: "full", timeStyle: "short" }).format(date)
```

Avantaj:
- ekstra kütüphane olmadan “format” kısmını halledersin
- Çok dilli metinler için genelde i18next gibi kütüphaneler eklenir (sonraki seviye)

---

## 10) Testing: Vitest + React Testing Library

### 10.1 `jsdom` neden gerekiyor?
React component testinde “DOM varmış gibi” davranmak gerekir. Node ortamında gerçek tarayıcı yok; `jsdom` bunu simüle eder.

`vite.config.js` içindeki:

```js
test: { environment: "jsdom", ... }
```

bunu söyler.

### 10.2 `setupTests.js` ne yapıyor?
Bu dosya test başlamadan önce çalışır. Örn:

```js
import "@testing-library/jest-dom/vitest";
```

Bu import, `toHaveTextContent`, `toBeInTheDocument` gibi **ek matcher’ları** ekler.

### 10.3 Test dosyası nasıl çalışıyor?
`CounterPage.test.jsx` içinde:

- `render(<CounterPage />)` → component’i sanal DOM’a basar
- `screen.getByRole(...)` gibi query’lerle element bulursun
- `userEvent.click(...)` ile kullanıcı davranışını simüle edersin
- `expect(...)` ile sonucu doğrularsın

> RTL felsefesi: “Component’in iç implementation’ını değil, kullanıcının gördüğünü test et.”

---

## 11) Bu projeyi öğrenme sırasına göre nasıl çalışmalısın?

1) Home → Props mantığı  
2) Counter → State + event  
3) Theme → Context  
4) Users → useEffect + fetch + cleanup + loading/error UI  
5) Form → controlled + validation  
6) Localization → Intl format  
7) Test → render + userEvent + expect  

---
