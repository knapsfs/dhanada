import MysteryBoxWidget from './components/MysteryBox/MysteryBoxWidget';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Products from './pages/Products';
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
import FixedIncomeProducts from './pages/FixedIncomeProducts';
import NationalPensionSystem from './pages/NationalPensionSystem';
import SmallSavingsSchemes from './pages/SmallSavingsSchemes';
import MutualFunds from './pages/MutualFunds';

// CRM Portal
import KnapsCrmPortal from './pages/KnapsCrmPortal';

// Customer-Facing Form Workflows
import RiskProfilerWorkflowPage from './pages/forms/RiskProfilerWorkflowPage';
import ClientOnboardingWorkflowPage from './pages/forms/ClientOnboardingWorkflowPage';
import CombinedOnboardingWorkflowPage from './pages/forms/CombinedOnboardingWorkflowPage';

// Global Infrastructure Components
import ScrollToTop from './components/ScrollToTop';
import ChatbotWidget from './chatbot/components/ChatbotWidget';
import { LeadModalProvider } from './context/LeadModalContext';

import './index.css';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const isExcludedRoute = typeof window !== 'undefined' && (
    window.location.pathname.startsWith('/knaps-crm') ||
    window.location.pathname.startsWith('/crm') ||
    window.location.pathname.startsWith('/forms')
  );

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ScrollToTop />
        <LeadModalProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/products" element={<Products />} />
            <Route path="/services" element={<Navigate to="/products" replace />} />

            {/* Official Frappe Blog Post Detail Routes */}
            <Route path="/blog/:category/:slug" element={<BlogDetails />} />
            <Route path="/blogs/:category/:slug" element={<BlogDetails />} />

            {/* Official Frappe Blog Listing & Category Filtering Routes */}
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
            <Route path="/products/life-insurance" element={<LifeInsurance />} />
            <Route path="/services/life-insurance" element={<Navigate to="/products/life-insurance" replace />} />
            <Route path="/general-insurance" element={<GeneralInsurance />} />
            <Route path="/products/general-insurance" element={<GeneralInsurance />} />
            <Route path="/services/general-insurance" element={<Navigate to="/products/general-insurance" replace />} />
            <Route path="/health-insurance" element={<HealthInsurance />} />
            <Route path="/products/health-insurance" element={<HealthInsurance />} />
            <Route path="/services/health-insurance" element={<Navigate to="/products/health-insurance" replace />} />

            {/* Fixed Income Products (FDs & GoI Bonds) Routes */}
            <Route path="/fixed-income-products" element={<FixedIncomeProducts />} />
            <Route path="/products/fixed-income-products" element={<FixedIncomeProducts />} />
            <Route path="/services/fixed-income-products" element={<Navigate to="/products/fixed-income-products" replace />} />
            <Route path="/fixed-deposits" element={<Navigate to="/products/fixed-income-products" replace />} />
            <Route path="/services/fixed-deposits" element={<Navigate to="/products/fixed-income-products" replace />} />
            <Route path="/fixed-income" element={<Navigate to="/products/fixed-income-products" replace />} />
            <Route path="/services/fixed-income" element={<Navigate to="/products/fixed-income-products" replace />} />

            {/* National Pension System Routes */}
            <Route path="/nps" element={<NationalPensionSystem />} />
            <Route path="/national-pension-system" element={<NationalPensionSystem />} />
            <Route path="/products/nps" element={<NationalPensionSystem />} />
            <Route path="/products/national-pension-system" element={<NationalPensionSystem />} />
            <Route path="/services/nps" element={<Navigate to="/products/nps" replace />} />
            <Route path="/services/national-pension-system" element={<Navigate to="/products/national-pension-system" replace />} />

            {/* Mutual Funds Routes */}
            <Route path="/mutual-funds" element={<MutualFunds />} />
            <Route path="/funds" element={<MutualFunds />} />
            <Route path="/mutual-fund" element={<MutualFunds />} />
            <Route path="/products/mutual-funds" element={<MutualFunds />} />
            <Route path="/services/mutual-funds" element={<Navigate to="/products/mutual-funds" replace />} />

            {/* Post Office Small Savings Schemes Routes */}
            <Route path="/post-office-small-savings-schemes" element={<SmallSavingsSchemes />} />
            <Route path="/products/post-office-small-savings-schemes" element={<SmallSavingsSchemes />} />
            <Route path="/services/post-office-small-savings-schemes" element={<Navigate to="/products/post-office-small-savings-schemes" replace />} />
            <Route path="/small-savings-schemes" element={<Navigate to="/products/post-office-small-savings-schemes" replace />} />
            <Route path="/services/small-savings-schemes" element={<Navigate to="/products/post-office-small-savings-schemes" replace />} />
            <Route path="/small-savings" element={<Navigate to="/products/post-office-small-savings-schemes" replace />} />
            <Route path="/services/small-savings" element={<Navigate to="/products/post-office-small-savings-schemes" replace />} />

            {/* Modern KNAPS CRM Portal Routes */}
            <Route path="/knaps-crm" element={<KnapsCrmPortal />} />
            <Route path="/knaps-crm/*" element={<KnapsCrmPortal />} />
            <Route path="/crm" element={<KnapsCrmPortal />} />
            <Route path="/crm/*" element={<KnapsCrmPortal />} />

            {/* Dedicated Customer Form Workflow Routes */}
            <Route path="/forms/risk-profiler/:token" element={<RiskProfilerWorkflowPage />} />
            <Route path="/forms/client-onboarding/:token" element={<ClientOnboardingWorkflowPage />} />
            <Route path="/forms/combined-onboarding/:token" element={<CombinedOnboardingWorkflowPage />} />
          </Routes>

          {!isExcludedRoute && <MysteryBoxWidget />}
          {!isExcludedRoute && <ChatbotWidget />}
        </LeadModalProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
