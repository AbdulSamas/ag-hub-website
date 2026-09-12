import { Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "@/lib/cart";
import { WishlistProvider } from "./context/WishlistContext";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";

import HomePage from "@/pages/HomePage";
import ShopPage from "@/pages/ShopPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import CheckoutPage from "@/pages/CheckoutPage";
import WishlistPage from "./pages/WishlistPage";
import NotFoundPage from "@/pages/NotFoundPage";
import ProfilePage from "@/pages/ProfilePage";
import OrdersPage from "@/pages/OrdersPage";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import AddProduct from "./pages/admin/AddProduct";
import Orders from "./pages/admin/Orders";
import OrderDetails from "./pages/admin/OrderDetails";
import Offers from "./pages/admin/Offers";
import Users from "./pages/admin/Users";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import { SilkBackground } from "./components/ui/silk-background-animation";
import ResetPasswordPage from "@/pages/ResetPasswordPage";

function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <WishlistProvider>
      <CartProvider>
        <div className="relative min-h-screen overflow-x-hidden bg-[#050505] text-white">

          {/* =========================================
              FULL WEBSITE SILK BACKGROUND
          ========================================= */}
          {!isAdmin && (
            <div className="pointer-events-none fixed inset-0 z-0">
              <SilkBackground />
            </div>
          )}

          {/* =========================================
              DARK OVERLAY
          ========================================= */}
          {!isAdmin && (
            <div className="pointer-events-none fixed inset-0 z-[1] bg-black/60" />
          )}

          {/* =========================================
              WEBSITE CONTENT
          ========================================= */}
          <div className="relative z-10 flex min-h-screen flex-col">

            {!isAdmin && <Navbar />}

            <main className="flex-1">
              <Routes>

                {/* ================= HOME ================= */}
                <Route path="/" element={<HomePage />} />

                {/* ================= SHOP ================= */}
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/shop/:category" element={<ShopPage />} />

                {/* ================= PRODUCT ================= */}
                <Route
                  path="/product/:slug"
                  element={<ProductDetailPage />}
                />

                {/* ================= CHECKOUT ================= */}
                <Route
                  path="/checkout"
                  element={<CheckoutPage />}
                />

                {/* ================= WISHLIST ================= */}
                <Route
                  path="/wishlist"
                  element={<WishlistPage />}
                />

                {/* ================= PROFILE ================= */}
                <Route
                  path="/profile"
                  element={<ProfilePage />}
                />

                {/* ================= ORDERS ================= */}
                <Route
                  path="/orders"
                  element={<OrdersPage />}
                />

                {/* ================= USER AUTH ================= */}
                <Route
                  path="/login"
                  element={<LoginPage />}
                />

                <Route
                  path="/signup"
                  element={<SignupPage />}
                />

                {/* ================= ADMIN LOGIN ================= */}
                <Route
                  path="/admin/login"
                  element={<AdminLogin />}
                />

                {/* ================= ADMIN ================= */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Dashboard />} />

                  <Route
                    path="dashboard"
                    element={<Dashboard />}
                  />

                  <Route
                    path="products"
                    element={<Products />}
                  />

                  <Route
                    path="products/new"
                    element={<AddProduct />}
                  />

                  <Route
                    path="products/edit/:id"
                    element={<AddProduct />}
                  />

                  <Route
                    path="orders"
                    element={<Orders />}
                  />

                  <Route
                    path="orders/:id"
                    element={<OrderDetails />}
                  />

                  <Route
                    path="offers"
                    element={<Offers />}
                  />

                  <Route
                    path="users"
                    element={<Users />}
                  />
                </Route>

                <Route
  path="/reset-password"
  element={<ResetPasswordPage />}
/>

                {/* ================= 404 ================= */}
                <Route
                  path="*"
                  element={<NotFoundPage />}
                />

              </Routes>
            </main>

            {!isAdmin && <Footer />}
            {!isAdmin && <CartDrawer />}

          </div>
        </div>
      </CartProvider>
    </WishlistProvider>
  );
}

export default App;