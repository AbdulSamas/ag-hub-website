import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/lib/cart';
import { formatAED } from '@/lib/format';

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    subtotal,
    count,
  } = useCart();

  const navigate = useNavigate();

  const goToCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[200]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-[420px] bg-[#080808] border-l border-white/10 z-[201] flex flex-col text-white shadow-[-20px_0_60px_rgba(0,0,0,0.5)]"
          >

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <ShoppingBag size={18} className="text-white" />

                <span className="font-semibold text-[15px] text-white">
                  Cart {count > 0 && `(${count})`}
                </span>
              </div>

              <button
                onClick={closeCart}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition"
              >
                <X size={18} className="text-white" />
              </button>
            </div>

            {/* Empty Cart */}
            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 px-8 text-center">

                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <ShoppingBag
                    size={24}
                    className="text-white/40"
                  />
                </div>

                <p className="text-white/50 text-[14px] font-light">
                  Your cart is empty
                </p>

                <button
                  onClick={closeCart}
                  className="text-[13px] font-medium text-[#F4E11B] hover:text-white transition-colors"
                >
                  Continue shopping
                </button>
              </div>
            ) : (

              /* Cart Items */
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">

                {items.map((item, i) => (
                  <div
                    key={i}
                    className="flex gap-3 bg-white/[0.05] border border-white/10 rounded-2xl p-3 backdrop-blur-xl hover:bg-white/[0.07] transition"
                  >

                    {/* Product Image */}
                    <div className="w-20 h-24 rounded-xl overflow-hidden shrink-0 bg-white/5">
                      <img
                        src={item.product.image_url || ''}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0 flex flex-col">

                      <h4 className="font-medium text-[13px] text-white leading-snug line-clamp-1">
                        {item.product.name}
                      </h4>

                      <p className="text-[11px] text-white/40 mt-0.5">
                        {item.size} · {item.color}
                      </p>

                      <span className="font-semibold text-[13px] text-white mt-1">
                        {formatAED(item.product.price)}
                      </span>

                      {/* Quantity + Remove */}
                      <div className="flex items-center justify-between mt-auto">

                        <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-full px-1.5 py-1">

                          <button
                            onClick={() =>
                              updateQuantity(i, item.quantity - 1)
                            }
                            className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10 transition"
                          >
                            <Minus
                              size={12}
                              className="text-white"
                            />
                          </button>

                          <span className="text-[12px] font-medium text-white w-5 text-center">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              updateQuantity(i, item.quantity + 1)
                            }
                            className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10 transition"
                          >
                            <Plus
                              size={12}
                              className="text-white"
                            />
                          </button>

                        </div>

                        <button
                          onClick={() => removeFromCart(i)}
                          className="text-[11px] text-white/40 hover:text-red-400 transition-colors"
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
              <div className="border-t border-white/10 bg-[#080808] px-5 py-5 space-y-4">

                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-white/50 font-medium">
                    Subtotal
                  </span>

                  <span className="font-bold text-[18px] text-white">
                    {formatAED(subtotal)}
                  </span>
                </div>

                <p className="text-[11px] text-white/40 font-light">
                  Shipping and taxes calculated at checkout.
                </p>

                <button
                  onClick={goToCheckout}
                  className="w-full bg-[#F4E11B] text-black font-semibold py-3.5 rounded-full flex items-center justify-center gap-2 text-[14px] shadow-[0_4px_20px_rgba(244,225,27,0.2)] hover:shadow-[0_8px_30px_rgba(244,225,27,0.35)] hover:-translate-y-0.5 transition-all duration-300"
                >
                  Checkout
                  <ArrowRight size={15} />
                </button>

              </div>
            )}

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}