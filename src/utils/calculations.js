import { expenseCategories } from "../data/transactions.js";

export function sumAmounts(transactions) {
  const cents = transactions.reduce(
    (total, transaction) => total + Math.round(transaction.amount * 100),
    0,
  );
  return cents / 100;
}

export function getMonthlyTransactions(transactions, month) {
  return transactions.filter((transaction) =>
    transaction.date.startsWith(`${month}-`),
  );
}

export function calculateTotalExpenses(transactions) {
  return sumAmounts(
    transactions.filter((transaction) => transaction.type === "expense"),
  );
}

export function calculateTotalIncome(transactions) {
  return sumAmounts(
    transactions.filter((transaction) => transaction.type === "income"),
  );
}

export function calculateExpenseSpending(transactions) {
  return sumAmounts(
    transactions.filter((transaction) => transaction.type === "expense"),
  );
}

export function calculateNetBalance(transactions) {
  return (
    Math.round(
      (calculateTotalIncome(transactions) -
        calculateExpenseSpending(transactions)) *
        100,
    ) / 100
  );
}

export function getCategoryBreakdown(transactions) {
  const expenses = transactions.filter(
    (transaction) => transaction.type === "expense",
  );
  const total = sumAmounts(expenses);

  return expenseCategories.map((category) => {
    const amount = sumAmounts(
      expenses.filter((transaction) => transaction.category === category.name),
    );
    return {
      ...category,
      amount,
      percentage: total > 0 ? (amount / total) * 100 : 0,
    };
  });
}

export function getDailySpending(transactions, month) {
  const [year, monthNumber] = month.split("-").map(Number);
  const daysInMonth = new Date(year, monthNumber, 0).getDate();
  const expenses = transactions.filter(
    (transaction) => transaction.type === "expense",
  );

  return Array.from({ length: daysInMonth }, (_, index) => {
    const day = index + 1;
    const date = `${month}-${String(day).padStart(2, "0")}`;
    return {
      day,
      date,
      amount: sumAmounts(
        expenses.filter((transaction) => transaction.date === date),
      ),
    };
  });
}

export function getPreviousMonth(month) {
  const [year, monthNumber] = month.split("-").map(Number);
  return monthNumber === 1
    ? `${year - 1}-12`
    : `${year}-${String(monthNumber - 1).padStart(2, "0")}`;
}

export function getPercentChange(current, previous) {
  return previous > 0 ? ((current - previous) / previous) * 100 : null;
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function formatMonth(month, style = "long") {
  return new Date(`${month}-01T12:00:00`).toLocaleDateString("en-US", {
    month: style,
    year: "numeric",
  });
}

export function formatDate(date) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

export function getLocalMonth(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function getAvailableMonths(transactions, currentMonth) {
  const months = transactions.map((transaction) =>
    transaction.date.slice(0, 7),
  );
  let recentMonth = currentMonth;
  for (let index = 0; index < 12; index += 1) {
    months.push(recentMonth);
    recentMonth = getPreviousMonth(recentMonth);
  }
  return [...new Set(months)].sort().reverse();
}
