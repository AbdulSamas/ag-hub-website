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
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[999] flex justify-center items-start pt-20 px-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl p-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-bold">
            Search Products
          </h2>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Input */}
        <div className="flex items-center border rounded-xl px-4 py-3 mb-6">
          <Search size={18} className="text-gray-500" />

          <input
            autoFocus
            type="text"
            placeholder="Search by product, SKU or category..."
            className="ml-3 flex-1 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Results */}
        <div className="space-y-3 max-h-[450px] overflow-y-auto">

          {search.trim() === "" ? (
            <p className="text-center text-gray-500 py-8">
              Start typing to search products...
            </p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No products found.
            </p>
          ) : (
            filtered.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.slug}`}
                onClick={onClose}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-100 transition"
              >
                <img
                  src={product.image_url || "https://placehold.co/100x100?text=No+Image"}
                  alt={product.name}
                  className="w-16 h-16 rounded-xl object-cover border"
                />

                <div className="flex-1">
                  <h3 className="font-semibold">
                    {product.name}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {product.category}
                  </p>

                  <p className="text-xs text-gray-400">
                    SKU: {product.slug}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-bold">
                    AED {product.price}
                  </p>

                  <p className="text-xs text-green-600">
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