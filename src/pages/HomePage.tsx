import Hero from '@/components/Hero';
import FeaturedCategories from '@/components/FeaturedCategories';
import ProductSection from '@/components/ProductSection';
import CustomerReviews from '@/components/CustomerReviews';
import InstagramGallery from '@/components/InstagramGallery';
import Newsletter from '@/components/Newsletter';

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedCategories />
      <ProductSection
        eyebrow="What's Hot"
        title="Trending Collection"
        subtitle="Handpicked by our style experts — the pieces everyone's talking about."
        filter="is_featured"
        bg="sand"
      />
      <ProductSection
        eyebrow="Just In"
        title="New Arrivals"
        filter="is_new"
        bg="cream"
      />
      <ProductSection
        eyebrow="Most Loved"
        title="Best Sellers"
        subtitle="Customer favorites — the timeless pieces that never go out of style."
        filter="is_best_seller"
        bg="sand"
      />
      <ProductSection
        eyebrow="Limited Time"
        title="Flash Sale"
        subtitle="Up to 55% off on selected items. Hurry, limited stock."
        filter="is_on_sale"
        bg="cream"
      />
      <CustomerReviews />
      <InstagramGallery />
      <Newsletter />
    </>
  );
}
