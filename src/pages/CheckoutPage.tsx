import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  CreditCard,
  Truck,
  MapPin,
} from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatAED } from "@/lib/format";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/profile";

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [placed, setPlaced] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "Dubai",
    emirate: "Dubai",
    payment: "cod",
  });

  const shipping = subtotal > 200 ? 0 : 25;
  const total = subtotal + shipping;

  const generateOrderNumber = () => {
    return "AG-" + Date.now();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.payment !== "cod") {
      alert(
        "Online payment is coming soon. Please use Cash on Delivery."
      );
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

    const { error: orderItemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (orderItemsError) {
      alert(orderItemsError.message);
      return;
    }

    // Update product stock
    for (const item of items) {
      const newStock = Math.max(
        0,
        item.product.stock - item.quantity
      );

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

  /* =========================
     ORDER SUCCESS
  ========================= */
  if (placed) {
    return (
      <div className="pt-[68px] sm:pt-[76px] min-h-screen bg-transparent flex items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-white/[0.06] backdrop-blur-2xl border border-white/10 rounded-[24px] p-10 sm:p-16 text-center shadow-[0_20px_70px_rgba(0,0,0,0.45)]"
        >
          <div className="w-16 h-16 rounded-full bg-[#F4E11B]/10 border border-[#F4E11B]/20 flex items-center justify-center mx-auto mb-5">
            <CheckCircle
              size={32}
              className="text-[#F4E11B]"
            />
          </div>

          <h1 className="clash text-[28px] font-bold text-white mb-3">
            Order Confirmed!
          </h1>

          <p className="text-white/50 text-[14px] font-light mb-6 leading-relaxed">
            Thank you for your purchase. We've sent a confirmation
            email with your order details. Your items will be delivered
            within 2-4 business days.
          </p>

          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 bg-[#F4E11B] text-black font-semibold text-[13px] px-6 py-3 rounded-full shadow-[0_4px_20px_rgba(244,225,27,0.2)] hover:shadow-[0_8px_30px_rgba(244,225,27,0.35)] hover:-translate-y-0.5 transition-all"
          >
            Continue Shopping
          </button>
        </motion.div>
      </div>
    );
  }

  /* =========================
     EMPTY CART
  ========================= */
  if (items.length === 0) {
    return (
      <div className="pt-[68px] sm:pt-[76px] min-h-screen bg-transparent flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-5">
            <CreditCard
              size={24}
              className="text-white/40"
            />
          </div>

          <p className="text-white/50 text-[15px] mb-4 font-light">
            Your cart is empty.
          </p>

          <Link
            to="/shop"
            className="text-[#F4E11B] font-medium hover:text-white transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-[68px] sm:pt-[76px] min-h-screen bg-transparent text-white pb-16">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-10 pt-8">

        {/* Continue Shopping */}
        <Link
          to="/shop"
          className="inline-flex items-center gap-1.5 text-[12px] text-white/40 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft size={14} />
          Continue Shopping
        </Link>

        <h1 className="clash text-[28px] sm:text-[36px] font-bold text-white mb-8">
          Checkout
        </h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8"
        >

          {/* =========================
              LEFT SIDE
          ========================= */}
          <div className="lg:col-span-2 space-y-6">

            {/* Contact */}
            <div className="bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded-[24px] p-6 shadow-[0_15px_50px_rgba(0,0,0,0.25)]">
              <div className="flex items-center gap-2 mb-4">
                <MapPin
                  size={16}
                  className="text-[#F4E11B]"
                />

                <h2 className="font-semibold text-[15px] text-white">
                  Contact Details
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <input
                  required
                  placeholder="Full Name"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  className="bg-white/[0.04] border border-white/10 text-white placeholder:text-white/30 rounded-xl px-4 py-3 text-[13px] outline-none focus:border-[#F4E11B]/60 transition-colors"
                />

                <input
                  required
                  type="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value,
                    })
                  }
                  className="bg-white/[0.04] border border-white/10 text-white placeholder:text-white/30 rounded-xl px-4 py-3 text-[13px] outline-none focus:border-[#F4E11B]/60 transition-colors"
                />

                <input
                  required
                  type="tel"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      phone: e.target.value,
                    })
                  }
                  className="bg-white/[0.04] border border-white/10 text-white placeholder:text-white/30 rounded-xl px-4 py-3 text-[13px] outline-none focus:border-[#F4E11B]/60 transition-colors sm:col-span-2"
                />

              </div>
            </div>

            {/* Shipping */}
            <div className="bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded-[24px] p-6 shadow-[0_15px_50px_rgba(0,0,0,0.25)]">
              <div className="flex items-center gap-2 mb-4">
                <Truck
                  size={16}
                  className="text-[#F4E11B]"
                />

                <h2 className="font-semibold text-[15px] text-white">
                  Shipping Address
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <input
                  required
                  placeholder="Street Address"
                  value={form.address}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      address: e.target.value,
                    })
                  }
                  className="bg-white/[0.04] border border-white/10 text-white placeholder:text-white/30 rounded-xl px-4 py-3 text-[13px] outline-none focus:border-[#F4E11B]/60 transition-colors sm:col-span-2"
                />

                <input
                  required
                  placeholder="City"
                  value={form.city}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      city: e.target.value,
                    })
                  }
                  className="bg-white/[0.04] border border-white/10 text-white placeholder:text-white/30 rounded-xl px-4 py-3 text-[13px] outline-none focus:border-[#F4E11B]/60 transition-colors"
                />

                <select
                  value={form.emirate}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      emirate: e.target.value,
                    })
                  }
                  className="bg-[#0b0b0b] border border-white/10 text-white rounded-xl px-4 py-3 text-[13px] outline-none focus:border-[#F4E11B]/60 transition-colors"
                >
                  {[
                    "Dubai",
                    "Abu Dhabi",
                    "Sharjah",
                    "Ajman",
                    "Ras Al Khaimah",
                    "Fujairah",
                    "Umm Al Quwain",
                  ].map((em) => (
                    <option
                      key={em}
                      value={em}
                      className="bg-[#0b0b0b] text-white"
                    >
                      {em}
                    </option>
                  ))}
                </select>

              </div>
            </div>

            {/* Payment */}
            <div className="bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded-[24px] p-6 shadow-[0_15px_50px_rgba(0,0,0,0.25)]">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard
                  size={16}
                  className="text-[#F4E11B]"
                />

                <h2 className="font-semibold text-[15px] text-white">
                  Payment Method
                </h2>
              </div>

              <div className="space-y-3">
                {[
                  {
                    value: "cod",
                    label: "Cash on Delivery",
                    sub: "Pay when you receive",
                  },
                  {
                    value: "card",
                    label: "Credit / Debit Card",
                    sub: "Visa, Mastercard, AmEx",
                  },
                  {
                    value: "applepay",
                    label: "Apple Pay",
                    sub: "Quick and secure",
                  },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                      form.payment === opt.value
                        ? "border-[#F4E11B]/60 bg-[#F4E11B]/[0.06]"
                        : "border-white/10 hover:border-white/20 bg-white/[0.02]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={opt.value}
                      checked={form.payment === opt.value}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          payment: e.target.value,
                        })
                      }
                      className="accent-[#F4E11B]"
                    />

                    <div>
                      <p className="text-[13px] font-medium text-white">
                        {opt.label}
                      </p>

                      <p className="text-[11px] text-white/40 font-light">
                        {opt.sub}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* =========================
              ORDER SUMMARY
          ========================= */}
          <div className="lg:col-span-1">

            <div className="bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded-[24px] p-6 shadow-[0_15px_50px_rgba(0,0,0,0.3)] sticky top-24">

              <h2 className="font-semibold text-[15px] text-white mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">

                {items.map((item, i) => (
                  <div
                    key={i}
                    className="flex gap-3"
                  >
                    <div className="w-14 h-16 rounded-xl overflow-hidden shrink-0 bg-white/5">
                      <img
                        src={item.product.image_url || ""}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-medium text-white line-clamp-1">
                        {item.product.name}
                      </p>

                      <p className="text-[10px] text-white/40">
                        {item.size} · {item.color} · Qty{" "}
                        {item.quantity}
                      </p>

                      <p className="text-[12px] font-semibold text-white mt-0.5">
                        {formatAED(
                          item.product.price *
                            item.quantity
                        )}
                      </p>
                    </div>
                  </div>
                ))}

              </div>

              <div className="border-t border-white/10 pt-4 space-y-2">

                <div className="flex justify-between text-[13px]">
                  <span className="text-white/50">
                    Subtotal
                  </span>

                  <span className="font-medium text-white">
                    {formatAED(subtotal)}
                  </span>
                </div>

                <div className="flex justify-between text-[13px]">
                  <span className="text-white/50">
                    Shipping
                  </span>

                  <span className="font-medium text-white">
                    {shipping === 0
                      ? "Free"
                      : formatAED(shipping)}
                  </span>
                </div>

                <div className="flex justify-between pt-3 border-t border-white/10">
                  <span className="font-semibold text-white">
                    Total
                  </span>

                  <span className="font-bold text-[18px] text-white">
                    {formatAED(total)}
                  </span>
                </div>

              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-[#F4E11B] text-black font-semibold py-3.5 rounded-full mt-6 text-[14px] shadow-[0_4px_20px_rgba(244,225,27,0.2)] hover:shadow-[0_8px_30px_rgba(244,225,27,0.35)] transition-all"
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