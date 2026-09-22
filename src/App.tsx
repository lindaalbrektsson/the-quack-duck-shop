import { Route, Routes } from "react-router-dom";
import CustomerInfoForm from "./components/CustomerInfoForm/CustomerInfoForm";

import "./App.css";
import AppLayout from "./components/AppLayout";
import ProductListPage from "./pages/ProductListPage/ProductListPage";

const App = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<ProductListPage />} />
        <Route path="/checkout" element={<CustomerInfoForm />} />
      </Route>
    </Routes>
  );
};

export default App;
