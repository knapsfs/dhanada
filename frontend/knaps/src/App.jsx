import MysteryBoxWidget from './components/MysteryBox/MysteryBoxWidget';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Services from './pages/Services';
import Blogs from './pages/Blogs';
import BlogDetails from './pages/BlogDetails';
import AuthorPage from './pages/AuthorPage';
import ContactUs from './pages/ContactUs';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';

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
import SipLumpsumCalculator from './pages/SipLumpsumCalculator';
import LifeInsurance from './pages/LifeInsurance';
import GeneralInsurance from './pages/GeneralInsurance';
import HealthInsurance from './pages/HealthInsurance';
import ELSS from './pages/ELSS';
import FixedDeposit from './pages/FixedDeposit';
import RecurringDeposits from './pages/RecurringDeposits';
import NationalPensionSystem from './pages/NationalPensionSystem';
import SmallSavingsSchemes from './pages/SmallSavingsSchemes';

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
            
            {/* Official Frappe Blog Post Detail Routes (2 segments: /blog/:category/:slug or /blogs/:category/:slug) */}
            <Route path="/blog/:category/:slug" element={<BlogDetails />} />
            <Route path="/blogs/:category/:slug" element={<BlogDetails />} />

            {/* Official Frappe Blog Listing & Category Filtering Routes (1 segment: /blogs/:category or /blog/:category) */}
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blog" element={<Blogs />} />
            <Route path="/blogs/:category" element={<Blogs />} />
            <Route path="/blog/:category" element={<Blogs />} />
            <Route path="/blogs/category/:category" element={<Blogs />} />
            
            {/* Fallback redirects for legacy URLs to official Frappe route */}
            <Route path="/sif-vs-mutual-funds" element={<Navigate to="/blog/mutual-funds/what’s-the-difference-between-sif-and-mutual-funds" replace />} />

            {/* Author Routes */}
            <Route path="/author" element={<AuthorPage />} />
            <Route path="/author/:slug" element={<AuthorPage />} />
            <Route path="/blogs/author/:slug" element={<AuthorPage />} />

            <Route path="/contact" element={<ContactUs />} />
            <Route path="/contact-us" element={<ContactUs />} />

            {/* Legal & Compliance Routes */}
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/privacy" element={<Navigate to="/privacy-policy" replace />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
            <Route path="/terms" element={<Navigate to="/terms-and-conditions" replace />} />

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
            <Route path="/calculators/sip-lumpsum" element={<SipLumpsumCalculator />} />
            {/* Insurance Routes */}
            <Route path="/life-insurance" element={<LifeInsurance />} />
            <Route path="/services/life-insurance" element={<LifeInsurance />} />
            <Route path="/general-insurance" element={<GeneralInsurance />} />
            <Route path="/services/general-insurance" element={<GeneralInsurance />} />
            <Route path="/health-insurance" element={<HealthInsurance />} />
            <Route path="/services/health-insurance" element={<HealthInsurance />} />
            {/* ELSS Routes */}
            <Route path="/elss" element={<ELSS />} />
            <Route path="/services/elss" element={<ELSS />} />
            {/* Fixed Deposit Routes */}
            <Route path="/fixed-deposits" element={<FixedDeposit />} />
            <Route path="/services/fixed-deposits" element={<FixedDeposit />} />
            {/* Recurring Deposit Routes */}
            <Route path="/recurring-deposits" element={<RecurringDeposits />} />
            <Route path="/services/recurring-deposits" element={<RecurringDeposits />} />
            {/* National Pension System Routes */}
            <Route path="/services/nps" element={<NationalPensionSystem />} />
            <Route path="/nps" element={<NationalPensionSystem />} />
            <Route path="/services/national-pension-system" element={<NationalPensionSystem />} />
            <Route path="/national-pension-system" element={<NationalPensionSystem />} />
            {/* Small Savings Schemes Routes */}
            <Route path="/small-savings-schemes" element={<SmallSavingsSchemes />} />
            <Route path="/services/small-savings-schemes" element={<SmallSavingsSchemes />} />
            <Route path="/small-savings" element={<SmallSavingsSchemes />} />
            <Route path="/services/small-savings" element={<SmallSavingsSchemes />} />
          </Routes>
          <MysteryBoxWidget />
          <ChatbotWidget />
        </LeadModalProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
