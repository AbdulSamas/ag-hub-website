import { motion } from "framer-motion";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/lib/cart";
import { formatAED } from "@/lib/format";

export default function WishlistPage() {
  const {
    wishlist,
    removeFromWishlist,
  } = useWishlist();

  const { addToCart } = useCart();

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
        <div className="text-center">

          <Heart
            size={80}
            className="mx-auto text-red-500 mb-6"
          />

          <h1 className="text-4xl font-bold mb-3">
            Your Wishlist is Empty
          </h1>

          <p className="text-gray-500 mb-8">
            Save your favourite products here.
          </p>

          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition"
          >
            Continue Shopping
          </Link>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20 px-6">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-5xl font-bold mb-10 flex items-center gap-3">
          <Heart className="text-red-500" />
          My Wishlist
        </h1>

        <div className="grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-4
          gap-8"
        ></div>
        {wishlist.map((product, index) => (
  <motion.div
    key={product.id}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
    className="bg-white rounded-3xl shadow-lg overflow-hidden"
  >
    <Link to={`/product/${product.slug}`}>
      <img
        src={product.image_url || ""}
        alt={product.name}
        className="w-full h-72 object-cover hover:scale-105 transition duration-300"
      />
    </Link>

    <div className="p-5">
      <p className="text-sm text-gray-500 uppercase">
        {product.category}
      </p>

      <h2 className="text-xl font-semibold mt-1">
        {product.name}
      </h2>

      <p className="text-2xl font-bold mt-3">
        {formatAED(product.price)}
      </p>

      <div className="flex gap-3 mt-5">

        <button
          onClick={() => addToCart(product)}
          className="flex-1 bg-black text-white rounded-xl py-3 flex items-center justify-center gap-2 hover:bg-gray-800 transition"
        >
          <ShoppingBag size={18} />
          Add to Cart
        </button>

        <button
          onClick={() => removeFromWishlist(product.id)}
          className="w-12 h-12 rounded-xl bg-red-50 hover:bg-red-100 flex items-center justify-center transition"
        >
          <Trash2
            size={18}
            className="text-red-500"
          />
        </button>

      </div>
    </div>
  </motion.div>
))}
        </div>
      </div>

  );
}