import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const categories = [
  {
    title: 'Men',
    subtitle: 'Shop Now',
    img: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=600',
    path: '/shop/Men',
  },
  {
    title: 'Women',
    subtitle: 'Shop Now',
    img: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=600',
    path: '/shop/Women',
  },
  {
    title: 'Kids',
    subtitle: 'Shop Now',
    img: 'https://images.pexels.com/photos/35537/child-children-girl-happy.jpg?auto=compress&cs=tinysrgb&w=600',
    path: '/shop/Kids',
  },
  {
    title: 'Cosmetics',
    subtitle: 'Shop Now',
    img: 'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=600',
    path: '/shop/Cosmetics',
  },
  {
    title: 'Shoes',
    subtitle: 'Shop Now',
    img: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=600',
    path: '/shop/Shoes',
  },
  {
    title: 'Accessories',
    subtitle: 'Shop Now',
    img: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=600',
    path: '/shop/Accessories',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function FeaturedCategories() {
  return (
    <section id="categories" className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-10">
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
              Browse
            </span>
            <h2 className="clash text-[32px] sm:text-[42px] font-bold leading-tight text-white">
              Featured Categories
            </h2>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-[13px] font-medium text-white/60 hover:text-accent transition-colors link-underline"
          >
            View All <ArrowRight size={15} />
          </Link>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {categories.map((cat) => (
            <motion.div key={cat.title} variants={itemVariants} whileHover={{ y: -6 }}>
              <Link to={cat.path} className="group block cursor-pointer">
                <div className="relative rounded-[24px] overflow-hidden aspect-[3/4] bg-white/5 ring-1 ring-white/10 lift mb-3">
                  <img
                    src={cat.img}
                    alt={cat.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                    <p className="text-white font-semibold text-[15px] sm:text-[16px] leading-tight">{cat.title}</p>
                    <p className="text-white/70 text-[11px] font-medium mt-0.5 flex items-center gap-1">
                      {cat.subtitle} <ArrowRight size={11} />
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}