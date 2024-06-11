import React, { useState, useEffect } from 'react';

function IncomeBalance() {
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [totalBalance, setTotalBalance] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            const income = await fetchTotalIncome();
            const expenses = await fetchTotalExpenses();
            setTotalBalance(income - expenses);
        };

        fetchData();

        const interval = setInterval(fetchData, 1000);

        return () => clearInterval(interval);
    }, []);

    async function fetchTotalIncome() {
        try {
            const username = localStorage.getItem('username');
            const response = await fetch(`http://localhost:5000/get-sum-budgets?username=${username}`);

            if (response.ok) {
                const data = await response.json();
                setTotalIncome(data.totalBudget);
                return data.totalBudget;
            } else {
                throw new Error('Failed to Fetch Total Income');
            }
        } catch (error) {
            console.error('Error Fetching Total Income: ', error);
            return 0;
        }
    }

    async function fetchTotalExpenses() {
        try {
            const username = localStorage.getItem('username');
            const response = await fetch(`http://localhost:5000/get-sum-expenses?username=${username}`);

            if (response.ok) {
                const data = await response.json();
                setTotalExpenses(data.totalExpenses);
                return data.totalExpenses;
            } else {
                throw new Error('Failed to Fetch Total Expenses');
            }
        } catch (error) {
            console.error('Error Fetching Total Expenses: ', error);
            return 0;
        }
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <div className="budget" style={{ marginRight: '30px' }}>
                <h4>Total Income: </h4>
                <p>{totalIncome}</p>
            </div>
            <div className="budget" style={{ marginRight: '30px' }}>
                <h4>Total Savings: </h4>
                <p>{totalBalance}</p>
            </div>
            <div className="budget" style={{ marginRight: '30px' }}>
                <h4>Total Expense: </h4>
                <p>{totalExpenses}</p>
            </div>
        </div>
    );
}

export default IncomeBalance;
