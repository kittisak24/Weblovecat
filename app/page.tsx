import Header from "@/components/header"
import Hero from "@/components/hero"
import Services from "@/components/services"
import FeaturedProducts from "@/components/featured-products"
import WhyChooseUs from "@/components/why-choose-us"
import Testimonials from "@/components/testimonials"
import BlogSection from "@/components/blog-section"
import Newsletter from "@/components/newsletter"
import Footer from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <Services />
        <FeaturedProducts />
        <WhyChooseUs />
        <Testimonials />
        <BlogSection />
        <Newsletter />
      </main>
      <Footer />
    </div>
  )
}
