export interface Token {
  currency: string;
  date: string;
  price: number;
}

export interface TokenOption {
  symbol: string;
  price: number;
  icon: string;
}

export interface SwapFormData {
  fromToken: TokenOption | null;
  toToken: TokenOption | null;
  fromAmount: string;
  toAmount: string;
}

export interface ValidationErrors {
  fromAmount?: string;
  toAmount?: string;
  tokenSelection?: string;
}
