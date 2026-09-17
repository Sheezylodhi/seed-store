
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/home/Footer";
import Hero from "@/components/home/Hero";
import TrustStrip from "@/components/home/TrustStrip";
import Categories from "@/components/home/Categories";
import BestSellers from "@/components/home/BestSellers";
import HowSeedCyclingWorks from "@/components/home/HowSeedCyclingWorks";
import OurStory from "@/components/home/OurStory";
import Benefits from "@/components/home/Benefits";
import Reviews from "@/components/home/Reviews";
import FAQ from "@/components/home/FAQ";
import SocialMedia from "@/components/home/SocialMedia";
import FinalCTA from "@/components/home/FinalCTA";


export default function Home() {
  return (
    <>
      <main>
        <Navbar />

        <Hero />

        <TrustStrip />


        <BestSellers />

        <HowSeedCyclingWorks />

        <OurStory />

        <Benefits />

        <Reviews />

        <FAQ />


        <FinalCTA />

        <Footer />
      </main>

      
    </>
  );
}