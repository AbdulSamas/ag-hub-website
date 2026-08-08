import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {ArrowLeft,CheckCircle,CreditCard,Truck,MapPin,} from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatAED } from "@/lib/format";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/profile";
export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [placed, setPlaced] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: 'Dubai',
    emirate: 'Dubai',
    payment: 'cod',
  });

  const shipping = subtotal > 200 ? 0 : 25;
  const total = subtotal + shipping;
const generateOrderNumber = () => {
  return "AG-" + Date.now();
};
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.payment !== "cod") {
  alert("Online payment is coming soon. Please use Cash on Delivery.");
  return;
}
    const orderNumber = generateOrderNumber();
    const user = await getCurrentUser();

if (!user) {
  alert("Please login first");
  navigate("/login");
  return;
}

const { data: order, error: orderError } = await supabase

  .from("orders")
    .insert({
  user_id: user.id,
  order_number: orderNumber,
  customer_name: form.name,
  phone: form.phone,
  email: form.email,
  address: `${form.address}, ${form.city}, ${form.emirate}`,
  total_amount: total,
  payment_method: form.payment,
  status: "Pending",
})
  .select()
  .single();

if (orderError) {
  alert(orderError.message);
  return;
}
const orderItems = items.map((item) => ({
  order_id: order.id,
  product_id: item.product.id,
  product_name: item.product.name,
  quantity: item.quantity,
  price: item.product.price,
  subtotal: item.product.price * item.quantity,
}));
// Save order items
const { error: orderItemsError } = await supabase
  .from("order_items")
  .insert(orderItems);

if (orderItemsError) {
  alert(orderItemsError.message);
  
  return;
}

// Update product stock
for (const item of items) {
  const newStock = Math.max(0, item.product.stock - item.quantity);

  await supabase
    .from("products")
    .update({
      stock: newStock,
    })
    .eq("id", item.product.id);
}
const { data: existingUser } = await supabase
  .from("users")
  .select("*")
  .eq("email", form.email)
  .maybeSingle();

if (existingUser) {
  await supabase
    .from("users")
    .update({
      total_orders: existingUser.total_orders + 1,
      total_spent: Number(existingUser.total_spent) + total,
      phone: form.phone,
      full_name: form.name,
    })
    .eq("id", existingUser.id);
} else {
  const { data: newUser, error: userError } = await supabase
  .from("users")
  .insert({
    full_name: form.name,
    email: form.email,
    phone: form.phone,
    total_orders: 1,
    total_spent: total,
  })
  .select();

if (userError) {
  alert(userError.message);
console.log("USER ERROR:", userError);
} else {
console.log("NEW USER:", newUser);
}
}
setPlaced(true);

const { error } = await supabase
  .from("cart")
  .delete()
  .eq("user_id", user.id);

if (error) {
  console.error("Cart clear error:", error);
}

