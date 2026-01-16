function Greeting({ name }) {
  return <p>Merhaba, <b>{name}</b> 👋</p>;
}

export default function Home() {
  return (
    <>
      <h2>Mini React Demo</h2>
      <p>Bu proje: props, state, event, context, effect, i18n, fetch, routing, form, test içerir.</p>

      <h3>Props / Component</h3>
      <Greeting name="Yusuf" />
      <Greeting name="Ayşe" />
    </>
  );
}
