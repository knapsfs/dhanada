import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AboutHero from '../components/about/AboutHero';
import AboutStory from '../components/about/AboutStory';
import AboutTimeline from '../components/about/AboutTimeline';
import AboutWhyTrust from '../components/about/AboutWhyTrust';
import AboutLeadership from '../components/about/AboutLeadership';
import Stats from '../components/Stats';
import CTA from '../components/CTA';

export default function AboutUs() {
  return (
    <div className="font-sans text-gray-900 bg-white min-h-screen">
      <Navbar />

      <main>
        <AboutHero />
        <AboutStory />
        <AboutTimeline />
        <AboutWhyTrust />
        <Stats className="pt-8 pb-16 sm:pt-10 sm:pb-20" />
        <CTA />
      </main>

      <Footer />
    </div>
  );
}
