"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { TokenOption } from "@/types";

interface TokenSelectProps {
  label: string;
  value: TokenOption | null;
  onChange: (token: TokenOption) => void;
  options: TokenOption[];
  disabled?: boolean;
  placeholder?: string;
}

// Helper function to create fallback icon
const createFallbackIcon = (symbol: string): string => {
  const fallbackSvg = `
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" fill="#374151"/>
      <text x="16" y="20" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="12" font-weight="bold">${symbol.slice(
        0,
        3
      )}</text>
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(fallbackSvg)}`;
};

export default function TokenSelect({
  label,
  value,
  onChange,
  options,
  disabled = false,
  placeholder = "Select token",
}: TokenSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (token: TokenOption) => {
    onChange(token);
    setIsOpen(false);
  };

  const handleButtonClick = () => {
    if (disabled) return;

    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const dropdownHeight = Math.min(240, options.length * 60); // Estimate dropdown height

      // Check if dropdown would go below viewport
      const wouldGoBelow = rect.bottom + dropdownHeight > viewportHeight;

      setDropdownPosition({
        top: wouldGoBelow
          ? rect.top + window.scrollY - dropdownHeight - 8
          : rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
    setIsOpen(!isOpen);
  };

  const renderDropdown = () => {
    if (!isOpen) return null;

    return (
      <div
        ref={dropdownRef}
        className="fixed bg-gray-800 border border-gray-600 rounded-lg py-1 shadow-2xl z-[9999] animate-in fade-in-0 zoom-in-95 duration-200"
        style={{
          top: dropdownPosition.top,
          left: dropdownPosition.left,
          width: dropdownPosition.width,
        }}>
        <div className="max-h-60 overflow-auto custom-scrollbar overflow-x-hidden">
          {options.map((token, index) => (
            <button
              key={token.symbol + index}
              type="button"
              onClick={() => handleSelect(token)}
              className="w-full px-4 py-2 text-left hover:bg-gray-600 focus:bg-gray-600 focus:outline-none transition-all duration-150 border-b border-gray-600 last:border-b-0 group">
              <div className="flex items-center justify-between space-x-3">
                <div className="flex items-center space-x-3">
                  <div className="relative w-8 h-8">
                    <Image
                      src={token.icon}
                      alt={token.symbol}
                      fill
                      className="rounded-full group-hover:scale-110 transition-transform duration-200"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = createFallbackIcon(token.symbol);
                      }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="font-bold text-white group-hover:text-green-400 transition-colors duration-200 truncate block">
                      {token.symbol}
                    </span>
                    <div className="text-xs text-gray-400 truncate">
                      ${token.price.toFixed(6)}
                    </div>
                    {/* <div className="text-xs text-gray-500 truncate">
                      Balance: 0.00 {token.symbol} ($0.00)
                    </div> */}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="relative">
        {label && (
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {label}
          </label>
        )}

        <button
          ref={buttonRef}
          type="button"
          onClick={handleButtonClick}
          disabled={disabled}
          className={`
            w-full px-4 py-2 text-left bg-gray-800 border border-gray-700 rounded-xl
            focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500
            transition-all duration-200 hover:border-gray-600 hover:bg-gray-750 shadow-sm
            ${
              disabled
                ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                : "hover:border-gray-600 cursor-pointer"
            }
          `}>
          {value ? (
            <div className="flex items-center justify-between space-x-3">
              <div className="flex items-center space-x-3">
                <div className="relative w-8 h-8">
                  <Image
                    src={value.icon}
                    alt={value.symbol}
                    fill
                    className="rounded-full hover:scale-110 transition-transform duration-200"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = createFallbackIcon(value.symbol);
                    }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="font-bold text-white truncate block">
                    {value.symbol}
                  </span>
                  <div className="text-xs text-gray-400 truncate">
                    ${value.price.toFixed(6)}
                  </div>
                  {/* <div className="text-xs text-gray-500 truncate">
                    Balance: 0.00 {value.symbol} ($0.00)
                  </div> */}
                </div>
              </div>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          ) : (
            <div className="flex items-center justify-between space-x-3">
              <span className="text-gray-400">{placeholder}</span>
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          )}
        </button>
      </div>

      {/* Render dropdown using portal */}
      {typeof window !== "undefined" &&
        createPortal(renderDropdown(), document.body)}
    </>
  );
}
