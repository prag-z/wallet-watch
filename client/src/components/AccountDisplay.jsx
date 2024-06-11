import React, { useState, useEffect } from 'react';
import { formatCurrency, formatPercentage } from "../helpers";
import ExpenseForm from './ExpenseForm';

function AccountDisplay() {
  const [budgets, setBudgets] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

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

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]); 

  const generateRandomColor = () => {
    const existingBudgetLength = (budgets.length)+1;
    return `hsl(${existingBudgetLength * 34}, 65%, 50%)`;
  };

  return (
    <>
      <div style={{paddingLeft: "0.3rem"}}>
        <h2>Existing Budgets</h2>
      </div>
      <div style={{ paddingTop: "1.5rem", paddingLeft: "0.1rem" }}>

        {budgets.map(budget => (
          <div
            className="budget"
            style={{
              "--accent": generateRandomColor() // Apply the generated color
            }}
          >
            <div className="progress-text">
              <h3>{budget.accountName}</h3> 
              <p>{formatCurrency(budget.amount)} Budgeted</p> 
            </div>
            <progress max={budget.amount} value="0">
            </progress>
            <div className="progress-text">
              <small>₹0 spent</small> 
              <small>{formatCurrency(budget.amount)} remaining</small> 
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default AccountDisplay;
