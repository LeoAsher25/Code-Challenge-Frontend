# 99Tech Coding Challenges

This repository contains solutions to three different coding challenges, each demonstrating different aspects of software development and problem-solving skills.

## 📋 Overview

### Problem 1: Sum to N Algorithm

A JavaScript implementation showcasing multiple approaches to calculate the sum of numbers from 1 to N.

### Problem 2: Currency Swap UI

A full-stack web application built with Next.js and TypeScript for swapping between different cryptocurrencies.
**🌐 Live Demo**: [Swap Currency](https://code-challenge-frontend.vercel.app/)

### Problem 3: Wallet Balance Component

A React TypeScript component with identified bugs and optimization opportunities.

---

## 🧮 Problem 1: Sum to N Algorithm

**Location**: `problem-1/solve.js`

### Description

Implementation of four different algorithms to calculate the sum of numbers from 1 to N, demonstrating various approaches with different time and space complexities.

### Solutions Implemented

1. **Mathematical Formula (Gauss Formula)** - `sum_to_n_a`

   - Time Complexity: O(1)
   - Space Complexity: O(1)
   - Most efficient solution using the formula: `n * (n + 1) / 2`

2. **Traditional For Loop** - `sum_to_n_b`

   - Time Complexity: O(n)
   - Space Complexity: O(1)
   - Simple and readable implementation

3. **Recursion** - `sum_to_n_d`
   - Time Complexity: O(n)
   - Space Complexity: O(n)
   - Elegant but risky for large values (stack overflow risk)
4. **Array with Reduce** - `sum_to_n_c`

   - Time Complexity: O(n)
   - Space Complexity: O(n)
   - Functional programming approach

### Usage

```javascript
// Example usage
console.log(sum_to_n_a(5)); // Output: 15
console.log(sum_to_n_b(10)); // Output: 55
```

---

## 💱 Problem 2: Currency Swap UI

**Location**: `problem-2/`

**🌐 Live Demo**: [Swap Currency](https://code-challenge-frontend.vercel.app/)

### Description

A professional cryptocurrency swap interface built with modern web technologies. Users can swap between different tokens with real-time exchange rates fetched from external APIs.

### 🚀 Features

- **Real-time Token Loading**: Fetches live token prices from Switcheo API
- **Dynamic Token Selection**: Dropdown menus with token icons and current prices
- **Live Exchange Rate Calculation**: Real-time calculation as users type
- **Form Validation**: Comprehensive validation for amounts and token selection
- **Responsive Design**: Mobile-friendly interface with modern UI
- **Error Handling**: Graceful error handling with user-friendly messages
- **Toast Notifications**: Success and error notifications

### 🛠 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **State Management**: React hooks
- **HTTP Client**: Axios
- **Data Fetching**: React Query (@tanstack/react-query)
- **Notifications**: React Hot Toast

### 📁 Project Structure

```
problem-2/
├── app/
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Main page component
│   └── providers.tsx        # React Query and Toast providers
├── components/
│   ├── SwapForm.tsx         # Main swap form component
│   └── TokenSelect.tsx      # Reusable token dropdown
├── hooks/
│   └── usePrices.ts         # Custom hook for fetching prices
├── types/
│   └── index.ts             # TypeScript definitions
└── [config files]
```

### 🚀 Getting Started

1. **Install dependencies**:

   ```bash
   cd problem-2
   npm install
   ```

2. **Run development server**:

   ```bash
   npm run dev
   ```

3. **Open** [http://localhost:3000](http://localhost:3000)

### 🔌 API Integration

- **Prices API**: `https://interview.switcheo.com/prices.json`
- **Token Icons**: `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/{SYMBOL}.svg`

### 🎯 Key Features

- **Exchange Rate Formula**: `toAmount = fromAmount * (fromTokenPrice / toTokenPrice)`
- **6 Decimal Precision**: Accurate calculations
- **Loading States**: Skeleton animations during data fetching
- **Error Handling**: Graceful fallbacks and user-friendly messages
- **Mobile Responsive**: Optimized for all device sizes

---

## 💼 Problem 3: Wallet Balance Component

**Location**: `problem-3/solve.tsx`

### Description

A React TypeScript component for displaying wallet balances with identified bugs and optimization opportunities. This problem focuses on code review and refactoring skills.

### 🔍 Issues Identified

1. **Missing Interface Field**: `blockchain` field missing from `WalletBalance` interface
2. **Incorrect Variable Reference**: `lhsPriority` should be `balancePriority`
3. **Flawed Filter Logic**: Current logic returns `true` for `amount <= 0`
4. **Missing Memoization**: `formattedBalances` recalculates on every render
5. **Unused Dependencies**: `prices` in `useMemo` dependency array
6. **Anti-pattern Key**: Using array index as React key
7. **Undefined Class**: `classes.row` likely undefined
8. **Verbose Sort Logic**: Can be simplified

### 🛠 Suggested Improvements

- Add missing `blockchain` field to `WalletBalance` interface
- Fix filter logic: `return balance.amount > 0 && getPriority(balance.blockchain) > -99`
- Memoize `formattedBalances` with `useMemo`
- Use unique keys: `${balance.currency}-${balance.blockchain}`
- Simplify sort logic: `getPriority(b.blockchain) - getPriority(a.blockchain)`
- Move `getPriority` function outside component
- Remove unused `prices` from dependency array

### 💡 Learning Objectives

- Code review and bug identification
- Performance optimization with React hooks
- TypeScript interface design
- React best practices
- Algorithm optimization

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Running the Projects

1. **Problem 1** (JavaScript):

   ```bash
   cd problem-1
   node solve.js
   ```

2. **Problem 2** (Next.js):

   ```bash
   cd problem-2
   npm install
   npm run dev
   ```

3. **Problem 3** (React/TypeScript):
   - Review the code in `problem-3/solve.tsx`
   - Identify and fix the issues mentioned above

---

## 📊 Summary

| Problem   | Type               | Technology           | Status                 |
| --------- | ------------------ | -------------------- | ---------------------- |
| Problem 1 | Algorithm          | JavaScript           | ✅ Complete            |
| Problem 2 | Full-stack Web App | Next.js + TypeScript | ✅ Complete + Deployed |
| Problem 3 | Code Review        | React + TypeScript   | 🔍 Review Required     |

---

## 🤝 Contributing

Feel free to submit issues, feature requests, or pull requests to improve any of the solutions.

## 📄 License

This project is open source and available under the MIT License.
