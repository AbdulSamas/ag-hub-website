import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Heart, ShoppingBag, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import SearchModal from "@/components/SearchModal";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/context/WishlistContext";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "New In", path: "/shop?filter=new" },
  { label: "Men", path: "/shop/Men" },
  { label: "Women", path: "/shop/Women" },
  { label: "Cosmetics", path: "/shop/Cosmetics" },
  { label: "Shoes", path: "/shop/Shoes" },
  { label: "Accessories", path: "/shop/Accessories" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const { count, openCart } = useCart();
  const { wishlist } = useWishlist();

  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 0.6,
          ease: [0.22, 1, 0.36, 1] as const,
        }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "glass shadow-soft" : "bg-transparent"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between h-[68px] sm:h-[76px]">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <span className="clash text-[22px] sm:text-[23px] font-bold tracking-tight text-ink">
                AG<span className="text-primary">HUB</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <ul className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-[13px] font-medium text-ink/60 hover:text-ink transition-colors duration-200 link-underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Right Icons */}
            <div className="flex items-center gap-1.5">

              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-ink/5 transition-colors"
              >
                <Search size={17} className="text-ink/70" />
              </button>

              {/* Wishlist */}
              <button
                onClick={() => navigate("/wishlist")}
                className="hidden sm:flex w-9 h-9 items-center justify-center rounded-full hover:bg-ink/5 transition-colors relative"
              >
                <Heart size={17} className="text-ink/70" />

                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Cart */}
              <button
                onClick={openCart}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-ink/5 transition-colors relative"
              >
                <ShoppingBag size={17} className="text-ink/70" />

                {count > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-accent text-primary text-[10px] font-bold rounded-full flex items-center justify-center">
                    {count}
                  </span>
                )}
              </button>

              {/* Mobile Menu */}
              <button
                className="lg:hidden w-9 h-9 flex items-center justify-center ml-1"
                onClick={() => setMobileOpen(true)}
              >
                <Menu size={20} className="text-ink" />
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-cream flex flex-col"
          >
            <div className="flex items-center justify-between px-5 h-[68px] sm:h-[76px] border-b border-ink/5">
              <span className="clash text-[22px] font-bold tracking-tight text-ink">
                AG<span className="text-primary">HUB</span>
              </span>

              <button
                onClick={() => setMobileOpen(false)}
                className="w-9 h-9 flex items-center justify-center"
              >
                <X size={20} className="text-ink" />
              </button>
            </div>

            <nav className="flex-1 flex flex-col justify-center gap-0 px-6">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setMobileOpen(false)}
                    className="text-[24px] font-semibold text-ink py-3 border-b border-ink/5 hover:text-primary transition-colors block"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="px-6 pb-10 flex gap-3 items-center">

              {/* Search */}
              <button
                onClick={() => {
                  setMobileOpen(false);
                  navigate("/shop");
                }}
                className="w-11 h-11 flex items-center justify-center rounded-full bg-ink/5"
              >
                <Search size={18} className="text-ink" />
              </button>

              {/* Wishlist */}
              <button
                onClick={() => {
                  setMobileOpen(false);
                  navigate("/wishlist");
                }}
                className="w-11 h-11 flex items-center justify-center rounded-full bg-ink/5 relative"
              >
                <Heart size={18} className="text-ink" />

                {wishlist.length > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>

              {/* Cart */}
              <button
                onClick={() => {
                  setMobileOpen(false);
                  openCart();
                }}
                className="w-11 h-11 flex items-center justify-center rounded-full bg-ink/5 relative"
              >
                <ShoppingBag size={18} className="text-ink" />

                {count > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full" />
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}