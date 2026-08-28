import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  };

  return (
    <section id="newsletter" className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-10 overflow-hidden">
      <div className="max-w-[1280px] mx-auto relative">
        <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-accent/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10 sm:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex-1 text-center lg:text-left"
          >
            <span className="text-[11px] font-medium text-accent tracking-[0.2em] uppercase mb-3 block">
              Newsletter
            </span>
            <h2 className="clash text-[30px] sm:text-[44px] font-bold leading-tight text-white mb-4 text-balance">
              Stay Ahead of<br />Every Trend
            </h2>
            <p className="text-white/50 text-[14px] leading-relaxed max-w-md font-light">
              Join 50,000+ style-conscious subscribers. Get exclusive drops, early sale access,
              and style inspiration delivered straight to your inbox.
            </p>
            <div className="flex flex-wrap gap-4 sm:gap-5 mt-6 justify-center lg:justify-start">
              {['Free Style Tips', 'Early Access', 'Exclusive Offers'].map((item) => (
                <div key={item} className="flex items-center gap-2 text-[12px] text-white/60 font-medium">
                  <CheckCircle size={13} className="text-accent" />
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex-1 w-full max-w-lg"
          >
            {submitted ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="glass-dark rounded-[24px] p-10 sm:p-12 text-center"
              >
                <CheckCircle size={44} className="text-accent mx-auto mb-4" />
                <h3 className="text-white font-semibold text-[20px] mb-2">You're in!</h3>
                <p className="text-white/50 text-[14px] font-light">
                  Welcome to the AG HUB community. Watch your inbox.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="glass-dark rounded-[24px] p-6 sm:p-9">
                <div className="mb-5">
                  <label className="block text-white/50 text-[12px] font-medium mb-2">Your Name</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-xl px-4 py-3 text-[13px] outline-none focus:border-accent transition-colors"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-white/50 text-[12px] font-medium mb-2">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-xl px-4 py-3 text-[13px] outline-none focus:border-accent transition-colors"
                  />
                </div>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="w-full bg-accent text-primary font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 text-[14px] cta-glow"
                >
                  Subscribe Now <ArrowRight size={15} />
                </motion.button>
                <p className="text-white/40 text-[11px] text-center mt-4 font-light">
                  No spam. Unsubscribe anytime.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}