import { Outlet } from "react-router-dom";

import Footer from "./Footer/Footer";
import Header from "./Header/Header";

function AppLayout() {
  return (
    <div className="app-layout">
      <Header />

      <main className="main">
        <div className="main-content">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default AppLayout;
