import ProductsPage from "@/components/products-page"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function Products() {
  return (
      <div className="min-h-screen bg-white">
        <Header />
        <main>
          <ProductsPage />
        </main>
        <Footer />
      </div>
    )
}
