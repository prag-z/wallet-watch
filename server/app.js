const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '506329',
    database: 'walletwatch'
});

app.post('/signup', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    const checkUserExistsQuery = `SELECT * FROM users WHERE username = ?`;
    db.query(checkUserExistsQuery, [username], (err, result) => {
        if (err) {
            console.error('Error checking user existence:', err);
            return res.status(500).json({ message: 'Error checking user existence' });
        }

        if (result.length > 0) {
            return res.status(409).json({ message: 'Account Already Exists, Please Log-in.' });
        }

        const insertUserQuery = `INSERT INTO users (username, password) VALUES (?, ?)`;
        db.query(insertUserQuery, [username, password], (err) => {
            if (err) {
                console.error('Error inserting user:', err);
                return res.status(500).json({ message: 'Error inserting user' });
            }
            
            console.log('User inserted successfully');
            res.status(200).json({ message: 'Signup successful', username: username });
        });
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const sql = `SELECT * FROM Users WHERE username = ? AND password = ?`;

    db.query(sql, [username, password], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error Logging In');
        } else {
            if (result.length > 0) {

                res.status(200).json(result);
            } else {
                res.status(401).send('Invalid Credentials');
            }
        }
    });
});

app.get('/get-username', (req, res) => {
    const { username } = req.query;
    const sql = `SELECT username FROM users WHERE username = ?`; 
  
    db.query(sql, [username], (err, result) => {
        if (err) {
            console.error('Error fetching username:', err);
            res.status(500).json({ error: 'Error fetching username' });
        } else {
            if (result.length > 0) {
                const fetchedUsername = result[0].username;
                res.json({ username: fetchedUsername });
            } else {
                res.status(404).json({ error: 'Username not found' });
            }
        }
    });
});

app.get('/get-budgets', (req, res) => {
    const username = req.query.username; 

    const getBudgetsQuery = `SELECT accountName, amount FROM budgets WHERE username = ?`;

    db.query(getBudgetsQuery, [username], (err, result) => {
        if (err) {
            console.error('Error fetching budgets:', err);
            res.status(500).json({ error: 'Error fetching budgets' });
        } else {
            res.status(200).json({ budgets: result });
        }
    });
});

app.post('/create-budget', (req, res) => {
    const { accountName, amount } = req.body;
    const username = req.body.username; 

    if (!accountName || !amount || !username) {
        return res.status(400).json({ message: 'Account name, amount, and username are required' });
    }

    const insertBudgetQuery = `INSERT INTO budgets (accountName, amount, username) VALUES (?, ?, ?)`; 
    db.query(insertBudgetQuery, [accountName, amount, username], (err, result) => {
        if (err) {
            console.error('Error inserting budget:', err);
            return res.status(500).json({ message: 'Budget Already Inserted' });
        }
        
        console.log('Budget inserted successfully');
        res.status(200).json({ message: 'Budget created successfully' });
    });
});

app.post('/create-expenses', (req, res) => {
    const { expenseName, expenseAmount, accountName, categoryName, username } = req.body;

    if (!expenseName || !expenseAmount || !accountName || !categoryName || !username) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const insertExpenseQuery = `
        INSERT INTO expenses (ExpenseName, ExpenseAmount, AccountName, CategoryName, Username)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(insertExpenseQuery, [expenseName, expenseAmount, accountName, categoryName, username], (err, result) => {
        if (err) {
            console.error('Error inserting expense:', err);
            return res.status(500).json({ message: 'Error creating expense' });
        }

        const updateCategoriesQuery = `
            INSERT INTO Categories (Username, CategoryName, totalAmount)
            SELECT
                e.Username,
                e.CategoryName,
                SUM(e.ExpenseAmount) AS totalAmount
            FROM
                Expenses e
            WHERE
                e.Username = ?
            GROUP BY
                e.Username,
                e.CategoryName
            ON DUPLICATE KEY UPDATE
                totalAmount = VALUES(totalAmount);
        `;

        db.query(updateCategoriesQuery, [username], (err, result) => {
            if (err) {
                console.error('Error updating Categories table:', err);
                return res.status(500).json({ message: 'Error updating Categories table' });
            }

            console.log('Expense created successfully');
            res.status(200).json({ message: 'Expense Created Successfully' });
        });
    });
});



app.get('/get-expenses', (req, res) => {
    const { username } = req.query;
  
    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }
  
    const getExpensesProcedure = `
    CALL get_expenses_proc(?)
    `;
  
    db.query(getExpensesProcedure, [username], (err, results) => {
      if (err) {
        console.error('Error fetching expenses:', err);
        return res.status(500).json({ message: 'Error fetching expenses' });
      }
    
      const expenses = results[0];
  
      res.status(200).json({ expenses });
    });
});

app.post('/create-expense', (req, res) => {
    const { expenseName, expenseAmount, accountName, categoryName, username } = req.body;

    if (!expenseName || !expenseAmount || !accountName || !categoryName || !username) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const insertExpenseQuery = `
        INSERT INTO expenses (ExpenseName, ExpenseAmount, AccountName, CategoryName, Username)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(insertExpenseQuery, [expenseName, expenseAmount, accountName, categoryName, username], (err, result) => {
        if (err) {
            console.error('Error inserting expense:', err);
            return res.status(500).json({ message: 'Error creating expense' });
        }

        const updateCategoriesQuery = `
            INSERT INTO Categories (Username, CategoryName, totalAmount)
            SELECT
                e.Username,
                e.CategoryName,
                SUM(e.ExpenseAmount) AS totalAmount
            FROM
                Expenses e
            WHERE
                e.Username = ?
            GROUP BY
                e.Username,
                e.CategoryName
            ON DUPLICATE KEY UPDATE
                totalAmount = VALUES(totalAmount);
        `;

        db.query(updateCategoriesQuery, [username], (err, result) => {
            if (err) {
                console.error('Error updating Categories table:', err);
                return res.status(500).json({ message: 'Error updating Categories table' });
            }

            console.log('Expense created successfully');
            res.status(200).json({ message: 'Expense Created Successfully' });
        });
    });
});

