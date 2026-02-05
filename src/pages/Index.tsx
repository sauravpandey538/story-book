import { Header } from "@/components/layout/Header";
import { HeroSection } from "@/components/layout/HeroSection";
import { OurStorySection } from "@/components/layout/OurStorySection";
import { Footer } from "@/components/layout/Footer";

/**
 * Main landing page: Header → Hero → Our Story (memory book) → Footer.
 * Full website layout in the same warm, book-like theme.
 */
const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <OurStorySection />
      <Footer />
    </div>
  );
};

export default Index;
