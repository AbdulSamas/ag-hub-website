import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  Home,
  Sparkles,
  Shirt,
  SparklesIcon,
  Footprints,
  Tag,

} from "lucide-react";

import { Link, useNavigate, useLocation } from "react-router-dom";

import SearchModal from "@/components/SearchModal";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/context/WishlistContext";
import { supabase } from "@/lib/supabase";



const navLinks = [
  { label: "Home", path: "/", icon: Home },
  { label: "New In", path: "/shop?filter=new", icon: Sparkles },
  { label: "Men", path: "/shop/Men", icon: Shirt },
  { label: "Women", path: "/shop/Women", icon: Heart },
  { label: "Cosmetics", path: "/shop/Cosmetics", icon: SparklesIcon },
  { label: "Shoes", path: "/shop/Shoes", icon: Footprints },
  { label: "Accessories", path: "/shop/Accessories", icon: ShoppingBag },
];

const menCategories = [
  { label: "Shirts", path: "/shop/Men?category=Shirts" },
  { label: "T-Shirts", path: "/shop/Men?category=T-Shirts" },
  { label: "Pants", path: "/shop/Men?category=Pants" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menOpen, setMenOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
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

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileOpen(false);
    setMenOpen(false);
  }, [location.pathname, location.search]);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      {/* ================= DESKTOP / MAIN NAVBAR ================= */}

      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 0.6,
          ease: [0.22, 1, 0.36, 1] as const,
        }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "glass-nav shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
            : "bg-transparent"
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
                onClick={() =>
                  navigate(user ? "/profile" : "/login")
                }
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

              {/* Mobile Menu Button */}
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="lg:hidden w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
                aria-label="Open menu"
              >
                <Menu size={16} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* ================= PREMIUM MOBILE MENU ================= */}

