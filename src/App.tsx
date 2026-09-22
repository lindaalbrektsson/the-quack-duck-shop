import { Route, Routes } from "react-router-dom";

import "./App.css";
import AppLayout from "./components/AppLayout";
import ProductListPage from "./pages/ProductListPage/ProductListPage";
import ProductDetailsPage from "./pages/ProductDetailsPage/ProductDetailsPage";

const App = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<ProductListPage />} />
        <Route path="/products/:id" element={<ProductDetailsPage/>}/>
      </Route>
    </Routes>
  );
};

export default App;
