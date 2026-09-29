import { createContext, useContext, useState } from 'react';
import LeadCaptureModal from '../components/LeadCaptureModal';

const defaultLeadModalContext = {
  isOpen: false,
  openLeadModal: () => {},
  closeLeadModal: () => {},
  leadSource: '',
};

export const LeadModalContext = createContext(defaultLeadModalContext);

export const useLeadModal = () => {
  const context = useContext(LeadModalContext);
  return context || defaultLeadModalContext;
};

export function LeadModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [leadSource, setLeadSource] = useState('');

  const openLeadModal = (source = '') => {
    setLeadSource(typeof source === 'string' ? source : '');
    setIsOpen(true);
  };

  const closeLeadModal = () => {
    setIsOpen(false);
    setLeadSource('');
  };

  return (
    <LeadModalContext.Provider value={{ isOpen, openLeadModal, closeLeadModal, leadSource }}>
      {children}
      <LeadCaptureModal isOpen={isOpen} onClose={closeLeadModal} />
    </LeadModalContext.Provider>
  );
}
