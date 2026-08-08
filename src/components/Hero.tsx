import { useRef, useState, useEffect, useCallback, type ReactNode } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

/* ──────────────────────────────────────────────
   Data
─────────────────────────────────────────────── */

const marqueeImages = [
  {
    src: 'https://images.pexels.com/photos/25903935/pexels-photo-25903935.jpeg?auto=compress&cs=tinysrgb&w=600',
    alt: 'Model in lynx fur coat',
    size: 'lg',
  },
  {
    src: 'https://images.pexels.com/photos/1066171/pexels-photo-1066171.jpeg?auto=compress&cs=tinysrgb&w=500',
    alt: 'Moody studio model',
    size: 'sm',
  },
  {
    src: 'https://images.pexels.com/photos/28263000/pexels-photo-28263000.jpeg?auto=compress&cs=tinysrgb&w=600',
    alt: 'Model in white fur coat',
    size: 'md',
  },
  {
    src: 'https://images.pexels.com/photos/20437814/pexels-photo-20437814.jpeg?auto=compress&cs=tinysrgb&w=600',
    alt: 'Model in black leather coat',
    size: 'lg',
  },
  {
    src: 'https://images.pexels.com/photos/17393964/pexels-photo-17393964.jpeg?auto=compress&cs=tinysrgb&w=500',
    alt: 'Model in black dress sunglasses',
    size: 'sm',
  },
  {
    src: 'https://images.pexels.com/photos/31202992/pexels-photo-31202992.jpeg?auto=compress&cs=tinysrgb&w=600',
    alt: 'Model in pearls maroon',
    size: 'md',
  },
  {
    src: 'https://images.pexels.com/photos/20408916/pexels-photo-20408916.jpeg?auto=compress&cs=tinysrgb&w=600',
    alt: 'Model in fur coat crown',
    size: 'lg',
  },
];

const sizeMap: Record<string, { w: string; h: string }> = {
  lg: { w: 'w-[240px] sm:w-[280px]', h: 'h-[340px] sm:h-[400px]' },
  md: { w: 'w-[200px] sm:w-[230px]', h: 'h-[290px] sm:h-[340px]' },
  sm: { w: 'w-[170px] sm:w-[190px]', h: 'h-[250px] sm:h-[290px]' },
};

/* ──────────────────────────────────────────────
   Particles
─────────────────────────────────────────────── */

function Particles() {
  const particles = useRef(
    Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 8 + 6,
      delay: Math.random() * 5,
    })),
  ).current;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white/20"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────────
   Magnetic Button
─────────────────────────────────────────────── */

function MagneticButton({ children, to }: { children: ReactNode; to: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 15 });
  const springY = useSpring(y, { stiffness: 200, damping: 15 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    x.set(relX * 0.3);
    y.set(relY * 0.3);
  }, [x, y]);

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.a
      ref={ref}
      href={to}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      whileTap={{ scale: 0.95 }}
      className="group relative inline-flex items-center gap-2.5 bg-accent text-primary font-semibold text-[13px] px-7 py-3.5 rounded-full overflow-hidden"
    >
      <span className="relative z-10">{children}</span>
      <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]" />
    </motion.a>
  );
}

/* ──────────────────────────────────────────────
   Marquee Card
─────────────────────────────────────────────── */

