import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Offers() {
  const [offers, setOffers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  const [title, setTitle] = useState("");
  const [discount, setDiscount] = useState("");
  const [productId, setProductId] = useState("");

  useEffect(() => {
    fetchOffers();
    fetchProducts();
  }, []);

  async function fetchOffers() {
    const { data } = await supabase
      .from("offers")
      .select(`
        *,
        products(name)
      `)
      .order("created_at", { ascending: false });

    setOffers(data || []);
  }

  async function fetchProducts() {
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("name");

    setProducts(data || []);
  }

  async function addOffer() {
    if (!title || !discount || !productId) {
      alert("Fill all fields");
      return;
    }

    const { error } = await supabase
      .from("offers")
      .insert({
        title,
        discount: Number(discount),
        product_id: productId,
        active: true,
      });

    if (error) {
      alert(error.message);
      return;
    }

    setTitle("");
    setDiscount("");
    setProductId("");

    fetchOffers();
  }

  async function deleteOffer(id: string) {
    await supabase
      .from("offers")
      .delete()
      .eq("id", id);

    fetchOffers();
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        Offers
      </h1>

      <div className="bg-white rounded-xl shadow p-6 mb-8">

        <div className="grid md:grid-cols-4 gap-4">

          <input
            placeholder="Offer Title"
            className="border rounded-lg px-4 py-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            placeholder="Discount %"
            className="border rounded-lg px-4 py-2"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
          />

          <select
            className="border rounded-lg px-4 py-2"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
          >
            <option value="">
              Select Product
            </option>

            {products.map((product) => (
              <option
                key={product.id}
                value={product.id}
              >
                {product.name}
              </option>
            ))}
          </select>

          <button
            onClick={addOffer}
            className="bg-black text-white rounded-lg"
          >
            Add Offer
          </button>

        </div>
      </div>

      <div className="bg-white rounded-xl shadow">

        <table className="w-full">

          <thead>

            <tr className="border-b">

              <th className="text-left p-4">
                Title
              </th>

              <th className="text-left">
                Product
              </th>

              <th className="text-left">
                Discount
              </th>

              <th className="text-left">
                Status
              </th>

              <th className="text-left">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {offers.map((offer) => (

              <tr
                key={offer.id}
                className="border-b"
              >

                <td className="p-4">
                  {offer.title}
                </td>

                <td>
                  {offer.products?.name}
                </td>

                <td>
                  {offer.discount}%
                </td>

                <td>
                  {offer.active ? (
                    <span className="text-green-600">
                      Active
                    </span>
                  ) : (
                    <span className="text-red-600">
                      Inactive
                    </span>
                  )}
                </td>

                <td>

                  <button
                    onClick={() =>
                      deleteOffer(offer.id)
                    }
                    className="bg-red-500 text-white px-3 py-1 rounded"
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