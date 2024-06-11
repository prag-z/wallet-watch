import React, { useState, useEffect } from 'react';
import { formatCurrency } from "../helpers";
import { Link } from "react-router-dom";

function Table() {
    const [expenses, setExpenses] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetchExpenses(); 
        const interval = setInterval(fetchExpenses, 2500); 

        return () => clearInterval(interval); 
    }, []);

    const fetchExpenses = async () => {
        try {
            const username = localStorage.getItem('username');
            const response = await fetch(`http://localhost:5000/get-expenses?username=${username}`);

            if (response.ok) {
                const data = await response.json();
                setExpenses(data.expenses);
            } else {
                throw new Error('Failed to Fetch Expenses');
            }
        } catch (error) {
            console.error('Error Fetching Expenses: ', error);
        }
    };

    return (
        <>
            <h2>Recent Expenses</h2>
            <br></br>
            <div className="table">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Amount</th>
                            <th>Budget</th>
                            <th>Category</th>
                        </tr>
                    </thead>
                    <tbody>
                        {expenses.map((expense) => (
                            <tr key={expense.id}>
                                <td>{expense.ExpenseName}</td>
                                <td>{formatCurrency(expense.ExpenseAmount)}</td>
                                <td>{expense.AccountName}</td>
                                <td>{expense.CategoryName}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Link to="expenses" className="btn btn--dark" style={{ marginTop: '1rem' }}>View All Expenses</Link>
            {errorMessage && <p>{errorMessage}</p>}
        </>
    );
}

export default Table;
