# Currency Swap UI

A professional currency swap interface built with Next.js, TypeScript, and TailwindCSS. This application allows users to swap between different tokens with real-time exchange rates.

## Features

- **Real-time Token Loading**: Fetches token prices from the Switcheo API
- **Dynamic Token Selection**: Dropdown menus with token icons and prices
- **Live Exchange Rate Calculation**: Real-time calculation of exchange rates
- **Form Validation**: Comprehensive validation for amounts and token selection
- **Responsive Design**: Mobile-friendly interface with modern UI
- **Error Handling**: Graceful error handling with user-friendly messages
- **Toast Notifications**: Success and error notifications using react-hot-toast

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **State Management**: React hooks (useState)
- **HTTP Client**: Axios
- **Data Fetching**: React Query (@tanstack/react-query)
- **Notifications**: React Hot Toast

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
problem-2/
├── app/
│   ├── globals.css          # Global styles with TailwindCSS
│   ├── layout.tsx           # Root layout with providers
│   ├── page.tsx             # Main page component
│   └── providers.tsx        # React Query and Toast providers
├── components/
│   ├── SwapForm.tsx         # Main swap form component
│   └── TokenSelect.tsx      # Reusable token dropdown
├── hooks/
│   └── usePrices.ts         # Custom hook for fetching token prices
├── types/
│   └── index.ts             # TypeScript type definitions
├── package.json             # Dependencies and scripts
├── tailwind.config.ts       # TailwindCSS configuration
├── tsconfig.json            # TypeScript configuration
└── next.config.js           # Next.js configuration
```

## API Integration

The application fetches token data from:

- **Prices API**: `https://interview.switcheo.com/prices.json`
- **Token Icons**: `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/{SYMBOL}.svg`

## Features in Detail

### Token Selection

- Dropdown menus with token icons and current prices
- Automatic filtering of tokens with null/undefined prices
- Fallback icons for missing token images

### Exchange Rate Calculation

- Formula: `toAmount = fromAmount * (fromTokenPrice / toTokenPrice)`
- Real-time updates as user types
- 6 decimal precision for accurate calculations

### Validation

- Prevents selecting the same token for both "From" and "To"
- Validates amount input (positive numbers only)
- Disables swap button when form is invalid

### User Experience

- Loading states with skeleton animations
- Error states with helpful messages
- Success notifications for completed swaps
- Responsive design for mobile devices
- Smooth transitions and hover effects

## Deployment

This project is ready for deployment on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

The project includes all necessary configurations for production deployment.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the MIT License.
