import { motion } from 'framer-motion';
import { Instagram } from 'lucide-react';

const gallery = [
  {
    id: 1,
    src: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=400',
    span: 'col-span-1 row-span-2',
  },
  {
    id: 2,
    src: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=400',
    span: 'col-span-1 row-span-1',
  },
  {
    id: 3,
    src: 'https://images.pexels.com/photos/2613260/pexels-photo-2613260.jpeg?auto=compress&cs=tinysrgb&w=400',
    span: 'col-span-1 row-span-1',
  },
  {
    id: 4,
    src: 'https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=400',
    span: 'col-span-2 row-span-1',
  },
  {
    id: 5,
    src: 'https://images.pexels.com/photos/1462637/pexels-photo-1462637.jpeg?auto=compress&cs=tinysrgb&w=400',
    span: 'col-span-1 row-span-1',
  },
  {
    id: 6,
    src: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=400',
    span: 'col-span-1 row-span-1',
  },
];

export default function InstagramGallery() {
  return (
    <section id="instagram" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-10 bg-sand">
      <div className="max-w-[1280px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10 sm:mb-14"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <Instagram size={15} className="text-primary" />
            <span className="text-[11px] font-medium text-primary tracking-[0.2em] uppercase">@aghub</span>
          </div>
          <h2 className="clash text-[32px] sm:text-[42px] font-bold leading-tight text-ink">
            Style Inspiration
          </h2>
          <p className="text-secondary mt-3 text-[14px] max-w-xs mx-auto font-light">
            Follow us on Instagram for daily fashion drops.
          </p>
        </motion.div>

        <div className="grid grid-cols-3 grid-rows-2 gap-3 sm:gap-4 h-[320px] sm:h-[540px]">
          {gallery.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              whileHover={{ scale: 1.02 }}
              className={`${item.span} group relative rounded-[20px] sm:rounded-[24px] overflow-hidden cursor-pointer shadow-card lift`}
            >
              <img
                src={item.src}
                alt={`Style ${item.id}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/20 transition-colors duration-300 flex items-center justify-center">
                <Instagram size={26} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-8 sm:mt-10"
        >
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-ink/15 text-ink font-medium text-[13px] px-8 py-3 rounded-full hover:border-primary hover:text-primary transition-all duration-300"
          >
            <Instagram size={15} /> Follow on Instagram
          </a>
        </motion.div>
      </div>
    </section>
  );
}
