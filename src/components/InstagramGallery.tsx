import { useState } from 'react';
import { motion } from 'framer-motion';
import { Instagram, Volume2, VolumeX } from 'lucide-react';

const gallery = [
  {
    id: 1,
    src: '/videos/reel1.mp4',
    span: 'col-span-1 row-span-2',
  },
  {
    id: 2,
    src: '/videos/reel2.mp4',
    span: 'col-span-1 row-span-1',
  },
  {
    id: 3,
    src: '/videos/reel3.mp4',
    span: 'col-span-1 row-span-1',
  },
  {
    id: 4,
    src: '/videos/reel4.mp4',
    span: 'col-span-2 row-span-1',
  },
  {
    id: 5,
    src: '/videos/reel5.mp4',
    span: 'col-span-1 row-span-1',
  },
  {
    id: 6,
    src: '/videos/reel6.mp4',
    span: 'col-span-1 row-span-1',
  },
];

export default function InstagramGallery() {
  const [muted, setMuted] = useState(true);

  return (
    <section
      id="instagram"
      className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-10"
    >
      <div className="max-w-[1280px] mx-auto">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10 sm:mb-14"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <Instagram size={15} className="text-accent" />

            <span className="text-[11px] font-medium text-accent tracking-[0.2em] uppercase">
              @aghub
            </span>
          </div>

          <h2 className="clash text-[32px] sm:text-[42px] font-bold leading-tight text-white">
            Style Inspiration
          </h2>

          <p className="text-white/50 mt-3 text-[14px] max-w-xs mx-auto font-light">
            Discover the latest looks, drops and fashion inspiration.
          </p>
        </motion.div>

        {/* Reel Grid */}
        <div className="grid grid-cols-3 grid-rows-2 gap-3 sm:gap-4 h-[320px] sm:h-[540px]">

          {gallery.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: i * 0.08,
              }}
              whileHover={{ scale: 1.02 }}
              className={`
                ${item.span}
                group
                relative
                rounded-[20px]
                sm:rounded-[24px]
                overflow-hidden
                cursor-pointer
                bg-black
                ring-1
                ring-white/10
              `}
            >

              {/* Video */}
              <video
                src={item.src}
                autoPlay
                loop
                muted={muted}
                playsInline
                preload="metadata"
                className="
                  absolute
                  inset-0
                  w-full
                  h-full
                  object-cover
                  transition-transform
                  duration-700
                  group-hover:scale-105
                "
              />

              {/* Dark gradient */}
              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-black/50
                  via-transparent
                  to-black/10
                  pointer-events-none
                "
              />

              {/* Reel label */}
              <div className="
                absolute
                top-3
                left-3
                px-2.5
                py-1
                rounded-full
                bg-black/40
                backdrop-blur-md
                border
                border-white/10
                text-white
                text-[9px]
                font-medium
                uppercase
                tracking-wider
              ">
                Reel
              </div>

              {/* Sound button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMuted(!muted);
                }}
                className="
                  absolute
                  bottom-3
                  right-3
                  w-8
                  h-8
                  rounded-full
                  bg-black/50
                  backdrop-blur-md
                  border
                  border-white/15
                  flex
                  items-center
                  justify-center
                  text-white
                  opacity-0
                  group-hover:opacity-100
                  transition-all
                  duration-300
                  z-10
                "
                aria-label={muted ? 'Unmute videos' : 'Mute videos'}
              >
                {muted ? (
                  <VolumeX size={14} />
                ) : (
                  <Volume2 size={14} />
                )}
              </button>

              {/* Hover overlay */}
              <div
                className="
                  absolute
                  inset-0
                  bg-black/0
                  group-hover:bg-black/20
                  transition-colors
                  duration-300
                  pointer-events-none
                "
              />

            </motion.div>
          ))}

        </div>

        {/* Instagram Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.6,
            delay: 0.3,
          }}
          className="text-center mt-8 sm:mt-10"
        >
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-flex
              items-center
              gap-2
              border
              border-white/15
              text-white
              font-medium
              text-[13px]
              px-8
              py-3
              rounded-full
              hover:border-accent
              hover:text-accent
              transition-all
              duration-300
            "
          >
            <Instagram size={15} />
            Follow on Instagram
          </a>
        </motion.div>

      </div>
    </section>
  );
}