<AnimatePresence>
  {mobileOpen && (
    <>
      {/* Glass background overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={() => setMobileOpen(false)}
        className="fixed inset-0 z-[90] bg-black/35 backdrop-blur-md lg:hidden"
      />

      {/* Mobile Drawer */}
      <motion.aside
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{
          duration: 0.38,
          ease: [0.22, 1, 0.36, 1],
        }}
       className="
  fixed top-0 left-0 bottom-0 z-[100]
  w-[76%] max-w-[290px]
  text-white lg:hidden
  overflow-hidden
  bg-black/45
  backdrop-blur-2xl
  border-r border-white/10
  shadow-[20px_0_60px_rgba(0,0,0,0.35)]
"
      >
        <div className="h-full flex flex-col">

          {/* ================= HEADER ================= */}

          <div className="flex items-center justify-between px-4 pt-3 pb-2.5 border-b border-white/[0.08]">

            <Link
              to="/"
              onClick={() => setMobileOpen(false)}
              className="flex items-center"
            >
              <img
                src="/images/image.png"
                alt="AG HUB"
                className="h-7 w-auto object-contain"
              />
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="
                w-8 h-8 rounded-full
                border border-white/10
                flex items-center justify-center
                hover:bg-white/10 transition
              "
              aria-label="Close menu"
            >
              <X size={15} />
            </button>

          </div>

          {/* ================= MENU TITLE ================= */}

          <div className="px-4 pt-3 pb-1.5">
            <p className="text-[9px] tracking-[0.32em] uppercase text-[#C9A45C] font-medium">
              Menu
            </p>
          </div>

          {/* ================= NAVIGATION ================= */}

          <div className="flex-1 overflow-hidden px-3">

            {/* ================= NEW IN ================= */}

            <Link
              to="/shop?filter=new"
              onClick={() => setMobileOpen(false)}
              className="
                group flex items-center justify-between
                px-2.5 py-2
                rounded-lg
                hover:bg-white/[0.06]
                transition
              "
            >
              <div className="flex items-center gap-3">

                <Sparkles
                  size={15}
                  strokeWidth={1.6}
                  className="text-white/60 group-hover:text-[#D4AF6A] transition"
                />

                <span className="text-[12px] font-medium">
                  New In
                </span>

              </div>

              <ChevronRight
                size={14}
                className="text-white/25"
              />
            </Link>

            {/* ================= SHOP ================= */}

            <div className="mt-0.5">

              <button
                type="button"
                onClick={() => setShopOpen(!shopOpen)}
                className={`
                  w-full group flex items-center justify-between
                  px-2.5 py-2
                  rounded-lg
                  transition
                  ${
                    shopOpen
                      ? "bg-white/[0.06]"
                      : "hover:bg-white/[0.06]"
                  }
                `}
              >

                <div className="flex items-center gap-3">

                  <ShoppingBag
                    size={15}
                    strokeWidth={1.6}
                    className={
                      shopOpen
                        ? "text-[#D4AF6A]"
                        : "text-white/60"
                    }
                  />

                  <span className="text-[12px] font-medium">
                    Shop
                  </span>

                </div>

                {shopOpen ? (
                  <ChevronDown
                    size={14}
                    className="text-[#D4AF6A]"
                  />
                ) : (
                  <ChevronRight
                    size={14}
                    className="text-white/25"
                  />
                )}

              </button>

              {/* SHOP CONTENT */}

              <AnimatePresence initial={false}>
                {shopOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    className="overflow-hidden"
                  >

                    <div className="ml-8 mt-0.5">

                      {/* MEN */}

                      <button
                        type="button"
                        onClick={() => setMenOpen(!menOpen)}
                        className="
                          w-full flex items-center justify-between
                          px-2.5 py-1.5
                          rounded-md
                          hover:bg-white/[0.05]
                          transition
                        "
                      >

                        <div className="flex items-center gap-2.5">

                          <Shirt
                            size={14}
                            strokeWidth={1.6}
                            className={
                              menOpen
                                ? "text-[#D4AF6A]"
                                : "text-white/55"
                            }
                          />

                          <span className="text-[11px] font-medium">
                            Men
                          </span>

                        </div>

                        {menOpen ? (
                          <ChevronDown
                            size={13}
                            className="text-[#D4AF6A]"
                          />
                        ) : (
                          <ChevronRight
                            size={13}
                            className="text-white/25"
                          />
                        )}

                      </button>

                      {/* MEN CATEGORIES */}

                      <AnimatePresence initial={false}>
                        {menOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >

                            <div className="ml-6">

                              {menCategories.map((category) => (
                                <Link
                                  key={category.label}
                                  to={category.path}
                                  onClick={() => setMobileOpen(false)}
                                  className="
                                    flex items-center
                                    px-2.5 py-1.5
                                    text-[10.5px]
                                    text-white/50
                                    hover:text-white
                                    transition
                                  "
                                >
                                  {category.label}
                                </Link>
                              ))}

                            </div>

                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* WOMEN */}

                      <Link
                        to="/shop/Women"
                        onClick={() => setMobileOpen(false)}
                        className="
                          flex items-center gap-2.5
                          px-2.5 py-1.5
                          rounded-md
                          hover:bg-white/[0.05]
                          transition
                        "
                      >
                        <Heart
                          size={14}
                          strokeWidth={1.6}
                          className="text-white/55"
                        />

                        <span className="text-[11px] font-medium">
                          Women
                        </span>
                      </Link>

                      {/* COSMETICS */}

                      <Link
                        to="/shop/Cosmetics"
                        onClick={() => setMobileOpen(false)}
                        className="
                          flex items-center gap-2.5
                          px-2.5 py-1.5
                          rounded-md
                          hover:bg-white/[0.05]
                          transition
                        "
                      >
                        <SparklesIcon
                          size={14}
                          strokeWidth={1.6}
                          className="text-white/55"
                        />

                        <span className="text-[11px] font-medium">
                          Cosmetics
                        </span>
                      </Link>

                      {/* SHOES */}

                      <Link
                        to="/shop/Shoes"
                        onClick={() => setMobileOpen(false)}
                        className="
                          flex items-center gap-2.5
                          px-2.5 py-1.5
                          rounded-md
                          hover:bg-white/[0.05]
                          transition
                        "
                      >
                        <Footprints
                          size={14}
                          strokeWidth={1.6}
                          className="text-white/55"
                        />

                        <span className="text-[11px] font-medium">
                          Shoes
                        </span>
                      </Link>

                      {/* ACCESSORIES */}

                      <Link
                        to="/shop/Accessories"
                        onClick={() => setMobileOpen(false)}
                        className="
                          flex items-center gap-2.5
                          px-2.5 py-1.5
                          rounded-md
                          hover:bg-white/[0.05]
                          transition
                        "
                      >
                        <ShoppingBag
                          size={14}
                          strokeWidth={1.6}
                          className="text-white/55"
                        />

                        <span className="text-[11px] font-medium">
                          Accessories
                        </span>
                      </Link>

                    </div>

                  </motion.div>
                )}
              </AnimatePresence>

            </div>

            {/* ================= OFFERS ================= */}

            <Link
              to="/shop?filter=offers"
              onClick={() => setMobileOpen(false)}
              className="
                group flex items-center justify-between
                px-2.5 py-2
                rounded-lg
                hover:bg-white/[0.06]
                transition
              "
            >

              <div className="flex items-center gap-3">

                <Tag
                  size={15}
                  strokeWidth={1.6}
                  className="text-white/60 group-hover:text-[#D4AF6A] transition"
                />

                <span className="text-[12px] font-medium">
                  Offers
                </span>

              </div>

              <ChevronRight
                size={14}
                className="text-white/25"
              />

            </Link>

            {/* ================= DIVIDER ================= */}

            <div className="h-px bg-white/[0.08] my-2 mx-2" />

            {/* ================= WISHLIST ================= */}

            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                navigate("/wishlist");
              }}
              className="
                w-full flex items-center justify-between
                px-2.5 py-2
                rounded-lg
                hover:bg-white/[0.06]
                transition
              "
            >

              <div className="flex items-center gap-3">

                <Heart
                  size={15}
                  strokeWidth={1.6}
                  className="text-white/60"
                />

                <span className="text-[12px] font-medium">
                  Wishlist
                </span>

              </div>

              {wishlist.length > 0 && (
                <span className="
                  min-w-[18px] h-[18px]
                  px-1
                  rounded-full
                  bg-[#C9A45C]
                  text-black
                  text-[9px]
                  font-bold
                  flex items-center justify-center
                ">
                  {wishlist.length}
                </span>
              )}

            </button>

            {/* ================= ACCOUNT ================= */}

            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                navigate(user ? "/profile" : "/login");
              }}
              className="
                w-full flex items-center justify-between
                px-2.5 py-2
                rounded-lg
                hover:bg-white/[0.06]
                transition
              "
            >

              <div className="flex items-center gap-3">

                <User
                  size={15}
                  strokeWidth={1.6}
                  className="text-white/60"
                />

                <span className="text-[12px] font-medium">
                  Account
                </span>

              </div>

              <ChevronRight
                size={14}
                className="text-white/25"
              />

            </button>

          </div>

          {/* ================= BOTTOM CART ================= */}

          <div className="px-4 py-3 border-t border-white/[0.08]">

            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                openCart();
              }}
              className="
                w-full h-[42px]
                rounded-lg
                bg-[#C9A45C]
                text-black
                flex items-center justify-center
                gap-2
                font-semibold
                text-[12px]
                hover:bg-[#D8B875]
                transition
              "
            >

              <ShoppingBag size={15} />

              <span>
                View Cart
              </span>

              {count > 0 && (
                <span className="
                  bg-black
                  text-[#C9A45C]
                  min-w-[18px] h-[18px]
                  px-1
                  rounded-full
                  text-[9px]
                  flex items-center justify-center
                ">
                  {count}
                </span>
              )}

            </button>

          </div>

        </div>
      </motion.aside>
    </>
  )}
</AnimatePresence>

      {/* Search Modal */}
      <SearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </>
  );
}