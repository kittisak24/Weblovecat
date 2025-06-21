import ContactPage from "@/components/contact-page"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function Contact() {
  return (
      <div className="min-h-screen bg-white">
        <Header />
        <main>
          <ContactPage />
        </main>
        <Footer />
      </div>
    )
}
