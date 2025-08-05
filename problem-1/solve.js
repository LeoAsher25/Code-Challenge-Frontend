/**
 * sum_to_n_a - Using math formula (Gauss formula)
 * Time Complexity: O(1)
 * Space Complexity: O(1)
 * This is the most efficient solution. It computes the result in constant time.
 */
var sum_to_n_a = function (n) {
  return (n * (n + 1)) / 2;
};

/**
 * sum_to_n_b - Using a traditional for-loop
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 * Still efficient for most values of n. Easy to understand and avoids unnecessary memory usage.
 */
var sum_to_n_b = function (n) {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
};

/**
 * sum_to_n_d - Using recursion
 * Time Complexity: O(n)
 * Space Complexity: O(n) due to call stack
 * Elegant but risky. Causes stack overflow with large n (>10,000). Not recommended in production.
 */
var sum_to_n_d = function (n) {
  if (n <= 1) return n;
  return n + sum_to_n_d(n - 1);
};

// #########################################################
// # Additional solutions
// #########################################################

/**
 * sum_to_n_c - Using Array.from and reduce()
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 * Functional approach, concise, but it creates an array in memory, so it's less optimal for very large n.
 */
var sum_to_n_c = function (n) {
  return Array.from({ length: n }, (_, i) => i + 1).reduce(
    (acc, curr) => acc + curr,
    0
  );
};