function MarqueeCard({
  src,
  alt,
  size,
}: {
  src: string;
  alt: string;
  size: string;
}) {
  const s = sizeMap[size] || sizeMap.md;
  return (
    <div className={`group relative ${s.w} ${s.h} shrink-0`}>
      <div className="relative w-full h-full rounded-[20px] overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.4)] ring-1 ring-white/10">
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover object-top transition-transform duration-[1.2s] ease-out group-hover:scale-105"
          loading="eager"
        />
        {/* Glass overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-white/5 pointer-events-none" />
        <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[20px] pointer-events-none" />
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Marquee Strip (JS-driven, pause on hover)
─────────────────────────────────────────────── */

function MarqueeStrip() {
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const pausedRef = useRef(false);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const animate = () => {
      if (!pausedRef.current) {
        offsetRef.current -= 0.4;
        const half = track.scrollWidth / 2;
        if (Math.abs(offsetRef.current) >= half) {
          offsetRef.current = 0;
        }
        track.style.transform = `translateX(${offsetRef.current}px)`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const handleMouseEnter = () => {
    pausedRef.current = true;
  };
  const handleMouseLeave = () => {
    pausedRef.current = false;
  };

  // Duplicate the set for seamless loop
  const set = marqueeImages;

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Edge fades */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-[#0a0a0f] to-transparent z-20 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-[#0a0a0f] to-transparent z-20 pointer-events-none" />

      <div
        ref={trackRef}
        className="flex gap-4 sm:gap-5 items-center h-full will-change-transform"
        style={{ transform: 'translateX(0px)' }}
      >
        {[...set, ...set].map((img, i) => (
          <MarqueeCard key={i} src={img.src} alt={img.alt} size={img.size} />
        ))}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Main Hero
─────────────────────────────────────────────── */

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const yScroll = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacityScroll = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  // Mouse parallax
  const rawMX = useMotionValue(0);
  const rawMY = useMotionValue(0);
  const mouseX = useSpring(rawMX, { stiffness: 50, damping: 20 });
  const mouseY = useSpring(rawMY, { stiffness: 50, damping: 20 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    rawMX.set((e.clientX / w - 0.5) * 20);
    rawMY.set((e.clientY / h - 0.5) * 20);
  }, [rawMX, rawMY]);

  const handleMouseLeave = useCallback(() => {
    rawMX.set(0);
    rawMY.set(0);
  }, [rawMX, rawMY]);

  // Text parallax from mouse
  const textX = useTransform(mouseX, (v) => v * 0.3);
  const textY = useTransform(mouseY, (v) => v * 0.3);
  const imageX = useTransform(mouseX, (v) => v * -0.2);
  const imageMouseY = useTransform(mouseY, (v) => v * -0.2);
  const imageY = useTransform([imageMouseY, parallaxY], ([my, py]: number[]) => my + py);

  // Cursor glow
  const [cursorPos, setCursorPos] = useState({ x: -200, y: -200 });
  const [cursorVisible, setCursorVisible] = useState(false);

  const handleCursorMove = useCallback((e: React.MouseEvent) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (rect) {
      setCursorPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      onMouseMove={(e) => {
        handleMouseMove(e);
        handleCursorMove(e);
      }}
      onMouseEnter={() => setCursorVisible(true)}
      onMouseLeave={() => {
        handleMouseLeave();
        setCursorVisible(false);
      }}
      className="relative min-h-screen bg-[#0a0a0f] overflow-hidden flex flex-col"
    >
      {/* ── Background glows ─────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 50% 50% at 20% 30%, rgba(0,53,173,0.15) 0%, transparent 60%), radial-gradient(ellipse 40% 50% at 80% 70%, rgba(244,225,27,0.08) 0%, transparent 60%)',
        }}
      />

      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Particles */}
      <Particles />

      {/* Cursor glow */}
      <AnimatePresence>
        {cursorVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute pointer-events-none z-10 w-[400px] h-[400px] rounded-full"
            style={{
              left: cursorPos.x - 200,
              top: cursorPos.y - 200,
              background: 'radial-gradient(circle, rgba(244,225,27,0.06) 0%, transparent 70%)',
            }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      {/* ── Content ─────────────────────────────────── */}
      <motion.div
        style={{ y: yScroll, opacity: opacityScroll }}
        className="relative z-30 flex-1 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 max-w-[1400px] w-full mx-auto px-5 sm:px-8 lg:px-12 pt-[100px] sm:pt-[110px] pb-10"
      >
        {/* Left: Text content */}
        <motion.div
          style={{ x: textX, y: textY }}
          className="flex-1 max-w-xl text-center lg:text-left"
        >
          {/* Label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
            className="inline-flex items-center gap-2 mb-5"
          >
            <span className="w-6 h-px bg-accent/60" />
            <span className="text-[11px] font-medium text-accent/90 tracking-[0.25em] uppercase">
              Premium Fashion 2026
            </span>
          </motion.div>

          {/* Heading */}
          <h1 className="clash text-[44px] sm:text-[58px] lg:text-[64px] xl:text-[72px] font-bold leading-[1.04] tracking-tightest text-white text-balance">
            {['Elevate', 'Your', 'Style'].map((word, wi) => (
              <span key={wi} className="inline-block mr-[0.25em]">
                {word.split('').map((ch, ci) => (
                  <motion.span
                    key={ci}
                    className="inline-block"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.3 + wi * 0.15 + ci * 0.03,
                      duration: 0.6,
                      ease: [0.22, 1, 0.36, 1] as const,
                    }}
                  >
                    {ch}
                  </motion.span>
                ))}
              </span>
            ))}
          </h1>

          {/* Short description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="text-white/50 text-[14px] sm:text-[15px] leading-relaxed mt-5 max-w-sm mx-auto lg:mx-0 font-light"
          >
            Curated luxury for modern lifestyles.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="mt-8"
          >
            <MagneticButton to="/shop">
              Explore Collections
              <ArrowRight size={15} className="relative z-10" />
            </MagneticButton>
          </motion.div>
        </motion.div>

        {/* Right: Marquee */}
        <motion.div
          style={{ x: imageX, y: imageY }}
          className="flex-1 w-full h-[380px] sm:h-[460px] lg:h-[520px] xl:h-[560px] relative"
        >
          <MarqueeStrip />
        </motion.div>
      </motion.div>

      {/* ── Scroll indicator ─────────────────────────── */}
      <motion.div
        style={{ opacity: opacityScroll }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] text-white/30 font-medium tracking-[0.2em] uppercase">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-white/30 to-transparent">
          <motion.div
            className="w-px h-3 bg-accent"
            animate={{ y: [0, 28, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </section>
  );
}
