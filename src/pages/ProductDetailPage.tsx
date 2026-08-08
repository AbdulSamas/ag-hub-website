import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ShoppingBag, Heart, ArrowLeft, Minus, Plus, Truck, RotateCcw, ShieldCheck } from 'lucide-react';
import { supabase, type Product } from '@/lib/supabase';
import { useCart } from '@/lib/cart';
import { useWishlist } from "@/context/WishlistContext";
import { formatAED } from '@/lib/format';
import ProductCard from '@/components/ProductCard';
import ReviewSection from "@/components/ReviewSection";


export default function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const { addToCart, openCart } = useCart();
  const {
  addToWishlist,
  removeFromWishlist,
  isWishlisted,
} = useWishlist();

  useEffect(() => {
    (async () => {
      if (!slug) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (!error && data) {
        const p = data as Product;
        setProduct(p);
        setSelectedSize(p.sizes.length > 0 ? p.sizes[0] : '');
        setSelectedColor(p.colors.length > 0 ? p.colors[0] : '');

        // Fetch related products
        const { data: relData } = await supabase
          .from('products')
          .select('*')
          .eq('category', p.category)
          .neq('id', p.id)
          .limit(4);
        if (relData) setRelated(relData as Product[]);
      }
      setLoading(false);
    })();
  }, [slug]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, selectedSize, selectedColor, quantity);
      openCart();
    }
  };
  const handleWishlist = () => {
  if (!product) return;

  if (isWishlisted(product.id)) {
    removeFromWishlist(product.id);
  } else {
    addToWishlist(product);
  }
};

  if (loading) {
    return (
      <div className="pt-[68px] sm:pt-[76px] min-h-screen bg-cream">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="animate-pulse rounded-[24px] bg-ink/5 aspect-[3/4]" />
            <div className="space-y-4 animate-pulse">
              <div className="h-4 bg-ink/5 rounded w-1/4" />
              <div className="h-8 bg-ink/5 rounded w-3/4" />
              <div className="h-6 bg-ink/5 rounded w-1/3" />
              <div className="h-24 bg-ink/5 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-[68px] sm:pt-[76px] min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <p className="text-secondary text-[15px] mb-4">Product not found.</p>
          <Link to="/shop" className="text-primary font-medium link-underline">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const allImages = [product.image_url, ...(product.images || [])].filter(Boolean) as string[];

  return (
    <div className="pt-[68px] sm:pt-[76px] min-h-screen bg-cream pb-16">
      {/* Breadcrumb */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 pt-6">
        <Link
          to="/shop"
          className="inline-flex items-center gap-1.5 text-[12px] text-secondary hover:text-ink transition-colors"
        >
          <ArrowLeft size={14} /> Back to Shop
        </Link>
      </div>

      {/* Main product section */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image gallery */}
          <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative rounded-[24px] overflow-hidden aspect-[3/4] bg-white shadow-premium-lg mb-4"
            >
              <img
                src={allImages[selectedImage] || ''}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.is_on_sale && product.discount_percent > 0 && (
                <div className="absolute top-4 left-4 bg-accent text-primary text-[11px] font-bold px-3 py-1.5 rounded-full">
                  -{product.discount_percent}%
                </div>
              )}
            </motion.div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto scrollbar-hide">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`shrink-0 w-20 h-24 rounded-2xl overflow-hidden transition-all ${
                      selectedImage === i ? 'ring-2 ring-primary' : 'ring-1 ring-ink/10'
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col"
          >
            <p className="text-[11px] text-secondary font-medium uppercase tracking-wider mb-2">
              {product.category}
              {product.subcategory && ` · ${product.subcategory}`}
            </p>
            <h1 className="clash text-[28px] sm:text-[36px] font-bold leading-tight text-ink mb-3">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-5">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={14}
                    className={s <= Math.round(product.rating) ? 'fill-accent text-accent' : 'text-ink/15'}
                  />
                ))}
              </div>
              <span className="text-[13px] text-secondary">
                {product.rating} ({product.reviews_count} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="font-bold text-[28px] text-ink">{formatAED(product.price)}</span>
              {product.original_price && (
                <span className="text-[16px] text-secondary/50 line-through">
                  {formatAED(product.original_price)}
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-[14px] text-ink/70 leading-relaxed mb-6 font-light">
                
  
                {product.description}
              </p>
            )}
  

            {/* Colors */}
            {product.colors.length > 0 && (
              <div className="mb-5">
                <p className="text-[12px] font-medium text-ink mb-2">
                  Color: <span className="text-secondary">{selectedColor}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-full text-[12px] font-medium transition-all ${
                        selectedColor === color
                          ? 'bg-ink text-white'
                          : 'bg-white text-ink/60 shadow-soft hover:text-ink'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes.length > 0 && (
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[12px] font-medium text-ink">
                    Size: <span className="text-secondary">{selectedSize}</span>
                  </p>
                  <button className="text-[11px] text-primary link-underline">Size Guide</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[44px] px-3 py-2 rounded-xl text-[12px] font-medium transition-all ${
                        selectedSize === size
                          ? 'bg-ink text-white'
                          : 'bg-white text-ink/60 shadow-soft hover:text-ink'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
          {product && (
  <ReviewSection
    productId={product.id}
  />
)}
            {/* Quantity + Add to cart */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-2 bg-white rounded-full px-2 py-1.5 shadow-soft">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-ink/5"
                >
                  <Minus size={14} className="text-ink" />
                </button>
                <span className="text-[14px] font-medium text-ink w-6 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-ink/5"
                >
                  <Plus size={14} className="text-ink" />
                </button>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                className="flex-1 bg-accent text-primary font-semibold py-3.5 rounded-full flex items-center justify-center gap-2 text-[14px] cta-glow"
              >
                <ShoppingBag size={16} /> Add to Cart
              </motion.button>
             <button
  onClick={handleWishlist}
  className={`w-12 h-12 rounded-full flex items-center justify-center shadow-soft transition-all ${
    isWishlisted(product.id)
      ? "bg-red-500 text-white"
      : "bg-white hover:bg-accent hover:text-primary"
  }`}
>
  <Heart
    size={18}
    fill={isWishlisted(product.id) ? "currentColor" : "none"}
  />
</button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-ink/5">
              {[
                { icon: Truck, label: 'Free UAE Shipping', sub: 'On orders over 200 AED' },
                { icon: RotateCcw, label: 'Easy Returns', sub: '30-day return policy' },
                { icon: ShieldCheck, label: 'Secure Payment', sub: '100% protected' },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex flex-col items-center text-center gap-1.5">
                  <Icon size={18} className="text-primary" />
                  <p className="text-[11px] font-medium text-ink leading-tight">{label}</p>
                  <p className="text-[10px] text-secondary font-light leading-tight">{sub}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div className="mt-16 sm:mt-20 px-4 sm:px-6 lg:px-10">
          <div className="max-w-[1280px] mx-auto">
            <h2 className="clash text-[24px] sm:text-[32px] font-bold text-ink mb-6 sm:mb-8">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
