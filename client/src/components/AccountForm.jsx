import React, { useState, useEffect } from 'react';
import { formatCurrency } from "../helpers";
import { CurrencyDollarIcon } from "@heroicons/react/24/solid";
import IncomeBalance from './IncomeBalance';
import { Link, Navigate } from "react-router-dom";

function AccountForm() {
  const [accountName, setAccountName] = useState('');
  const [amount, setAmount] = useState('');
  const [budgets, setBudgets] = useState([]);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [expenseName, setExpenseName] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [selectedBudget, setSelectedBudget] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(''); 
  const [errorMessage, setErrorMessage] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [selectedAccountName, setSelectedAccountName] = useState(''); 

  useEffect(() => {
    fetchBudgets();
  }, []); 

  const fetchBudgets = async () => {
    try {
      const username = localStorage.getItem('username'); 
      const response = await fetch(`http://localhost:5000/get-budgets?username=${username}`);
      
      if (response.ok) {
          const data = await response.json();
          setBudgets(data.budgets);
      } else {
          throw new Error('Failed to fetch budgets');
      }
    } catch (error) {
        console.error('Error fetching budgets:', error);
        setErrorMessage('Error fetching budgets. Please try again.');
    }
  };

  const handleSubmitBudget = async (e) => {
    e.preventDefault();

    const username = localStorage.getItem('username');

    try {
      const response = await fetch('http://localhost:5000/create-budget', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accountName, amount, username }), 
      });

      if (response.ok) {
        console.log('Budget created successfully');
        fetchBudgets(); 
        setAccountName(''); 
        setAmount('');
        setShowExpenseForm(true);
      } else {
        const data = await response.json();
        setErrorMessage(data.message); 
      }
    } catch (error) {
        console.error('Error creating budget:', error);
        setErrorMessage('Error creating budget. Please try again.');
    }
  };

  const handleSubmitExpense = async (e) => {
    e.preventDefault();
    
    const username = localStorage.getItem('username');
  
    try {
      const response = await fetch('http://localhost:5000/create-expense', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          expenseName, 
          expenseAmount, 
          accountName: selectedBudget, 
          categoryName: selectedCategory, 
          username 
        }), 
      });
  
      if (response.ok) {
        console.log('Expense created successfully');
        setExpenseName('');
        setExpenseAmount('');
        setSelectedBudget('');
        setSelectedCategory('');
      } else {
        const data = await response.json();
        setErrorMessage(data.message); 
      }
    } catch (error) {
      console.error('Error creating expense:', error);
      setErrorMessage('Error creating expense. Please try again.');
    }
  };

  const generateRandomColor = () => {
    const existingBudgetLength = budgets.length + 1;
    return `hsl(${existingBudgetLength * 34}, 65%, 50%)`;
  };

  useEffect(() => {
    if (redirect && selectedAccountName) {
      localStorage.setItem('selectedAccountName', selectedAccountName);
      console.log(localStorage.getItem('selectedAccountName'));
    }
  }, [redirect, selectedAccountName]);

  return (
    <>
      <div>
        <h1>Welcome Back, <span className="accent">{localStorage.getItem('username')}</span></h1>
      </div>
      <br></br>
      <IncomeBalance />
      <br />
      <div></div>
      
      <div className="form-wrapper">
        
        <h2 className="h3">Create Budget</h2>
        <form onSubmit={handleSubmitBudget} className="grid-sm">
          <div className="grid-xs">
            <label htmlFor="newAccount">Account Name</label>
            <input 
              type="text" 
              name="newAccount" 
              id="newAccount"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder="e.g., Cash, ICICI Bank Account etc."
              required
              inputMode="decimal"
            />
          </div>
          <div className="grid-xs">
            <label htmlFor="newAccountAmount">Amount</label>
            <input 
              type="text" 
              name="newAccountAmount" 
              id="newAccountAmount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g., ₹1000"
              required
              inputMode="decimal"
            />
          </div>
          <button type="submit" className="btn btn--dark">
            <span>Create Budget</span>
            <CurrencyDollarIcon width={20} />
          </button>
        </form>
        {errorMessage && <p>{errorMessage}</p>}
      </div>
      

      {budgets.length > 0 && (
        <div className="form-wrapper">
          <h2 className="h3">Create Expense</h2>
          <form onSubmit={handleSubmitExpense} className="grid-sm">
            <div className="grid-xs">
              <label htmlFor="expenseName">Expense Name</label>
              <input 
                type="text" 
                name="expenseName" 
                id="expenseName"
                value={expenseName}
                onChange={(e) => setExpenseName(e.target.value)}
                placeholder="Expense Name"
                required
              />
            </div>
            <div className="grid-xs">
              <label htmlFor="expenseAmount">Amount</label>
              <input 
                type="text" 
                name="expenseAmount" 
                id="expenseAmount"
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(e.target.value)}
                placeholder="e.g., ₹100"
                required
                inputMode="decimal"
              />
            </div>
            <div className="grid-xs">
              <label htmlFor="selectedBudget">Budget</label>
              <select 
                name="selectedBudget" 
                id="selectedBudget"
                value={selectedBudget}
                onChange={(e) => setSelectedBudget(e.target.value)}
                required
              >
                <option value="">Select Budget</option>
                {budgets.map(budget => (
                  <option key={budget.id} value={budget.accountName}>
                    {budget.accountName} - {formatCurrency(budget.amount)}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid-xs">
              <label htmlFor="selectedCategory">Category</label>
              <input 
                type="text" 
                name="selectedCategory" 
                id="selectedCategory"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                placeholder="Category Name"
                required
              />
            </div>
            <button type="submit" className="btn btn--dark">
              <span>Create Expense</span>
              <CurrencyDollarIcon width={20} />
            </button>
          </form>
        </div>
      )}

      {redirect && <Navigate to={`/budgets?accountName=${selectedAccountName}`} />}
      <div style={{paddingLeft: "0.3rem"}}>
        <h2>Existing Budgets</h2>
      </div>
      <div style={{ paddingTop: "1.5rem", paddingLeft: "0.1rem", cursor: "pointer" }}>
        {budgets.map(budget => (
          <div
            className="budget"
            style={{
              "--accent": generateRandomColor(),
              cursor: "pointer",
            }}
            key={budget.id}
            onClick={() => {
              setRedirect(true);
              setSelectedAccountName(budget.accountName); 
            }}
          >
            <div className="progress-text">
              <h3>{budget.accountName}</h3> 
              <p>{formatCurrency(budget.amount)} Budgeted</p> 
            </div>
            <progress max={budget.amount} value="0"></progress>
            <div className="progress-text">
              <small>₹0 spent</small> 
              <small>{formatCurrency(budget.amount)} remaining</small> 
            </div>
          </div>
        ))}
      </div>
      {selectedAccountName && (
        <Link to={`/budgets?accountName=${selectedAccountName}`}>Go to Budget Page</Link>
      )
      }
    </>
  );
}

export default AccountForm;
