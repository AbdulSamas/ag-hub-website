import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase, type Product } from '@/lib/supabase';
import ProductCard from '@/components/ProductCard';

type Props = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  filter: 'is_featured' | 'is_new' | 'is_best_seller' | 'is_on_sale';
  limit?: number;
  bg?: 'default' | 'sand' | 'cream';
  viewAllLink?: string;
};

export default function ProductSection({
  eyebrow,
  title,
  subtitle,
  filter,
  limit = 8,
  viewAllLink = '/shop',
}: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq(filter, true)
        .order('rating', { ascending: false })
        .limit(limit);
      if (!error && data) setProducts(data as Product[]);
      setLoading(false);
    })();
  }, [filter, limit]);

  return (
    <section className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-10">
      <div className="max-w-[1280px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 sm:mb-14 gap-4"
        >
          <div>
            <span className="text-[11px] font-medium text-accent tracking-[0.2em] uppercase mb-3 block">
              {eyebrow}
            </span>
            <h2 className="clash text-[32px] sm:text-[42px] font-bold leading-tight text-white">{title}</h2>
            {subtitle && (
              <p className="text-white/50 mt-3 text-[14px] max-w-md font-light">{subtitle}</p>
            )}
          </div>
          <Link
            to={viewAllLink}
            className="inline-flex items-center gap-2 text-[13px] font-medium text-white/60 hover:text-accent transition-colors link-underline shrink-0"
          >
            View All <ArrowRight size={15} />
          </Link>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="rounded-[24px] bg-white/10 aspect-[3/4] mb-3" />
                <div className="h-3 bg-white/10 rounded mb-2 w-1/3" />
                <div className="h-4 bg-white/10 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}