import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const categories = [
  {
    title: 'Men',
    subtitle: 'Explore Men’s Collection',
    img: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1200',
    path: '/shop/Men',
  },
  {
    title: 'Women',
    subtitle: 'Explore Women’s Collection',
    img: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1200',
    path: '/shop/Women',
  },
  {
    title: 'Kids',
    subtitle: 'Explore Kids Collection',
    img: 'https://images.pexels.com/photos/35537/child-children-girl-happy.jpg?auto=compress&cs=tinysrgb&w=1200',
    path: '/shop/Kids',
  },
  {
    title: 'Cosmetics',
    subtitle: 'Beauty & Cosmetics',
    img: 'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=1200',
    path: '/shop/Cosmetics',
  },
  {
    title: 'Shoes',
    subtitle: 'Step Into Style',
    img: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1200',
    path: '/shop/Shoes',
  },
  {
    title: 'Accessories',
    subtitle: 'Complete Your Look',
    img: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=1200',
    path: '/shop/Accessories',
  },
];

export default function FeaturedCategories() {
  const [active, setActive] = useState(0);
  

  const next = () => {
    setActive((current) => (current + 1) % categories.length);
  };

  const previous = () => {
    setActive(
      (current) => (current - 1 + categories.length) % categories.length
    );
  };

  // Automatic rotation
  useEffect(() => {
  

  const timer = setInterval(() => {
    setActive((current) => (current + 1) % categories.length);
  }, 4500);

  return () => clearInterval(timer);
}, []);

  return (
    <section
      id="categories"
      className="relative overflow-hidden bg-[#050505] pt-8 pb-24 sm:pt-10 sm:pb-28"
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#c9a45c]/[0.06] blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        {/* Heading */}
        <div className="mb-12 flex flex-col items-center text-center">
          <span className="mb-4 text-[10px] font-semibold uppercase tracking-[0.45em] text-[#d4af63]">
            Discover
          </span>

          <h2 className="clash text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Shop By Category
          </h2>

          <p className="mt-4 max-w-xl text-sm font-light leading-relaxed text-white/40">
            Explore the world of AG HUB — curated fashion, beauty and
            accessories designed for every style.
          </p>
        </div>

        {/* Coverflow */}
        <div className="relative mx-auto flex h-[460px] w-full items-start justify-center pt-6 sm:h-[600px] sm:items-center sm:pt-0 overflow-hidden sm:h-[600px]">
          {categories.map((category, index) => {
            let offset = index - active;

            // Circular positioning
            if (offset > categories.length / 2) {
              offset -= categories.length;
            }

            if (offset < -categories.length / 2) {
              offset += categories.length;
            }

            const isCenter = offset === 0;
            const isNear = Math.abs(offset) === 1;

            const translateX = offset * 245;
            const rotateY = offset * -18;
            const scale = isCenter ? 1 : isNear ? 0.82 : 0.68;
           const opacity = isCenter ? 1 : isNear ? 0.45 : 0.12;
            const blur = isCenter ? 0 : Math.abs(offset) >= 2 ? 2 : 0;
            const zIndex = 50 - Math.abs(offset);

            return (
            <div
  key={category.title}
  className="absolute left-1/2 top-1/2 h-[410px] w-[275px] -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] sm:h-[500px] sm:w-[330px]"
                style={{
                  transform: `
                    translateX(calc(-50% + ${translateX}px))
                    translateY(-50%)
                    perspective(1200px)
                    rotateY(${rotateY}deg)
                    scale(${scale})
                  `,
                  opacity,
                  zIndex,
                  filter: `blur(${blur}px)`,
                }}
              >
                <Link
                  to={category.path}
                  className="group block h-full w-full"
                >
                  <div
                    className={`relative h-full w-full overflow-hidden rounded-[28px] border bg-[#111] shadow-2xl transition-all duration-500 ${
                      isCenter
                        ? 'border-[#d4af63]/50 shadow-[#d4af63]/10'
                        : 'border-white/10'
                    }`}
                  >
                    {/* Image */}
                    <img
                      src={category.img}
                      alt={category.title}
                      className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      draggable={false}
                    />

                    {/* Dark overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                    {/* Top label */}
                    {isCenter && (
                      <div className="absolute left-5 top-5 rounded-full border border-white/20 bg-black/30 px-3 py-1.5 backdrop-blur-md">
                        <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#d4af63]">
                          AG HUB
                        </span>
                      </div>
                    )}

                    {/* Content */}
                 {/* Content - center card only */}
{/* Center Card Content */}
{isCenter && (
  <div className="absolute inset-x-0 bottom-0 z-20 p-6 sm:p-7 text-center">
    <p className="mb-2 text-[9px] font-medium uppercase tracking-[0.35em] text-[#d4af63]">
      Collection
    </p>

    <h3 className="clash text-[30px] sm:text-[36px] font-bold leading-none text-white">
      {category.title}
    </h3>

    <p className="mx-auto mt-2 max-w-[220px] text-[12px] leading-relaxed text-white/65">
      {category.subtitle}
    </p>

    <Link
      to={category.path}
      className="mx-auto mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-[10px] font-bold tracking-wide text-black transition-all duration-300 hover:scale-105 hover:bg-[#d4af63]"
    >
      SHOP NOW
      <ArrowRight size={14} />
    </Link>
  </div>
)}
 


                    {/* Center Card Content */}
{isCenter && (
  <div className="absolute inset-x-0 bottom-0 z-20 p-6 sm:p-7 text-center">

    <p className="mb-2 text-[9px] font-medium uppercase tracking-[0.35em] text-[#d4af63]">
      Collection
    </p>

    <h3 className="clash text-[30px] sm:text-[36px] font-bold leading-none text-white">
      {category.title}
    </h3>

    <p className="mx-auto mt-2 max-w-[220px] text-[12px] leading-relaxed text-white/65">
      {category.subtitle}
    </p>

    <Link
      to={category.path}
      className="mx-auto mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-[10px] font-bold tracking-wide text-black transition-all duration-300 hover:scale-105 hover:bg-[#d4af63]"
    >
      SHOP NOW
      <ArrowRight size={14} />
    </Link>

  </div>
)}
                  </div>
                </Link>
              </div>
            );
          })}

          {/* Left arrow */}
          <button
            type="button"
            onClick={previous}
            aria-label="Previous category"
            className="absolute left-3 top-1/2 z-[70] flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur-md transition-all duration-300 hover:border-[#d4af63]/60 hover:bg-[#d4af63] hover:text-black sm:left-8"
          >
            <ArrowLeft size={18} />
          </button>

          {/* Right arrow */}
          <button
            type="button"
            onClick={next}
            aria-label="Next category"
            className="absolute right-3 top-1/2 z-[70] flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur-md transition-all duration-300 hover:border-[#d4af63]/60 hover:bg-[#d4af63] hover:text-black sm:right-8"
          >
            <ArrowRight size={18} />
          </button>
        </div>

        {/* Bottom navigation */}
        <div className="mt-5 flex items-center justify-center gap-2">
          {categories.map((category, index) => (
            <button
              key={category.title}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Show ${category.title}`}
              className={`h-1 rounded-full transition-all duration-500 ${
                active === index
                  ? 'w-10 bg-[#d4af63]'
                  : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>

       
      </div>
    </section>
  );
}