clearCart();
  };

  if (placed) {
    return (
      <div className="pt-[68px] sm:pt-[76px] min-h-screen bg-cream flex items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="glass-card rounded-[24px] p-10 sm:p-16 text-center max-w-md"
        >
          <CheckCircle size={56} className="text-accent-600 mx-auto mb-5" />
          <h1 className="clash text-[28px] font-bold text-ink mb-3">Order Confirmed!</h1>
          <p className="text-secondary text-[14px] font-light mb-6 leading-relaxed">
            Thank you for your purchase. We've sent a confirmation email with your order details.
            Your items will be delivered within 2-4 business days.
          </p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 bg-accent text-primary font-semibold text-[13px] px-6 py-3 rounded-full cta-glow"
          >
            Continue Shopping
          </button>
        </motion.div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="pt-[68px] sm:pt-[76px] min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-secondary text-[15px] mb-4 font-light">Your cart is empty.</p>
          <Link to="/shop" className="text-primary font-medium link-underline">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-[68px] sm:pt-[76px] min-h-screen bg-cream pb-16">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-10 pt-8">
        <Link
          to="/shop"
          className="inline-flex items-center gap-1.5 text-[12px] text-secondary hover:text-ink transition-colors mb-6"
        >
          <ArrowLeft size={14} /> Continue Shopping
        </Link>

        <h1 className="clash text-[28px] sm:text-[36px] font-bold text-ink mb-8">Checkout</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Form fields */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact */}
            <div className="bg-white rounded-[24px] p-6 shadow-card">
              <div className="flex items-center gap-2 mb-4">
                <MapPin size={16} className="text-primary" />
                <h2 className="font-semibold text-[15px] text-ink">Contact Details</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  required
                  placeholder="Full Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="bg-cream border border-ink/10 rounded-xl px-4 py-3 text-[13px] outline-none focus:border-primary transition-colors"
                />
                <input
                  required
                  type="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="bg-cream border border-ink/10 rounded-xl px-4 py-3 text-[13px] outline-none focus:border-primary transition-colors"
                />
                <input
                  required
                  type="tel"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="bg-cream border border-ink/10 rounded-xl px-4 py-3 text-[13px] outline-none focus:border-primary transition-colors sm:col-span-2"
                />
              </div>
            </div>

            {/* Shipping */}
            <div className="bg-white rounded-[24px] p-6 shadow-card">
              <div className="flex items-center gap-2 mb-4">
                <Truck size={16} className="text-primary" />
                <h2 className="font-semibold text-[15px] text-ink">Shipping Address</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  required
                  placeholder="Street Address"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="bg-cream border border-ink/10 rounded-xl px-4 py-3 text-[13px] outline-none focus:border-primary transition-colors sm:col-span-2"
                />
                <input
                  required
                  placeholder="City"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="bg-cream border border-ink/10 rounded-xl px-4 py-3 text-[13px] outline-none focus:border-primary transition-colors"
                />
                <select
                  value={form.emirate}
                  onChange={(e) => setForm({ ...form, emirate: e.target.value })}
                  className="bg-cream border border-ink/10 rounded-xl px-4 py-3 text-[13px] outline-none focus:border-primary transition-colors"
                >
                  {['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'].map((em) => (
                    <option key={em} value={em}>{em}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-[24px] p-6 shadow-card">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard size={16} className="text-primary" />
                <h2 className="font-semibold text-[15px] text-ink">Payment Method</h2>
              </div>
              <div className="space-y-3">
                {[
                  { value: 'cod', label: 'Cash on Delivery', sub: 'Pay when you receive' },
                  { value: 'card', label: 'Credit / Debit Card', sub: 'Visa, Mastercard, AmEx' },
                  { value: 'applepay', label: 'Apple Pay', sub: 'Quick and secure' },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                      form.payment === opt.value
                        ? 'border-primary bg-primary/5'
                        : 'border-ink/10 hover:border-ink/20'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={opt.value}
                      checked={form.payment === opt.value}
                      onChange={(e) => setForm({ ...form, payment: e.target.value })}
                      className="accent-primary"
                    />
                    <div>
                      <p className="text-[13px] font-medium text-ink">{opt.label}</p>
                      <p className="text-[11px] text-secondary font-light">{opt.sub}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[24px] p-6 shadow-card sticky top-24">
              <h2 className="font-semibold text-[15px] text-ink mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {items.map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-14 h-16 rounded-xl overflow-hidden shrink-0">
                      <img src={item.product.image_url || ''} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-medium text-ink line-clamp-1">{item.product.name}</p>
                      <p className="text-[10px] text-secondary">{item.size} · {item.color} · Qty {item.quantity}</p>
                      <p className="text-[12px] font-semibold text-ink mt-0.5">{formatAED(item.product.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-ink/5 pt-4 space-y-2">
                <div className="flex justify-between text-[13px]">
                  <span className="text-secondary">Subtotal</span>
                  <span className="font-medium text-ink">{formatAED(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-secondary">Shipping</span>
                  <span className="font-medium text-ink">{shipping === 0 ? 'Free' : formatAED(shipping)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-ink/5">
                  <span className="font-semibold text-ink">Total</span>
                  <span className="font-bold text-[18px] text-ink">{formatAED(total)}</span>
                </div>
              </div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-accent text-primary font-semibold py-3.5 rounded-full mt-6 text-[14px] cta-glow"
              >
                Place Order
              </motion.button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
