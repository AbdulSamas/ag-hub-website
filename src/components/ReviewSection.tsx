import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

interface Props {
  productId: string;
}

interface Review {
  id: string;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export default function ReviewSection({ productId }: Props) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const [userName, setUserName] = useState("");

  useEffect(() => {
    loadReviews();
    loadUser();
  }, [productId]);

  async function loadUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single();

    if (data) {
      setUserName(data.full_name);
    }
  }

  async function loadReviews() {
    setLoading(true);

    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("product_id", productId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setReviews(data);
    }

    setLoading(false);
  }
    async function submitReview() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Please login first");
      return;
    }

    if (!comment.trim()) {
      toast.error("Write a review");
      return;
    }
    const { data: existingReview } = await supabase
  .from("reviews")
  .select("id")
  .eq("product_id", productId)
  .eq("user_id", user.id)
  .maybeSingle();

if (existingReview) {
  toast.error("You already reviewed this product");
  return;
}

   const { error } = await supabase.from("reviews").insert({
  product_id: productId,
  user_id: user.id,
  user_name: userName || "User",
  rating,
  comment,
});
    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Review added");

    setComment("");
    setRating(5);

    loadReviews();
  }

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-6">
        Customer Reviews
      </h2>

      <div className="bg-white rounded-2xl p-6 shadow mb-8">
        <h3 className="font-semibold mb-4">
          Write a Review
        </h3>

        <div className="flex gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
            >
              <Star
                size={26}
                className={
                  star <= rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }
              />
            </button>
          ))}
        </div>

        <textarea
          rows={4}
          className="w-full border rounded-xl p-3"
          placeholder="Write your review..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <button
          onClick={submitReview}
          className="mt-4 bg-black text-white px-6 py-3 rounded-xl"
        >
          Submit Review
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <p>Loading...</p>
        ) : reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-2xl shadow p-5"
            >
              <div className="flex justify-between mb-2">
                <h4 className="font-semibold">
                  {review.user_name}
                </h4>

                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={18}
                      className={
                        star <= review.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>
              </div>

              <p className="text-gray-600">
                {review.comment}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}