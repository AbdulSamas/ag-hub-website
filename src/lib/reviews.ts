import { supabase } from "./supabase";

export async function getReviews(productId: string) {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("product_id", productId)
    .eq("is_approved", true)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data ?? [];
}

export async function addReview(
  productId: string,
  rating: number,
  comment: string
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Please login first");
  }

  const { error } = await supabase.from("reviews").insert({
    product_id: productId,
    user_id: user.id,
    user_name:
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email,
    rating,
    comment,
    is_verified: true,
    is_approved: true,
  });

  if (error) throw error;
}

export async function updateReview(
  reviewId: string,
  rating: number,
  comment: string
) {
  const { error } = await supabase
    .from("reviews")
    .update({
      rating,
      comment,
    })
    .eq("id", reviewId);

  if (error) throw error;
}

export async function deleteReview(reviewId: string) {
  const { error } = await supabase
    .from("reviews")
    .delete()
    .eq("id", reviewId);

  if (error) throw error;
}

export async function getAverageRating(productId: string) {
  const reviews = await getReviews(productId);

  if (reviews.length === 0) {
    return {
      average: 0,
      total: 0,
    };
  }

  const totalStars = reviews.reduce(
    (sum, review) => sum + review.rating,
    0
  );

  return {
    average: Number(
      (totalStars / reviews.length).toFixed(1)
    ),
    total: reviews.length,
  };
}