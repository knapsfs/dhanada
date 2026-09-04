import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Services from './pages/Services';
import Blogs from './pages/Blogs';
import BlogDetails from './pages/BlogDetails';
import ContactUs from './pages/ContactUs';

// Calculator Pages
import SipCalculator from './pages/SipCalculator';
import StepUpSipCalculator from './pages/StepUpSipCalculator';
import SwpCalculator from './pages/SwpCalculator';
import LumpsumCalculator from './pages/LumpsumCalculator';
import RetirementCalculator from './pages/RetirementCalculator';
import FutureValueCalculatorPage from './pages/FutureValueCalculatorPage';

import './index.css';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/services" element={<Services />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:id" element={<BlogDetails />} />
          <Route path="/contact" element={<ContactUs />} />

          {/* Calculator Routes */}
          <Route path="/calculators/sip" element={<SipCalculator />} />
          <Route path="/calculators/step-up-sip" element={<StepUpSipCalculator />} />
          <Route path="/calculators/swp" element={<SwpCalculator />} />
          <Route path="/calculators/lumpsum" element={<LumpsumCalculator />} />
          <Route path="/calculators/retirement" element={<RetirementCalculator />} />
          <Route path="/calculators/future-value" element={<FutureValueCalculatorPage />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;