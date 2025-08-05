import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Token, TokenOption } from "@/types";

const API_URL = "https://interview.switcheo.com/prices.json";

// Function to generate icon URL with fallbacks
const getTokenIconUrl = (symbol: string): string => {
  // Try different formats for token icons
  const formats = [
    `${symbol}.svg`,
    `${symbol}.png`,
    `${symbol.toLowerCase()}.svg`,
    `${symbol.toLowerCase()}.png`,
  ];

  // Return the first format as default, the component will handle fallback
  return `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${formats[0]}`;
};

export function usePrices() {
  return useQuery({
    queryKey: ["prices"],
    queryFn: async (): Promise<TokenOption[]> => {
      const response = await axios.get<Token[]>(API_URL);

      // Filter out tokens with null/undefined prices and transform to TokenOption
      const validTokens = response.data
        .filter(
          (token): token is Token & { price: number } =>
            token.price !== null && token.price !== undefined
        )
        .map(
          (token): TokenOption => ({
            symbol: token.currency,
            price: token.price,
            icon: getTokenIconUrl(token.currency),
          })
        )
        .sort((a, b) => a.symbol.localeCompare(b.symbol));

      return validTokens;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
}
