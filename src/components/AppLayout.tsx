import Footer from "./Footer";
import Header from "./Header";

function AppLayout() {
  return (
    <div className="app-layout">
      <Header />

      <main className="main">
        <div className="main-content">{}</div>
      </main>

      <Footer />
    </div>
  );
}

export default AppLayout;
