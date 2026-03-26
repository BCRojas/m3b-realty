import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import FeaturedProperties from "@/components/FeaturedProperties";
import MarketingTeam from "@/components/MarketingTeam";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans flex flex-col">
      <Nav />
      <main className="flex-1">
        <Hero />
        <About />
        <FeaturedProperties />
        <MarketingTeam />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
