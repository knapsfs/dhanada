import MysteryBoxWidget from './components/MysteryBox/MysteryBoxWidget';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Services from './pages/Services';
import Blogs from './pages/Blogs';
import BlogDetails from './pages/BlogDetails';
import ContactUs from './pages/ContactUs';

// SIF Pages
import SifHome from './pages/sif/SifHome';
import SifFundDetails from './pages/sif/SifFundDetails';

// Calculator Pages
import SipCalculator from './pages/SipCalculator';
import StepUpSipCalculator from './pages/StepUpSipCalculator';
import SwpCalculator from './pages/SwpCalculator';
import LumpsumCalculator from './pages/LumpsumCalculator';
import RetirementCalculator from './pages/RetirementCalculator';
import FutureValueCalculatorPage from './pages/FutureValueCalculatorPage';

// Global Infrastructure Components
import ScrollToTop from './components/ScrollToTop';
import ChatbotWidget from './chatbot/components/ChatbotWidget';
import { LeadModalProvider } from './context/LeadModalContext';

import './index.css';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ScrollToTop />
        <LeadModalProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/services" element={<Services />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blogs/:id" element={<BlogDetails />} />
            <Route path="/contact" element={<ContactUs />} />

            {/* SIF Routes */}
            <Route path="/sif" element={<SifHome />} />
            <Route path="/sif/:fundCode" element={<SifFundDetails />} />

            {/* Calculator Routes */}
            <Route path="/calculators/sip" element={<SipCalculator />} />
            <Route path="/calculators/step-up-sip" element={<StepUpSipCalculator />} />
            <Route path="/calculators/swp" element={<SwpCalculator />} />
            <Route path="/calculators/lumpsum" element={<LumpsumCalculator />} />
            <Route path="/calculators/retirement" element={<RetirementCalculator />} />
            <Route path="/calculators/future-value" element={<FutureValueCalculatorPage />} />
          </Routes>
          <MysteryBoxWidget />
          <ChatbotWidget />
        </LeadModalProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;