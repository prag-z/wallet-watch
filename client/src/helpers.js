export const fetchData = (key) => {
  return JSON.parse(localStorage.getItem(key));
};

const generateRandomColor = () => {
  const existingBudgetLength = fetchData("budgets")?.length ?? 0;
  return `${existingBudgetLength * 34} 65% 50%`
}

export const deleteItem = ({ key }) => {
  return localStorage.removeItem(key)
}

export const createBudget = ({
  name, amount
  }) => {
  const newItem = {
    id: crypto.randomUUID(),
    name: name,
    createdAt: Date.now(),
    amount: +amount,
    color: generateRandomColor()
  }
  const existingBudgets = fetchData("budgets") ?? [];
  return localStorage.setItem("budgets",
    JSON.stringify([...existingBudgets, newItem]))
}

export const formatPercentage = (amt) => {
  return amt.toLocaleString(undefined, {
    style: "percent",
    minimumFractionDigits: 0,
  })
}

export const formatCurrency = (amt) => {
  return amt.toLocaleString(undefined, {
    style: "currency",
    currency: "INR"
  })
}

export const calculateSpentByBudget = (budgetId) => {
  const expenses = fetchData("expenses") ?? [];
  const budgetSpent = expenses.reduce((acc, expense) => {
    if (expense.budgetId !== budgetId) return acc

    return acc += expense.amount
  }, 0)
  return budgetSpent;
}