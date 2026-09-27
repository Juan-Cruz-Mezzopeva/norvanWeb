import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import CartDrawer from "./CartDrawer";
import Toast from "./Toast";

export default function Layout() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
      <CartDrawer />
      <Toast />
    </>
  );
}
