import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faCheck } from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";

export default function CrmSelect({
  value,
  onChange,
  options = [],
  placeholder = "Select option...",
  className = "",
  size = "md",
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Normalize options into { value, label } format
  const normalizedOptions = options.map((opt) => {
    if (typeof opt === "object" && opt !== null) {
      return { value: opt.value, label: opt.label !== undefined ? opt.label : opt.value };
    }
    return { value: opt, label: String(opt) };
  });

  const selectedOption = normalizedOptions.find((opt) => String(opt.value) === String(value));

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (val) => {
    if (onChange) {
      onChange(val);
    }
    setIsOpen(false);
  };

  const isSmall = size === "sm";

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full bg-[#f8fafc] border border-gray-200/90 rounded-xl text-left transition-all flex items-center justify-between gap-2 cursor-pointer focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#032e92]/20 focus:border-[#032e92] ${
          isOpen ? "bg-white border-[#032e92] ring-2 ring-[#032e92]/20 shadow-xs" : "hover:border-gray-300"
        } ${isSmall ? "px-3 py-1.5 text-xs font-semibold text-gray-700" : "px-3.5 py-2.5 text-xs text-gray-900"} ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <span className={`truncate font-medium ${selectedOption ? "text-gray-900" : "text-gray-400"}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <FontAwesomeIcon
          icon={faChevronDown}
          className={`text-[10px] text-gray-400 transition-transform duration-200 shrink-0 ${
            isOpen ? "rotate-180 text-[#032e92]" : ""
          }`}
        />
      </button>

      {/* Floating Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 mt-1.5 bg-white rounded-2xl shadow-xl shadow-slate-300/40 border border-gray-100 p-1.5 z-50 max-h-60 overflow-y-auto"
            style={{ minWidth: "100%" }}
          >
            {normalizedOptions.length === 0 ? (
              <div className="px-3 py-2 text-xs text-gray-400 text-center">No options available</div>
            ) : (
              normalizedOptions.map((opt) => {
                const isSelected = String(opt.value) === String(value);
                return (
                  <button
                    key={String(opt.value)}
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    className={`w-full px-3 py-2 rounded-xl text-xs font-medium text-left flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-[#032e92]/10 text-[#032e92] font-bold"
                        : "text-gray-700 hover:bg-blue-50/80 hover:text-[#032e92]"
                    }`}
                  >
                    <span className="truncate">{opt.label}</span>
                    {isSelected && (
                      <FontAwesomeIcon icon={faCheck} className="text-[#032e92] text-xs shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