app.get('/get-expenses-full', (req, res) => {
    const { username } = req.query;

    if (!username) {
        return res.status(400).json({ message: 'Username is required' });
    }

    const getExpensesQuery = `SELECT * FROM expenses WHERE Username = ?`;

    db.query(getExpensesQuery, [username], (err, result) => {
        if (err) {
            console.error('Error fetching expenses:', err);
            return res.status(500).json({ message: 'Error fetching expenses' });
        }

        res.status(200).json({ expenses: result });
    });
});

app.get('/get-categories', (req, res) => {
    const { username } = req.query;

    if (!username) {
        return res.status(400).json({ message: 'Username is required' });
    }
    const getCategoriesQuery = `
    SELECT c.Username, c.CategoryName, IFNULL(e.totalAmount, 0) AS totalAmount
    FROM (
        SELECT Username, CategoryName
        FROM categories
        WHERE Username = ?
    ) c
    LEFT JOIN (
        SELECT e.Username, e.CategoryName, SUM(e.ExpenseAmount) AS totalAmount
        FROM expenses e
        GROUP BY e.Username, e.CategoryName
    ) e ON c.Username = e.Username AND c.CategoryName = e.CategoryName;
    `;

    db.query(getCategoriesQuery, [username], (err, results) => {
        if (err) {
            console.error('Error fetching categories:', err);
            return res.status(500).json({ message: 'Error fetching categories' });
        }

        res.status(200).json({ categories: results });
    });
});

app.delete('/delete-expense/:expenseName', (req, res) => {
    const { expenseName } = req.params;

    const deleteExpenseQuery = `DELETE FROM expenses WHERE ExpenseName = ?`;

    db.query(deleteExpenseQuery, [expenseName], async (err, result) => {
        if (err) {
            console.error('Error deleting expense:', err);
            return res.status(500).json({ message: 'Error deleting expense' });
        }

        const username = req.query.username;
        const getCategoryQuery = `SELECT CategoryName, SUM(ExpenseAmount) AS totalAmount FROM expenses WHERE Username = ? GROUP BY CategoryName`;

        db.query(getCategoryQuery, [username], async (err, categories) => {
            if (err) {
                console.error('Error fetching categories:', err);
                return res.status(500).json({ message: 'Error fetching categories' });
            }

            try {
                for (const category of categories) {
                    const updateCategoryQuery = `
                        INSERT INTO categories (Username, CategoryName, totalAmount)
                        VALUES (?, ?, ?)
                        ON DUPLICATE KEY UPDATE totalAmount = ?;
                    `;

                    await db.query(updateCategoryQuery, [username, category.CategoryName, category.totalAmount, category.totalAmount]);
                }

                console.log('Expense deleted successfully');
                res.status(200).json({ message: 'Expense deleted successfully' });
            } catch (error) {
                console.error('Error updating categories:', error);
                res.status(500).json({ message: 'Error updating categories' });
            }
        });
    });
});

app.get('/get-sum-expenses', (req, res) => {
    const { username } = req.query;

    if (!username) {
        return res.status(400).json({ message: 'Username is required' });
    }

    const getSumExpensesQuery = `
        SELECT SUM(ExpenseAmount) AS totalExpenses 
        FROM expenses 
        WHERE Username = ?;
    `;

    db.query(getSumExpensesQuery, [username], (err, result) => {
        if (err) {
            console.error('Error fetching total expenses:', err);
            return res.status(500).json({ message: 'Error fetching total expenses' });
        }

        const totalExpenses = result[0].totalExpenses || 0;

        res.status(200).json({ totalExpenses });
    });
});

app.get('/get-sum-budgets', (req, res) => {
    const { username } = req.query;

    if (!username) {
        return res.status(400).json({ message: 'Username is required' });
    }

    const getSumBudgetsQuery = `SELECT SUM(Amount) AS totalBudget FROM budgets WHERE Username = ?`;

    db.query(getSumBudgetsQuery, [username], (err, result) => {
        if (err) {
            console.error('Error fetching sum of budgets:', err);
            return res.status(500).json({ message: 'Error fetching sum of budgets' });
        }

        const totalBudget = result[0].totalBudget || 0; 
        res.status(200).json({ totalBudget });
    });
});

app.get('/get-expense-by-budget', (req, res) => {
    const { username, AccountName } = req.query;

    if (!username || !AccountName) {
        return res.status(400).json({ message: 'Username and AccountName are required' });
    }

    const getExpensesByBudgetQuery = 'CALL GetExpensesForUserAndAccount(?, ?)';

    db.query(getExpensesByBudgetQuery, [username, AccountName], (err, results) => {
        if (err) {
            console.error('Error fetching expenses by budget:', err);
            return res.status(500).json({ message: 'Error fetching expenses by budget' });
        }

        const expenses = results[0]; 

        res.status(200).json({ expenses });
    });
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
})