"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { usePrices } from "@/hooks/usePrices";
import TokenSelect from "./TokenSelect";
import { TokenOption, SwapFormData, ValidationErrors } from "@/types";

export default function SwapForm() {
  const { data: tokens, isLoading, error } = usePrices();

  const [formData, setFormData] = useState<SwapFormData>({
    fromToken: null,
    toToken: null,
    fromAmount: "",
    toAmount: "",
  });

  // Track which input is being edited to prevent calculation conflicts
  const [editingInput, setEditingInput] = useState<"from" | "to" | null>(null);

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSwapButtonHovered, setIsSwapButtonHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Set default tokens when data loads
  useEffect(() => {
    if (tokens && tokens.length > 0) {
      const defaultFrom = tokens.find((t) => t.symbol === "SWTH") || tokens[0];
      const defaultTo =
        tokens.find((t) => t.symbol === "ETH") || tokens[1] || tokens[0];

      setFormData((prev) => ({
        ...prev,
        fromToken: defaultFrom,
        toToken: defaultTo,
      }));
    }
  }, [tokens]);

  // Calculate exchange rate and update amounts when inputs change
  useEffect(() => {
    if (formData.fromToken && formData.toToken) {
      const fromAmount = parseFloat(formData.fromAmount);
      const toAmount = parseFloat(formData.toAmount);

      // Only calculate if we have valid numbers and not currently editing the target field
      if (
        formData.fromAmount &&
        !isNaN(fromAmount) &&
        fromAmount > 0 &&
        editingInput !== "to"
      ) {
        const calculatedToAmount =
          fromAmount * (formData.fromToken.price / formData.toToken.price);
        // Format with 8 decimal places and remove trailing zeros
        const formattedAmount = parseFloat(
          calculatedToAmount.toFixed(8)
        ).toString();
        setFormData((prev) => ({
          ...prev,
          toAmount: formattedAmount,
        }));
      }
      // If toAmount is entered, calculate fromAmount
      else if (
        formData.toAmount &&
        !isNaN(toAmount) &&
        toAmount > 0 &&
        editingInput !== "from"
      ) {
        const calculatedFromAmount =
          toAmount * (formData.toToken.price / formData.fromToken.price);
        // Format with 8 decimal places and remove trailing zeros
        const formattedAmount = parseFloat(
          calculatedFromAmount.toFixed(8)
        ).toString();
        setFormData((prev) => ({
          ...prev,
          fromAmount: formattedAmount,
        }));
      }
      // If fromAmount is empty, clear toAmount
      else if (
        !formData.fromAmount &&
        formData.toAmount &&
        editingInput !== "to"
      ) {
        setFormData((prev) => ({ ...prev, toAmount: "" }));
      }
      // If toAmount is empty, clear fromAmount
      else if (
        !formData.toAmount &&
        formData.fromAmount &&
        editingInput !== "from"
      ) {
        setFormData((prev) => ({ ...prev, fromAmount: "" }));
      }
    } else {
      setFormData((prev) => ({ ...prev, toAmount: "" }));
    }
  }, [
    formData.fromToken,
    formData.toToken,
    formData.fromAmount,
    formData.toAmount,
    editingInput,
  ]);

  // Validate form inputs
  useEffect(() => {
    const newErrors: ValidationErrors = {};

    // Validate fromAmount
    if (formData.fromAmount) {
      const amount = parseFloat(formData.fromAmount);
      if (isNaN(amount)) {
        newErrors.fromAmount = "Please enter a valid number";
      } else if (amount <= 0) {
        newErrors.fromAmount = "Amount must be greater than 0";
      }
    }

    // Validate toAmount
    if (formData.toAmount) {
      const amount = parseFloat(formData.toAmount);
      if (isNaN(amount)) {
        newErrors.toAmount = "Please enter a valid number";
      } else if (amount <= 0) {
        newErrors.toAmount = "Amount must be greater than 0";
      }
    }

    // Validate token selection
    if (
      formData.fromToken &&
      formData.toToken &&
      formData.fromToken.symbol === formData.toToken.symbol
    ) {
      newErrors.tokenSelection = "Cannot swap the same token";
    }

    setErrors(newErrors);
  }, [formData]);

  const handleFromAmountChange = (value: string) => {
    // Allow numbers, decimal point, and handle multiple decimal points
    let sanitizedValue = value.replace(/[^0-9.]/g, "");
    // Ensure only one decimal point
    const parts = sanitizedValue.split(".");
    if (parts.length > 2) {
      sanitizedValue = parts[0] + "." + parts.slice(1).join("");
    }
    setFormData((prev) => ({ ...prev, fromAmount: sanitizedValue }));
  };

  const handleSwapDirection = () => {
    if (formData.fromToken && formData.toToken) {
      setFormData((prev) => ({
        ...prev,
        fromToken: prev.toToken,
        toToken: prev.fromToken,
        fromAmount: prev.toAmount,
        toAmount: prev.fromAmount,
      }));
    }
  };

  const handleSwap = () => {
    if (Object.keys(errors).length > 0) {
      toast.error("Please fix the errors before swapping");
      return;
    }

    if (
      !formData.fromToken ||
      !formData.toToken ||
      (!formData.fromAmount && !formData.toAmount)
    ) {
      toast.error("Please fill in at least one amount");
      return;
    }

    const fromAmount = formData.fromAmount || "0";
    const toAmount = formData.toAmount || "0";

    toast.success(
      `Swapped ${fromAmount} ${formData.fromToken.symbol} for ${toAmount} ${formData.toToken.symbol}`
    );
  };

  const isFormValid =
    formData.fromToken &&
    formData.toToken &&
    (formData.fromAmount || formData.toAmount) &&
    Object.keys(errors).length === 0;

  const getSwapButtonText = () => {
    if (!formData.fromAmount && !formData.toAmount) return "Enter an amount";
    if (errors.fromAmount || errors.toAmount) {
      if (
        errors.fromAmount?.includes("Insufficient") ||
        errors.toAmount?.includes("Insufficient")
      ) {
        return "Insufficient balance";
      }
      return "Invalid amount";
    }
    if (!isFormValid) return "Enter a valid amount to proceed";
    return "Swap";
  };

  const getSwapButtonTooltip = () => {
    if (!formData.fromAmount && !formData.toAmount)
      return "Enter a valid amount to proceed";
    if (errors.fromAmount || errors.toAmount) {
      if (
        errors.fromAmount?.includes("Insufficient") ||
        errors.toAmount?.includes("Insufficient")
      ) {
        return "Insufficient balance";
      }
      return "Please enter a valid amount";
    }
    return "Connect your wallet to proceed with the swap";
  };

  if (isLoading) {
    return (
      <div className="card animate-pulse">
        <div className="space-y-6">
          <div className="h-4 bg-gray-700 rounded"></div>
          <div className="h-16 bg-gray-700 rounded-xl"></div>
          <div className="h-4 bg-gray-700 rounded"></div>
          <div className="h-16 bg-gray-700 rounded-xl"></div>
          <div className="h-12 bg-gray-700 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="text-center text-red-400">
          <p>Failed to load token prices</p>
          <p className="text-sm text-gray-400 mt-2">Please try again later</p>
        </div>
      </div>
    );
  }

  if (!tokens || tokens.length === 0) {
    return (
      <div className="card">
        <div className="text-center text-gray-400">
          <p>No tokens available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <form onSubmit={(e) => e.preventDefault()} className="space-y-6 pb-4">
        {/* From Token Section */}
        <div className="token-card mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-300">FROM</span>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="flex-1">
              <input
                type="text"
                value={formData.fromAmount}
                onChange={(e) => handleFromAmountChange(e.target.value)}
                onFocus={() => setEditingInput("from")}
                onBlur={() => setEditingInput(null)}
                placeholder="0.0"
                className={`amount-input text-lg sm:text-2xl ${
                  errors.fromAmount ? "error" : ""
                }`}
              />
              {formData.fromToken &&
                formData.fromAmount &&
                !errors.fromAmount && (
                  <div className="text-sm text-gray-400 mt-1">
                    ≈ $
                    {parseFloat(
                      (
                        (parseFloat(formData.fromAmount) || 0) *
                        formData.fromToken.price
                      ).toFixed(8)
                    ).toFixed(2)}
                  </div>
                )}
            </div>

            <div className="flex-shrink-0 min-w-[200px]">
              <TokenSelect
                label=""
                value={formData.fromToken}
                onChange={(token) =>
                  setFormData((prev) => ({ ...prev, fromToken: token }))
                }
                options={tokens}
                placeholder="Select token"
              />
            </div>
          </div>

          {errors.fromAmount && (
            <div className="mt-2 p-3 bg-red-900/20 border border-red-500/30 rounded-lg animate-in fade-in-0 duration-200">
              <p className="text-sm text-red-400 flex items-center">
                <svg
                  className="w-4 h-4 mr-2 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {errors.fromAmount}
              </p>
            </div>
          )}
        </div>

        {/* Swap Direction Button */}
        <div className="flex justify-center relative">
          <button
            type="button"
            onClick={handleSwapDirection}
            onMouseEnter={() => setIsSwapButtonHovered(true)}
            onMouseLeave={() => setIsSwapButtonHovered(false)}
            disabled={!formData.fromToken || !formData.toToken}
            className="swap-button disabled:opacity-50 disabled:cursor-not-allowed group"
            title="Swap direction">
            <svg
              className={`w-5 h-5 text-white transition-all duration-300`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
              />
            </svg>
          </button>

          {/* Tooltip */}
          {isSwapButtonHovered && (
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10 shadow-lg">
              Swap direction
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900"></div>
            </div>
          )}
        </div>

        {/* To Token Section */}
        <div className="token-card mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-300">TO</span>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="flex-1">
              <input
                type="text"
                value={formData.toAmount}
                onChange={(e) => {
                  // Allow numbers, decimal point, and handle multiple decimal points
                  let value = e.target.value;
                  // Remove any character that's not a number or decimal point
                  value = value.replace(/[^0-9.]/g, "");
                  // Ensure only one decimal point
                  const parts = value.split(".");
                  if (parts.length > 2) {
                    value = parts[0] + "." + parts.slice(1).join("");
                  }

                  setFormData((prev) => ({
                    ...prev,
                    toAmount: value,
                  }));
                }}
                onFocus={() => setEditingInput("to")}
                onBlur={() => setEditingInput(null)}
                placeholder="0.0"
                className="amount-input text-lg sm:text-2xl"
              />
              {/* {formData.toToken && formData.toAmount && (
                <div className="text-sm text-gray-400 mt-1">
                  ≈ $
                  {parseFloat(
                    (
                      (parseFloat(formData.toAmount) || 0) *
                      formData.toToken.price
                    ).toFixed(8)
                  ).toFixed(2)}
                </div>
              )} */}
            </div>

            <div className="flex-shrink-0 min-w-[200px]">
              <TokenSelect
                label=""
                value={formData.toToken}
                onChange={(token) =>
                  setFormData((prev) => ({ ...prev, toToken: token }))
                }
                options={tokens}
                placeholder="Select token"
              />
            </div>
          </div>

          {errors.toAmount && (
            <div className="mt-2 p-3 bg-red-900/20 border border-red-500/30 rounded-lg animate-in fade-in-0 duration-200">
              <p className="text-sm text-red-400 flex items-center">
                <svg
                  className="w-4 h-4 mr-2 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {errors.toAmount}
              </p>
            </div>
          )}
        </div>

        {/* Exchange Rate Display */}
        {formData.fromToken && formData.toToken && (
          <div className="price-card animate-in fade-in-0 duration-300">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Exchange Rate:</span>
              <span className="font-medium text-green-400">
                1 {formData.fromToken.symbol} ={" "}
                {parseFloat(
                  (formData.fromToken.price / formData.toToken.price).toFixed(8)
                )}{" "}
                {formData.toToken.symbol}
              </span>
            </div>
            {formData.toAmount && (
              <div className="flex justify-between items-center text-sm mt-2">
                <span className="text-gray-400">You will receive:</span>
                <span className="font-medium text-green-400">
                  {formData.toAmount} {formData.toToken.symbol}
                </span>
              </div>
            )}
            {formData.fromAmount && (
              <div className="flex justify-between items-center text-sm mt-2">
                <span className="text-gray-400">You will pay:</span>
                <span className="font-medium text-red-400">
                  {formData.fromAmount} {formData.fromToken.symbol}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Error Display */}
        {errors.tokenSelection && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
            <p className="text-sm text-red-400">{errors.tokenSelection}</p>
          </div>
        )}

        {/* Swap Button */}
        <div className="relative">
          <button
            type="button"
            onClick={handleSwap}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            disabled={!isFormValid}
            className={`w-full relative transition-all duration-200 ${
              isFormValid
                ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium py-3 px-6 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 shadow-lg hover:shadow-xl transform hover:scale-[1.01]"
                : "bg-gray-700 text-gray-500 font-medium py-3 px-6 rounded-xl cursor-not-allowed border border-gray-600"
            }`}>
            {getSwapButtonText()}
          </button>

          {/* Tooltip for swap button */}
          {showTooltip && !isFormValid && (
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded whitespace-nowrap z-10 max-w-xs text-center shadow-lg">
              {getSwapButtonTooltip()}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
