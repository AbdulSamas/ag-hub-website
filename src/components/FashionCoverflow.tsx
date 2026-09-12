import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CoverflowCarousel, type CoverflowSlide } from '@/components/ui/coverflow-carousel';

const slides: CoverflowSlide[] = [
  {
    src: 'https://images.pexels.com/photos/14610774/pexels-photo-14610774.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    alt: 'Model wearing a flowing white dress in a studio',
    title: 'The White Edit',
    subtitle: 'Soft tailoring',
    meta: [{ label: 'Mood', value: 'Effortless' }, { label: 'Palette', value: 'Ivory' }],
  },
  {
    src: 'https://images.pexels.com/photos/13726717/pexels-photo-13726717.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    alt: 'Model in a minimalist off-shoulder blouse and white trousers',
    title: 'Quiet Confidence',
    subtitle: 'Modern essentials',
    meta: [{ label: 'Mood', value: 'Minimal' }, { label: 'Palette', value: 'Cloud' }],
  },
  {
    src: 'https://images.pexels.com/photos/38652621/pexels-photo-38652621.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    alt: 'Model wearing a black dress against a neutral background',
    title: 'After Dark',
    subtitle: 'Statement dressing',
    meta: [{ label: 'Mood', value: 'Polished' }, { label: 'Palette', value: 'Onyx' }],
  },
  {
    src: 'https://images.pexels.com/photos/38652631/pexels-photo-38652631.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    alt: 'Model with red hair wearing heels in a studio',
    title: 'The New Classic',
    subtitle: 'Sharp silhouettes',
    meta: [{ label: 'Mood', value: 'Confident' }, { label: 'Palette', value: 'Carmine' }],
  },
  {
    src: 'https://images.pexels.com/photos/38652618/pexels-photo-38652618.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    alt: 'Model in a red blazer and heels against a white backdrop',
    title: 'Power Moves',
    subtitle: 'Elevated separates',
    meta: [{ label: 'Mood', value: 'Bold' }, { label: 'Palette', value: 'Scarlet' }],
  },
];

export default function FashionCoverflow() {
  return (
   <section className="overflow-hidden px-4 pt-12 pb-6 text-white sm:px-6 sm:pt-10 sm:pb-10 lg:px-10">
      <div className="mx-auto max-w-[1280px]">
        <div className="grid items-start gap-2 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-md text-center lg:text-left"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-accent">
              <Sparkles size={12} /> The editorial edit
            </div>
            <h2 className="clash text-[36px] font-bold leading-[1.05] sm:text-[48px]"> 
              Style in motion.
            </h2>
            <p className="mt-3 text-[14px] leading-relaxed text-white/55">
              Discover the silhouettes, textures, and finishing touches shaping this season at AG HUB.
            </p>
            <Link
              to="/shop"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-[13px] font-semibold text-primary transition-transform hover:-translate-y-0.5"
            >
              Shop the edit <ArrowRight size={15} />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="min-w-0"
          >
            <CoverflowCarousel
              slides={slides}
              showCaption
              showPagination
              showNavigation
              cardWidth="clamp(170px, 23vw, 280px)"
              cardClassName="rounded-[22px] ring-1 ring-white/15"
              label="AG HUB editorial collection"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
