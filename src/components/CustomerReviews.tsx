import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { supabase, type Review } from '@/lib/supabase';

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: n }).map((_, i) => (
        <Star key={i} size={13} className="fill-accent text-accent" />
      ))}
    </div>
  );
}

export default function CustomerReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from('reviews').select('*').limit(4);
      if (!error && data) setReviews(data as Review[]);
      setLoading(false);
    })();
  }, []);

  return (
    <section id="reviews" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-10 bg-cream overflow-hidden">
      <div className="max-w-[1280px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="text-[11px] font-medium text-primary tracking-[0.2em] uppercase mb-3 block">
            Testimonials
          </span>
          <h2 className="clash text-[32px] sm:text-[42px] font-bold leading-tight text-ink">
            What Customers Say
          </h2>
          <p className="text-secondary mt-3 text-[14px] max-w-sm mx-auto font-light">
            Real people, real style, real stories.
          </p>
        </motion.div>

        {/* Stat bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-3 gap-4 glass-card rounded-[24px] p-6 sm:p-10 mb-12 sm:mb-14"
        >
          {[
            { val: '50K+', label: 'Happy Customers' },
            { val: '4.9', label: 'Average Rating' },
            { val: '99%', label: 'Would Recommend' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="clash text-[28px] sm:text-[42px] font-bold text-ink leading-none">{s.val}</p>
              <p className="text-[11px] sm:text-[12px] text-secondary mt-1.5 font-medium">{s.label}</p>
            </div>
          ))}
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-[24px] p-7 animate-pulse">
                <div className="w-6 h-6 bg-ink/5 rounded mb-4" />
                <div className="h-3 bg-ink/5 rounded mb-2" />
                <div className="h-3 bg-ink/5 rounded mb-2 w-3/4" />
                <div className="h-3 bg-ink/5 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {reviews.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-[24px] p-6 sm:p-7 flex flex-col gap-4 lift shadow-card"
              >
                <Quote size={22} className="text-accent opacity-80" />
                <p className="text-[13px] text-ink/70 leading-relaxed flex-1">"{r.text}"</p>
                <div>
                  <Stars n={r.rating} />
                  {r.product_name && (
                    <p className="text-[11px] text-secondary mt-1.5 font-light">Re: {r.product_name}</p>
                  )}
                </div>
                <div className="flex items-center gap-3 pt-3 border-t border-ink/5">
                  {r.avatar_url && (
                    <img
                      src={r.avatar_url}
                      alt={r.name}
                      className="w-10 h-10 rounded-full object-cover"
                      loading="lazy"
                    />
                  )}
                  <div>
                    <p className="font-medium text-[13px] text-ink">{r.name}</p>
                    {r.role && <p className="text-[11px] text-secondary">{r.role}</p>}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
