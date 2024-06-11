import React, { useState, useEffect } from 'react';
import { formatCurrency } from "../helpers";
import Chart from 'chart.js/auto';
import { Link } from "react-router-dom";
import { TrashIcon } from '@heroicons/react/24/solid';

function ExpensePage() {
    const [expenses, setExpenses] = useState([]);
    const [categoryExpense, setCategoryExpense] = useState([]);

    useEffect(() => {
        fetchExpenses();
        FetchCategory();
    }, []);

    useEffect(() => {
        if (categoryExpense.length > 0) {
            generatePieChart();
            generateGraph();
        }   
    }, [categoryExpense]);

    const fetchExpenses = async () => {
        try {
            const username = localStorage.getItem('username');
            const response = await fetch(`http://localhost:5000/get-expenses-full?username=${username}`);

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

    const FetchCategory = async () => {
        try {
            const username = localStorage.getItem('username');
            const response = await fetch(`http://localhost:5000/get-categories?username=${username}`);

            if (response.ok){
                const data = await response.json();
                setCategoryExpense(data.categories)
            } else {
                throw new Error('Failed to Fetch Category Specific Expenses');
            }
        } catch(error){
            console.error("Error Fetching Category Expenses: ", error);
        }
    }

    const deleteExpense = async (expenseName) => {
        try {
            const response = await fetch(`http://localhost:5000/delete-expense/${expenseName}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                fetchExpenses();
                FetchCategory();
                console.log('Expense deleted successfully');
            } else {
                throw new Error('Failed to delete expense');
            }
        } catch (error) {
            console.error('Error deleting expense:', error);
        }
    };

    const generatePieChart = () => {
        const existingChart = Chart.getChart('pieChart');
        if (existingChart) {
            existingChart.destroy(); 
        }

        const pieChartCtx = document.getElementById('pieChart').getContext('2d');
        new Chart(pieChartCtx, {
            type: 'pie',
            data: {
                labels: categoryExpense.map(expense => expense.CategoryName),
                datasets: [{
                    data: categoryExpense.map(expense => expense.totalAmount),
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.5)',
                        'rgba(54, 162, 235, 0.5)',
                        'rgba(255, 206, 86, 0.5)',
                        'rgba(75, 192, 192, 0.5)',
                        'rgba(153, 102, 255, 0.5)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'right'
                    }
                }
            }
        });
    };

    const generateGraph = () => {
        const existingChart = Chart.getChart('expenseGraph');
        if (existingChart) {
            existingChart.destroy(); 
        }

        const expenseGraphCtx = document.getElementById('expenseGraph');
        new Chart(expenseGraphCtx, {
            type: 'line',
            data: {
                labels: categoryExpense.map(expense => expense.CategoryName),
                datasets: [{
                    label: 'Expense Amount',
                    data: categoryExpense.map(expense => expense.totalAmount),
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    };

    return (
        <>
            <div className="grid-lg">
                <h2>All Expenses <span><small>({expenses.length} total)</small></span></h2>
                <div className="grid-md">
                    <div>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Amount</th>
                                <th>Budget</th>
                                <th>Category</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.map((expense) => (
                                <tr key={expense.id}>
                                    <td>{expense.ExpenseName}</td>
                                    <td>{formatCurrency(expense.ExpenseAmount)}</td>
                                    <td>{expense.AccountName}</td>
                                    <td>{expense.CategoryName}</td>
                                    <td>
                                        <button
                                            className="btn btn--warning"
                                            onClick={() => deleteExpense(expense.ExpenseName)}
                                        >
                                            <TrashIcon width={20}/>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </div>
                </div>
            </div>
            <br></br>
            <br></br>           
            <div className="grid-md">
                <div className="grid-sm canvas-container">
                    <h2>Pie Chart</h2>
                    <canvas id="pieChart"></canvas>
                </div>
                <br></br>
                <div className="grid-sm canvas-container">
                    <h2>Expense Graph</h2>
                    <canvas id="expenseGraph"></canvas>
                </div>
            </div>
            <Link to="/dashboard" className="btn btn--dark" style={{marginTop: '1rem'}}>Back To Dashboard</Link>
        </>
    );
}

export default ExpensePage;