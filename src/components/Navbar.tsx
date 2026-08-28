import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Heart, ShoppingBag, User, Menu, X } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import SearchModal from "@/components/SearchModal";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/context/WishlistContext";
import { supabase } from "@/lib/supabase";
import { useEffect as useReactEffect } from "react";

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
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  const { count, openCart } = useCart();
  const { wishlist } = useWishlist();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useReactEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Close mobile menu on route change
  

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
          scrolled ? "glass-nav shadow-[0_8px_30px_rgba(0,0,0,0.3)]" : "bg-transparent"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between h-[68px] sm:h-[76px]">
           {/* Logo */}
<Link
  to="/"
  className="flex items-center shrink-0"
>
  <img
    src="/images/image.png"
    alt="AGHUB"
    className="h-10 sm:h-12 w-auto object-contain shrink-0"
  />
</Link>
            {/* Desktop Navigation */}
         <ul className="hidden lg:flex items-center justify-center gap-8 flex-1">
  {navLinks.map((link) => (
    <li key={link.label}>
      <Link
        to={link.path}
        className="text-[13px] font-medium text-white/60 hover:text-white transition-colors duration-200 link-underline"
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
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
                aria-label="Search"
              >
                <Search size={17} className="text-white/70" />
              </button>

              {/* Account */}
              <button
                onClick={() => navigate(user ? "/profile" : "/login")}
                className="hidden sm:flex w-9 h-9 items-center justify-center rounded-full hover:bg-white/10 transition-colors"
                aria-label="Account"
              >
                <User size={17} className="text-white/70" />
              </button>

              {/* Wishlist */}
              <button
                onClick={() => navigate("/wishlist")}
                className="hidden sm:flex w-9 h-9 items-center justify-center rounded-full hover:bg-white/10 transition-colors relative"
                aria-label="Wishlist"
              >
                <Heart size={17} className="text-white/70" />

                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Cart */}
              <button
                onClick={openCart}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors relative"
                aria-label="Cart"
              >
                <ShoppingBag size={17} className="text-white/70" />

                {count > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-accent text-primary text-[10px] font-bold rounded-full flex items-center justify-center">
                    {count}
                  </span>
                )}
              </button>
              <button
  type="button"
  onClick={() => setMobileOpen(true)}
  className="lg:hidden w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
  aria-label="Open menu"
>
  <Menu size={20} className="text-white" />
</button>

              {/* Mobile Menu */}
             
            </div>
          </div>
        </div>
      </motion.nav>
      <AnimatePresence>
  {mobileOpen && (
    <motion.div
      initial={{ opacity: 0, x: "100%" }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: "100%" }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[100] bg-[#0a0a0f] lg:hidden"
    >
      <div className="flex items-center justify-between px-5 h-[68px] border-b border-white/10">
        <Link to="/" onClick={() => setMobileOpen(false)}>
          <img
            src="/images/image.png"
            alt="AGHUB"
            className="h-10 w-auto object-contain"
          />
        </Link>

        <button
          onClick={() => setMobileOpen(false)}
          className="w-9 h-9 flex items-center justify-center"
          aria-label="Close menu"
        >
          <X size={22} className="text-white" />
        </button>
      </div>

      <nav className="px-6 pt-8">
        {navLinks.map((link) => (
          <Link
            key={link.label}
            to={link.path}
            onClick={() => setMobileOpen(false)}
            className="block py-4 border-b border-white/10 text-xl font-medium text-white"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </motion.div>
  )}
</AnimatePresence>

      {/* Mobile Menu */}
      

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}