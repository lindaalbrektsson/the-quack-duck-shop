import { Route, Routes } from "react-router-dom";

import "./App.css";
import AppLayout from "./components/AppLayout";
import ProductListPage from "./pages/ProductListPage/ProductListPage";

const App = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<ProductListPage />} />
      </Route>
    </Routes>
  );
};

export default App;
