import { motion } from 'framer-motion';
import { Instagram, Twitter, Facebook, Youtube, ArrowRight, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const footerLinks = {
  Shop: [
    { label: 'New Arrivals', path: '/shop?filter=new' },
    { label: 'Men', path: '/shop/Men' },
    { label: 'Women', path: '/shop/Women' },
    { label: 'Kids', path: '/shop/Kids' },
    { label: 'Cosmetics', path: '/shop/Cosmetics' },
    { label: 'Shoes', path: '/shop/Shoes' },
    { label: 'Accessories', path: '/shop/Accessories' },
  ],
  Company: ['About Us', 'Careers', 'Press', 'Sustainability', 'Investors'],
  Support: ['Help Center', 'Contact Us', 'Returns', 'Track Order', 'Size Guide'],
  Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Accessibility'],
};

const socials = [
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Youtube, href: '#', label: 'YouTube' },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-black/40 backdrop-blur-sm">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 py-16 sm:py-20">
        {/* Top section */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-10 sm:gap-12 pb-12 sm:pb-16 border-b border-white/10">
          {/* Brand column */}
          <div className="col-span-2 lg:col-span-2">
            <Link to="/" className="inline-block mb-5">
  <img
    src="/images/image.png"
    alt="AGHUB"
    className="h-16 w-auto object-contain"
  />
</Link>
            <p className="text-white/45 text-[13px] leading-relaxed mb-6 max-w-xs font-light">
              Elevating everyday fashion with premium quality, luxury aesthetics, and sustainable practices. Style that speaks.
            </p>
            <div className="flex flex-col gap-3 mb-8">
              {[
                { icon: Mail, text: 'hello@aghub.com' },
                { icon: Phone, text: '+971 4 123 4567' },
                { icon: MapPin, text: 'Dubai, United Arab Emirates' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-[13px] text-white/50 font-light">
                  <Icon size={14} className="text-accent shrink-0" />
                  {text}
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              {socials.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  whileHover={{ scale: 1.1, backgroundColor: '#F4E11B', color: '#0035AD' }}
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-white/8 flex items-center justify-center transition-colors"
                >
                  <Icon size={15} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="font-semibold text-[12px] sm:text-[13px] tracking-wider uppercase text-white mb-4 sm:mb-5">
                {heading}
              </h4>
              <ul className="space-y-2.5 sm:space-y-3">
                {links.map((link) => {
                  const label = typeof link === 'string' ? link : link.label;
                  const path = typeof link === 'string' ? '#' : link.path;
                  return (
                    <li key={label}>
                      {typeof link === 'string' ? (
                        <a
                          href="#"
                          className="text-[13px] text-white/45 hover:text-accent transition-colors duration-200 font-light"
                        >
                          {label}
                        </a>
                      ) : (
                        <Link
                          to={path}
                          className="text-[13px] text-white/45 hover:text-accent transition-colors duration-200 font-light"
                        >
                          {label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Payment icons row */}
        <div className="py-8 border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
          <p className="text-[12px] text-white/35 font-medium">Secure Payments</p>
          <div className="flex flex-wrap gap-2">
            {['Visa', 'Mastercard', 'AmEx', 'PayPal', 'Apple Pay', 'Google Pay', 'Cash on Delivery'].map((p) => (
              <span key={p} className="px-3 py-1 bg-white/8 rounded-lg text-[11px] font-medium text-white/55">
                {p}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-white/30 font-light">
          <p>© {new Date().getFullYear()} AG HUB. All rights reserved.</p>
          <p>Crafted with care — Luxury for everyone.</p>
        </div>
      </div>
    </footer>
  );
}