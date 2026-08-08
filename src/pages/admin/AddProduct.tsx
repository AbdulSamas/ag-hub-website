import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useNavigate, useParams } from "react-router-dom";

export default function AddProduct() {
    const navigate = useNavigate();
    const { id } = useParams();

const [formData, setFormData] = useState({
  name: "",
  sku: "",
  brand: "AG HUB",
  category: "Cosmetics",
  price: "",
  sale_price: "",
  stock: "",
  weight: "",
  short_description: "",
  description: "",
});

const [image, setImage] = useState<File | null>(null);
const [loading, setLoading] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [bestSeller, setBestSeller] = useState(false);
  const [newArrival, setNewArrival] = useState(false);
  const [onSale, setOnSale] = useState(false);
  useEffect(() => {
  if (id) {
    fetchProduct();
  }
}, [id]);

async function fetchProduct() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return;

  setFormData({
    name: data.name || "",
    sku: data.sku || "",
    brand: "AG HUB",
    category: data.category || "Cosmetics",
    price: String(data.price || ""),
    sale_price: String(data.sale_price || ""),
    stock: String(data.stock || ""),
    weight: String(data.weight || ""),
    short_description: data.short_description || "",
    description: data.description || "",
  });

  setFeatured(data.is_featured || false);
  setBestSeller(data.is_best_seller || false);
  setNewArrival(data.is_new_arrival || false);
  setOnSale(data.is_on_sale || false);
}
  async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();

 setLoading(true);

let imageUrl = "";
if (image) {
  const fileName = `${Date.now()}-${image.name}`;

  const { error: uploadError } = await supabase.storage
    .from("products")
    .upload(fileName, image);
    console.log("UPLOAD ERROR:", uploadError);

  if (uploadError) {
    alert(uploadError.message);
    setLoading(false);
    return;
  }

  const { data } = supabase.storage
    .from("products")
    .getPublicUrl(fileName);

  imageUrl = data.publicUrl;
}

const slug = formData.name
  .toLowerCase()
  .trim()
  .replace(/\s+/g, "-")
  .replace(/[^a-z0-9-]/g, "");

let error;

if (id) {
  ({ error } = await supabase
    .from("products")
    .update({
      name: formData.name,
      sku: formData.sku,
      category: formData.category,
      description: formData.description,
      short_description: formData.short_description,
      price: Number(formData.price),
      sale_price: Number(formData.sale_price),
      stock: Number(formData.stock),
      weight: Number(formData.weight),
      image_url: imageUrl || undefined,
      is_featured: featured,
      is_best_seller: bestSeller,
      is_new_arrival: newArrival,
      is_on_sale: onSale,
      status: true,
    })
    .eq("id", id));
} else {
  ({ error } = await supabase.from("products").insert({
  name: formData.name,
  slug: slug,
  sku: formData.sku,
  
  category: formData.category,
  description: formData.description,
  short_description: formData.short_description,
  price: Number(formData.price),
  sale_price: Number(formData.sale_price),
  stock: Number(formData.stock),
  weight: Number(formData.weight),
  image_url: imageUrl,
  is_featured: featured,
  is_best_seller: bestSeller,
  is_new_arrival: newArrival,
  is_on_sale: onSale,
  status: true,
}));
}

console.log(id ? "UPDATE ERROR:" : "INSERT ERROR:", error);
if (error) {
  console.error(error);
  alert(JSON.stringify(error, null, 2));
  setLoading(false);
  return;
}
alert("Product added successfully!");
setLoading(false);
navigate("/admin/products");
}
  

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-8">
      <h1 className="text-3xl font-bold mb-8">
        Add New Product
      </h1>

     <form
  onSubmit={handleSubmit}
  className="space-y-6"
