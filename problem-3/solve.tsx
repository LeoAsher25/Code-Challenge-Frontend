interface WalletBalance {
  currency: string;
  amount: number;
  // blockchain field is missing but used later in getPriority()
  // should add: blockchain: string;
  blockchain: string;
}

// should be extended from WalletBalance for better reuse
// interface FormattedWalletBalance extends WalletBalance {
//   formatted: string;
// }
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

interface Props extends BoxProps {
  // BoxProps origin is unknown, make sure it's necessary
}

const WalletPage: React.FC<Props> = (props: Props) => {
  // Prefer destructuring props directly in the function parameter for clarity.
  // const WalletPage: React.FC<Props> = ({ children, ...rest }: Props) => {
  const { children, ...rest } = props;

  const balances = useWalletBalances();
  const prices = usePrices();

  // getPriority() should be moved outside component to prevent redefining on each render
  // also: blockchain should be typed as string, not any
  const getPriority = (blockchain: any): number => {
    switch (blockchain) {
      case "Osmosis":
        return 100;
      case "Ethereum":
        return 50;
      case "Arbitrum":
        return 30;
      case "Zilliqa":
        return 20;
      case "Neo":
        return 20; // merged 2 cases above for better readability
      default:
        return -99;
    }
  };

  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        // lhsPriority is a bug — should be balancePriority
        const balancePriority = getPriority(balance.blockchain);
        // logic is convoluted and incorrect — amount <= 0 returns true?
        // correct version: return balance.amount > 0 && balancePriority > -99;
        if (lhsPriority > -99) {
          if (balance.amount <= 0) {
            return true;
          }
        }
        return false;
        //  can return the condition directly:
        // return balance.amount > 0 && getPriority(balance.blockchain) > -99;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        if (leftPriority > rightPriority) {
          return -1;
        } else if (rightPriority > leftPriority) {
          return 1;
        }
        // this sort logic is verbose, can be simplified to:
        // .sort((a, b) => getPriority(b.blockchain) - getPriority(a.blockchain));
      });
    // prices not used in this memo, should be removed from dependency array
  }, [balances, prices]);

  // formattedBalances should be memoized with useMemo to avoid recalculating on every render
  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed(),
    };
  });

  // should use formattedBalances instead of sortedBalances
  const rows = sortedBalances.map(
    (balance: FormattedWalletBalance, index: number) => {
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow
          // className should be defined or imported; "classes.row" is likely undefined
          className={classes.row}
          // using index as key is an anti-pattern — may cause re-render issues if order changes
          // should use unique key like `${balance.currency}-${balance.blockchain}`
          key={index}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    }
  );

  // rows should be rendered directly via .map() inside return block
  // or memoized if complex, to avoid unnecessary computation
  return <div {...rest}>{rows}</div>;
};
