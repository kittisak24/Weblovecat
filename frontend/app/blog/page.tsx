import BlogPage from "@/components/blog-page"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function Blog() {
  return (
      <div className="min-h-screen bg-white">
        <Header />
        <main>
          <BlogPage />
        </main>
        <Footer />
      </div>
    )
}
