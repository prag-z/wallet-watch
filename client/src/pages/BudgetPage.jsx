import React, { useState, useEffect } from 'react';
import { formatCurrency } from "../helpers";
import { Link } from "react-router-dom";

function BudgetPage() {
    const [expenses, setExpenses] = useState([]);
    const accountName = localStorage.getItem('selectedAccountName'); 

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        try {
            const username = localStorage.getItem('username');
            const response = await fetch(`http://localhost:5000/get-expense-by-budget?username=${username}&AccountName=${accountName}`);

            if (response.ok) {
                const data = await response.json();
                setExpenses(data.expenses);
            } else {
                throw new Error('Failed to fetch expenses');
            }
        } catch (error) {
            console.error('Error fetching expenses:', error);
        }
    };

    return (
        <div className="grid-lg">
            <h2>All Expenses Under <span className="accent">{accountName}</span></h2>
            <div className="grid-md">
                <div>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Amount</th>
                            <th>Category</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {expenses.map((expense) => (
                            <tr key={expense.id}>
                                <td>{expense.ExpenseName}</td>
                                <td>{formatCurrency(expense.ExpenseAmount)}</td>
                                <td>{expense.CategoryName}</td>
                            </tr>
                        ))}
                    </tbody>
                </div>
            </div>
            <br />
            <Link to="/dashboard" className="btn btn--dark" style={{marginTop: '1rem'}}>Back To Dashboard</Link>
        </div>
    );
}

export default BudgetPage;
