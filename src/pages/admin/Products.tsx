import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router-dom";
export default function Products() {
    const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetchProducts();
}, []);
async function handleDelete(id: string) {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this product?"
  );

  if (!confirmDelete) return;

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) {
    alert(error.message);
    return;
  }

  alert("Product deleted successfully!");

  fetchProducts();
}

async function fetchProducts() {
  setLoading(true);

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (!error) {
    setProducts(data || []);
  }

  setLoading(false);
}

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          Products
        </h1>

       <button
  onClick={() => navigate("/admin/products/new")}
  className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800"
>
  + Add Product
</button>
</div>

{loading && (
  <div className="mb-4 text-gray-600">
    Loading products...
  </div>
)}

<div className="bg-white rounded-xl shadow overflow-hidden"></div>


      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-4">Product</th>
              <th className="text-left p-4">Category</th>
              <th className="text-left p-4">Price</th>
              <th className="text-left p-4">Stock</th>
              <th className="text-left p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t">
               <td className="p-4">
  <div className="flex items-center gap-3">
    <img
      src={product.image_url}
      alt={product.name}
      className="w-14 h-14 rounded-lg object-cover border"
      onError={(e) => {
        e.currentTarget.src =
          "https://placehold.co/80x80?text=No+Image";
      }}
    />

    <div>
      <p className="font-semibold">{product.name}</p>
      <p className="text-xs text-gray-500">
        {product.sku}
      </p>
    </div>
  </div>
</td>
              <td className="p-4">{product.category || "-"}</td>
                <td className="p-4">AED {product.price}</td>
               <td className="p-4">
  {product.stock <= 0 ? (
    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
      Out of Stock
    </span>
  ) : product.stock <= 5 ? (
    <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
      Low Stock ({product.stock})
    </span>
  ) : (
    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
      In Stock ({product.stock})
    </span>
  )}
</td>

                <td className="p-4 space-x-2">
                  <button
  onClick={() => navigate(`/admin/products/edit/${product.id}`)}
  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
>
  Edit
</button>
<button
  onClick={() => handleDelete(product.id)}
  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
>
  Delete
</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}