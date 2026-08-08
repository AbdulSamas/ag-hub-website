import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

import { supabase, type Product } from "@/lib/supabase";

import {
  getWishlist,
  addWishlist,
  removeWishlist,
} from "@/lib/wishlist";

type WishlistContextType = {
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (id: string) => void;
  isWishlisted: (id: string) => boolean;
};

const WishlistContext =
  createContext<WishlistContextType | null>(null);

export function WishlistProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [wishlist, setWishlist] = useState<Product[]>([]);
useEffect(() => {
  loadWishlist();

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(() => {
    loadWishlist();
  });

  return () => {
    subscription.unsubscribe();
  };
}, []);

async function loadWishlist() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const data = await getWishlist(user.id);

  setWishlist(
  (data ?? [])
    .map((item: any) => item.products)
    .filter(Boolean)
);
}

  async function addToWishlist(product: Product) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    alert("Please login first");
    return;
  }

  try {
    await addWishlist(user.id, product.id);
    await loadWishlist();
  } catch (error) {
    console.error(error);
    alert("Unable to add wishlist.");
  }
}
  async function removeFromWishlist(id: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  try {
    await removeWishlist(user.id, id);
    await loadWishlist();
  } catch (error) {
    console.error(error);
    alert("Unable to remove wishlist.");
  }
}

  function isWishlisted(id: string) {
    return wishlist.some((item) => item.id === id);
  }

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isWishlisted,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error(
      "useWishlist must be used inside WishlistProvider"
    );
  }

  return context;
}