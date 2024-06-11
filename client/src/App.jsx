import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import { useLocation } from 'react-router-dom';
import Main, { mainLoader } from "./layouts/Main";

import { logoutAction } from "./actions/logout";

import Dashboard, { dashboardLoader } from "./pages/Dashboard";
import Login from "./pages/Login";
import AccountForm from "./components/AccountForm";
import Table from "./components/Table";
import ExpensePage from "./pages/ExpensePage";
import BudgetPage from "./pages/BudgetPage";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    loader: mainLoader,
    children: [
      {
        index: true,
        element: <Dashboard />,
        loader: dashboardLoader,
      },
      {
        path: "logout",
        action: logoutAction,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "dashboard",
        element: (
          <>
            <AccountForm />
            <br></br>
            <Table />
          </>
        ),
      },
      {
        path: "dashboard/expenses",
        element: <ExpensePage />
      },
      {
        // This route matches any URL that begins with "/budgets?accountName="
        path: "/budgets",
        element: <BudgetPageWrapper />,
      }
    ]
  },
]);

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;

function BudgetPageWrapper() {
  const { pathname } = useLocation();
  const regex = /^\/budgets\?accountName=(.*)$/;
  
  // Extract accountName from the URL using regex
  const match = pathname.match(regex);
  const accountName = match ? match[1] : null;

  // Render BudgetPage with the extracted accountName
  return <BudgetPage accountName={accountName} />;
}
