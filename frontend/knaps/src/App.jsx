import MysteryBoxWidget from './components/MysteryBox/MysteryBoxWidget';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Services from './pages/Services';
import Blogs from './pages/Blogs';
import BlogDetails from './pages/BlogDetails';
import SifVsMutualFunds from './pages/sif-vs-mutual-funds';
import HowToChooseMutualFundScheme from './pages/how-to-choose-a-mutual-fund-scheme-in-india-2026';
import SevenCommonMistakesMutualFunds from './pages/7-common-mistakes-beginners-make-while-investing-in-mutual-funds';
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
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blogs/how-to-choose-a-mutual-fund-scheme-in-india-2026" element={<HowToChooseMutualFundScheme />} />
            <Route path="/blogs/7-common-mistakes-beginners-make-while-investing-in-mutual-funds" element={<SevenCommonMistakesMutualFunds />} />
            <Route path="/7-common-mistakes-beginners-make-while-investing-in-mutual-funds" element={<SevenCommonMistakesMutualFunds />} />
            <Route path="/how-to-choose-a-mutual-fund-scheme-in-india-2026" element={<HowToChooseMutualFundScheme />} />
            <Route path="/blogs/sif-vs-mutual-funds" element={<SifVsMutualFunds />} />
            <Route path="/sif-vs-mutual-funds" element={<SifVsMutualFunds />} />
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