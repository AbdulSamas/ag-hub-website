import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SlidersHorizontal, X } from 'lucide-react';
import { supabase, type Product } from '@/lib/supabase';
import ProductCard from '@/components/ProductCard';

const categories = [
'All',
'Men',
'Women',
'Cosmetics',
'Shoes',
'Accessories'
];
const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'new', label: 'Newest' },
];

export default function ShopPage() {
  const { category: routeCategory } = useParams();
  const [searchParams] = useSearchParams();
  const filterParam = searchParams.get('filter');

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(routeCategory || 'All');
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (routeCategory) setActiveCategory(routeCategory);
    else if (filterParam === 'new') setActiveCategory('All');
    else setActiveCategory('All');
  }, [routeCategory, filterParam]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      let query = supabase.from('products').select('*');

      if (activeCategory !== 'All') {
        query = query.eq('category', activeCategory);
      }

     if (filterParam === 'new') {
  query = query.eq('is_new_arrival', true);
}

      switch (sortBy) {
        case 'price-asc':
          query = query.order('price', { ascending: true });
          break;
        case 'price-desc':
          query = query.order('price', { ascending: false });
          break;
        case 'rating':
          query = query.order('rating', { ascending: false });
          break;
        case 'new':
          query = query.order('created_at', { ascending: false });
          break;
        default:
          query = query.order('is_featured', { ascending: false }).order('rating', { ascending: false });
      }

      const { data, error } = await query;
      if (!error && data) setProducts(data as Product[]);
      setLoading(false);
    })();
  }, [activeCategory, sortBy, filterParam]);

  const heading = filterParam === 'new' ? 'New Arrivals' : activeCategory === 'All' ? 'All Products' : activeCategory;

  return (
    <div className="pt-[68px] sm:pt-[76px] min-h-screen bg-transparent text-white">
      {/* Header */}
      <div className="px-4 sm:px-6 lg:px-10 pt-10 sm:pt-14 pb-6">
        <div className="max-w-[1280px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[11px] font-medium text-primary tracking-[0.2em] uppercase mb-3 block">
              Collection
            </span>
            <h1 className="clash text-[32px] sm:text-[44px] font-bold leading-tight text-white">{heading}</h1>
            <p className="text-white/50 mt-2 text-[14px] font-light">
              {products.length} {products.length === 1 ? 'product' : 'products'} available
            </p>
          </motion.div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="sticky top-[68px] sm:top-[76px] z-30 bg-black/40 backdrop-blur-md border-b border-white/10">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 py-3 flex items-center justify-between gap-4">
          {/* Category pills — scrollable on mobile */}
          <div className="flex-1 overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 w-max">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-[12px] font-medium whitespace-nowrap transition-all ${
                    activeCategory === cat
  ? 'bg-white text-black'
  : 'bg-white/10 text-white/60 hover:text-white border border-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Sort + Filter */}
          <div className="flex items-center gap-2 shrink-0">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-[12px] font-medium text-white bg-white/10 border border-white/10 rounded-full px-3 py-1.5 outline-none cursor-pointer hover:border-white/20 transition-colors"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden w-8 h-8 flex items-center justify-center rounded-full bg-white/10 border border-white/10"
            >
              <SlidersHorizontal size={14} className="text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Products grid */}
      <div className="px-4 sm:px-6 lg:px-10 py-8 sm:py-10">
        <div className="max-w-[1280px] mx-auto">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="rounded-[24px] bg-ink/10 aspect-[3/4] mb-3" />
                  <div className="h-3 bg-ink/10 rounded mb-2 w-1/3" />
                  <div className="h-4 bg-ink/10 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-white/50 text-[15px] font-light">No products found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {products.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-ink/30 backdrop-blur-sm md:hidden"
          onClick={() => setShowFilters(false)}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-0 left-0 right-0 bg-[#0a0a0a] border-t border-white/10 rounded-t-[24px] p-6 pb-10"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-white text-[16px]">Filter</h3>
              <button onClick={() => setShowFilters(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10">
                <X size={16} className="text-white" />
              </button>
            </div>
            <p className="text-[11px] font-medium text-white/50 uppercase tracking-wider mb-3">Category</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setShowFilters(false);
                  }}
                  className={`px-4 py-2 rounded-full text-[13px] font-medium transition-all ${
                    activeCategory === cat
  ? 'bg-white text-black'
  : 'bg-white/10 text-white/60 border border-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
