import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase, Product } from "@/lib/supabase";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function SearchModal({ open, onClose }: Props) {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!open) return;

    async function loadProducts() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .gt("stock", 0)
        .order("created_at", { ascending: false });

      if (!error) {
        setProducts((data as Product[]) || []);
      }
    }

    loadProducts();
  }, [open]);

  if (!open) return null;

  const filtered = products.filter((item) => {
    const keyword = search.toLowerCase();

    return (
      item.name.toLowerCase().includes(keyword) ||
      item.category?.toLowerCase().includes(keyword) ||
      item.slug?.toLowerCase().includes(keyword)
    );
  });

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xl z-[999] flex justify-center items-start pt-20 px-4">

      <div className="w-full max-w-2xl rounded-3xl bg-[#0a0a0a]/95 backdrop-blur-2xl border border-white/10 shadow-[0_25px_100px_rgba(0,0,0,0.7)] p-6 text-white">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="clash text-2xl font-bold text-white">
            Search Products
          </h2>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
          >
            <X size={20} className="text-white/70" />
          </button>
        </div>

        {/* Search Input */}
        <div className="flex items-center bg-white/[0.06] border border-white/10 focus-within:border-white/25 rounded-xl px-4 py-3 mb-6 transition">
          <Search size={18} className="text-white/40" />

          <input
            autoFocus
            type="text"
            placeholder="Search by product, SKU or category..."
            className="ml-3 flex-1 outline-none bg-transparent text-white placeholder:text-white/30"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Results */}
        <div className="space-y-3 max-h-[450px] overflow-y-auto scrollbar-hide">

          {search.trim() === "" ? (
            <p className="text-center text-white/40 py-8">
              Start typing to search products...
            </p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-white/40 py-8">
              No products found.
            </p>
          ) : (
            filtered.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.slug}`}
                onClick={onClose}
                className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-white/10 transition"
              >
                <img
                  src={
                    product.image_url ||
                    "https://placehold.co/100x100?text=No+Image"
                  }
                  alt={product.name}
                  className="w-16 h-16 rounded-xl object-cover border border-white/10"
                />

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white truncate">
                    {product.name}
                  </h3>

                  <p className="text-sm text-white/50">
                    {product.category}
                  </p>

                  <p className="text-xs text-white/30">
                    SKU: {product.slug}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <p className="font-bold text-white">
                    AED {product.price}
                  </p>

                  <p className="text-xs text-[#F4E11B]">
                    In Stock ({product.stock})
                  </p>
                </div>
              </Link>
            ))
          )}

        </div>
      </div>
    </div>
  );
}