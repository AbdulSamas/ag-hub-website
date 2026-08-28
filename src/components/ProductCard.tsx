import { motion } from "framer-motion";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Product } from "@/lib/supabase";
import { useCart } from "@/lib/cart";
import { formatAED } from "@/lib/format";
import { useWishlist } from "@/context/WishlistContext";

type Props = {
  product: Product;
  index?: number;
};

export default function ProductCard({ product, index = 0 }: Props) {
  const navigate = useNavigate();

  const { addToCart } = useCart();

  const {
    addToWishlist,
    removeFromWishlist,
    isWishlisted,
  } = useWishlist();

  const handleClick = () => {
    navigate(`/product/${product.slug}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isWishlisted(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay: index * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -4 }}
      onClick={handleClick}
      className="group cursor-pointer"
    >
      <div className="relative rounded-[24px] overflow-hidden aspect-[3/4] bg-white/5 border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.35)] mb-3">
        <img
          src={product.image_url || ""}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />

        {/* Sale Badge */}
        {product.is_on_sale && product.discount_percent > 0 && (
          <div className="absolute top-3 left-3 bg-accent text-primary text-[10px] font-bold px-2.5 py-1 rounded-full">
            -{product.discount_percent}%
          </div>
        )}

        {/* New Badge */}
        {!product.is_on_sale && product.is_new && (
          <div className="absolute top-3 left-3 bg-white/90 text-black text-[10px] font-medium px-2.5 py-1 rounded-full shadow-soft">
            New
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm shadow-soft transition-all duration-300 ${
            isWishlisted(product.id)
              ? "bg-red-500 text-white"
              : "bg-black/40 text-white backdrop-blur-md border border-white/10 hover:bg-accent hover:text-primary"
          }`}
        >
          <Heart
            size={14}
            fill={isWishlisted(product.id) ? "currentColor" : "none"}
          />
        </button>

        {/* Add To Cart */}
        <button
          onClick={handleAddToCart}
          className="absolute bottom-3 left-3 right-3 bg-white text-black text-[12px] font-medium py-2.5 rounded-full flex items-center justify-center gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300"
        >
          <ShoppingBag size={13} />
          Add to Cart
        </button>
      </div>

      <div className="px-1">
        <p className="text-[10px] text-white/40 font-medium uppercase tracking-wider mb-1">
          {product.category}
        </p>

        <h3 className="font-medium text-[13px] text-white leading-snug mb-1.5 line-clamp-1">
          {product.name}
        </h3>

        <div className="flex items-center gap-1.5 mb-1.5">
          <Star size={11} className="fill-accent text-accent" />
          <span className="text-[11px] text-white/60">
            {product.rating}
          </span>
          <span className="text-[11px] text-white/60">
            ({product.reviews_count})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold text-[14px] text-white">
            {formatAED(product.price)}
          </span>

          {product.original_price && (
            <span className="text-[12px] text-white/30 line-through">
              {formatAED(product.original_price)}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}