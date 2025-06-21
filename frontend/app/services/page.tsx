import ServicesPage from "@/components/services-page"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function Services() {
  return (
      <div className="min-h-screen bg-white">
        <Header />
        <main>
          <ServicesPage />
        </main>
        <Footer />
      </div>
    )
}
