import { useParams } from "react-router-dom";
import RecentTransactions from "../expenses/RecentExpenses";
import ExpensesCategories from "../expenses/ExpensesCategories";

import './UserOverview.css'
import MonthSpendingTotal from "../expenses/MonthSpendingTotal";

// import "./UserOverview.css"

const UserOverview = () => {

  const content = ( 
    <div className="overview-wrapper">
      <div className="overview-container">
        <h1>Overview</h1>  
        <div className="overview-content">
          <div className="overview-content-1">
            <div className="category-chart-container">
              <h2>Spending By Category</h2>
              <ExpensesCategories/>
            </div>
          </div>
        </div>
          <div className="overview-content-2">
            <div className="recent-transactions-container">
              <h3>Recent Transactions</h3>
              <RecentTransactions/>
            </div>
            <div className="month-spending-container">
              <h3>Monthly Spending</h3>
              <MonthSpendingTotal/>
            </div>
          </div>
      </div>  
    </div>

  )

  return content
}

export default UserOverview;

// Recent Transactions
  // Get current date
  // Get current date - 7 days
  // Find all transcations between current date - 7 and current date