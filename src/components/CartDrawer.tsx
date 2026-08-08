import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/lib/cart';
import { formatAED } from '@/lib/format';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeFromCart, updateQuantity, subtotal, count } = useCart();
  const navigate = useNavigate();

  const goToCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-ink/30 backdrop-blur-sm z-[200]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-[420px] bg-cream z-[201] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-ink/5">
              <div className="flex items-center gap-2">
                <ShoppingBag size={18} className="text-ink" />
                <span className="font-semibold text-[15px] text-ink">
                  Cart {count > 0 && `(${count})`}
                </span>
              </div>
              <button onClick={closeCart} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-ink/5">
                <X size={18} className="text-ink" />
              </button>
            </div>

            {/* Items */}
            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 px-8 text-center">
                <div className="w-16 h-16 rounded-full bg-ink/5 flex items-center justify-center">
                  <ShoppingBag size={24} className="text-secondary" />
                </div>
                <p className="text-secondary text-[14px] font-light">Your cart is empty</p>
                <button
                  onClick={closeCart}
                  className="text-[13px] font-medium text-primary link-underline"
                >
                  Continue shopping
                </button>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                {items.map((item, i) => (
                  <div key={i} className="flex gap-3 bg-white rounded-2xl p-3 shadow-card">
                    <div className="w-20 h-24 rounded-xl overflow-hidden shrink-0">
                      <img
                        src={item.product.image_url || ''}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col">
                      <h4 className="font-medium text-[13px] text-ink leading-snug line-clamp-1">
                        {item.product.name}
                      </h4>
                      <p className="text-[11px] text-secondary mt-0.5">
                        {item.size} · {item.color}
                      </p>
                      <span className="font-semibold text-[13px] text-ink mt-1">
                        {formatAED(item.product.price)}
                      </span>
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-2 bg-cream rounded-full px-1.5 py-1">
                          <button
                            onClick={() => updateQuantity(i, item.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-ink/5"
                          >
                            <Minus size={12} className="text-ink" />
                          </button>
                          <span className="text-[12px] font-medium text-ink w-5 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(i, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-ink/5"
                          >
                            <Plus size={12} className="text-ink" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(i)}
                          className="text-[11px] text-secondary hover:text-error transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-ink/5 px-5 py-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-secondary font-medium">Subtotal</span>
                  <span className="font-bold text-[18px] text-ink">{formatAED(subtotal)}</span>
                </div>
                <p className="text-[11px] text-secondary font-light">
                  Shipping and taxes calculated at checkout.
                </p>
                <button
                  onClick={goToCheckout}
                  className="w-full bg-accent text-primary font-semibold py-3.5 rounded-full flex items-center justify-center gap-2 text-[14px] cta-glow"
                >
                  Checkout <ArrowRight size={15} />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