>

        <div className="grid grid-cols-2 gap-6">

          <div>
            <label className="block mb-2 font-semibold">
              Product Name
            </label>
            <input
  type="text"
  className="w-full border rounded-lg p-3"
  placeholder="AG Gold Whitening Cream"
  value={formData.name}
  onChange={(e) =>
    setFormData({
      ...formData,
      name: e.target.value,
    })
  }
/>
          </div>

          <div>
            <label className="block mb-2 font-semibold">
              SKU
            </label>
            <input
  type="text"
  className="w-full border rounded-lg p-3"
  placeholder="AG-001"
  value={formData.sku}
  onChange={(e) =>
    setFormData({
      ...formData,
      sku: e.target.value,
    })
  }
/>
          </div>

          <div>
            <label className="block mb-2 font-semibold">
              Brand
            </label>
            <input
  type="text"
  className="w-full border rounded-lg p-3"
  value={formData.brand}
  onChange={(e) =>
    setFormData({
      ...formData,
      brand: e.target.value,
    })
  }
/>
          </div>

          <div>
            <label className="block mb-2 font-semibold">
              Category
            </label>

           <select
  className="w-full border rounded-lg p-3"
  value={formData.category}
  onChange={(e) =>
    setFormData({
      ...formData,
      category: e.target.value,
    })
  }
>
              <option>Cosmetics</option>
              <option>Men</option>
              <option>Women</option>
              <option>Shoes</option>
              <option>Accessories</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-semibold">
              Price
            </label>

            <input
  type="number"
  className="w-full border rounded-lg p-3"
  value={formData.price}
  onChange={(e) =>
    setFormData({
      ...formData,
      price: e.target.value,
    })
  }
/>
          </div>

          <div>
            <label className="block mb-2 font-semibold">
              Sale Price
            </label>

          <input
  type="number"
  className="w-full border rounded-lg p-3"
  value={formData.sale_price}
  onChange={(e) =>
    setFormData({
      ...formData,
      sale_price: e.target.value,
    })
  }
/>
          </div>

          <div>
            <label className="block mb-2 font-semibold">
              Stock
            </label>

          <input
  type="number"
  className="w-full border rounded-lg p-3"
  value={formData.stock}
  onChange={(e) =>
    setFormData({
      ...formData,
      stock: e.target.value,
    })
  }
/>
          </div>

          <div>
            <label className="block mb-2 font-semibold">
              Weight
            </label>

            <input
  type="text"
  className="w-full border rounded-lg p-3"
  placeholder="200g"
  value={formData.weight}
  onChange={(e) =>
    setFormData({
      ...formData,
      weight: e.target.value,
    })
  }
/>
          </div>

        </div>

        <div>
          <label className="block mb-2 font-semibold">
            Short Description
          </label>

         <textarea
  rows={3}
  className="w-full border rounded-lg p-3"
  value={formData.short_description}
  onChange={(e) =>
    setFormData({
      ...formData,
      short_description: e.target.value,
    })
  }
/>
        </div>

        <div>
          <label className="block mb-2 font-semibold">
            Full Description
          </label>

          <textarea
  rows={6}
  className="w-full border rounded-lg p-3"
  value={formData.description}
  onChange={(e) =>
    setFormData({
      ...formData,
      description: e.target.value,
    })
  }
/>
        </div>

        <div>
          <label className="block mb-2 font-semibold">
            Product Image
          </label>

        <input
  type="file"
  className="w-full border rounded-lg p-3"
  onChange={(e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  }}
/>
        </div>

        <div className="grid grid-cols-2 gap-4">

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={featured}
              onChange={() => setFeatured(!featured)}
            />
            Featured Product
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={bestSeller}
              onChange={() => setBestSeller(!bestSeller)}
            />
            Best Seller
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={newArrival}
              onChange={() => setNewArrival(!newArrival)}
            />
            New Arrival
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={onSale}
              onChange={() => setOnSale(!onSale)}
            />
            On Sale
          </label>

        </div>

        <button
          type="submit"
          className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800"
        >
          Save Product
        </button>

      </form>
    </div>
  );
}