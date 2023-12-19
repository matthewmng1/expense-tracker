import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logOut, selectCurrentUser } from "../features/auth/authSlice";

import "./TopNavigation.css"
import menu from "../images/menu2.jpg"

import NewExpense from "../features/expenses/NewExpense";
import { useGetUserByUsernameQuery } from "../features/users/usersApiSlice";
import { useGetUserExpensesQuery, useGetRecentExpensesQuery, useGetCategoryExpensesQuery } from "../features/expenses/expensesApiSlice";

function TopNavigation() {
  const user = useSelector(selectCurrentUser)
  const [userCategories, setUserCategories] = useState([])
  const [userPaymentMethods, setUserPaymentMethods] = useState([])
  const [showMenu, setShowMenu] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const dispatch = useDispatch();

  const currentDate = new Date();
  const lastWeekDate = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
  const formattedCurrentDate = currentDate.toISOString().split('T')[0]
  const formattedLastWeekDate = lastWeekDate.toISOString().split('T')[0]

  const {
    data: fetchUserData,
    isLoading,
    isSuccess,
    isError,
    error,
    refetch
  } = useGetUserByUsernameQuery({
    username: user
  });

  const { refetch: refetchUserExpenses } = useGetUserExpensesQuery({ username: user })

  const {refetch: refetchCategoryExpenses} = useGetCategoryExpensesQuery({ username: user })

  const { refetch: refetchRecentExpenses } = useGetRecentExpensesQuery({
    username: user, 
    currentDate: formattedCurrentDate, 
    lastWeekDate: formattedLastWeekDate
  })

  useEffect( () => {
    if(isSuccess){
      setUserCategories(fetchUserData.categories)
      setUserPaymentMethods(fetchUserData.paymentMethods)
    }
  })

  const toggleMenu = () => {
    setShowMenu(prevState => !prevState);
  }

  const handleLogout = () => {
    setShowMenu(false)
    dispatch(logOut());
  }

  const displayForm = () => {
    setShowForm(prevState => !prevState);
  }

  if(user === "admin"){
    return(
      <div className="top-nav-container">
        <div className="top-nav-content">
          {showForm ? (
            <div style={{ display: showForm ? "block" : "none"}}>
              <NewExpense username={user} categories={userCategories} paymentMethods={userPaymentMethods}  refetch={refetchUserExpenses && refetchRecentExpenses && refetchCategoryExpenses} toggleDisplay={() => displayForm()}/>
            </div>
          ) : (
              <button onClick={() => displayForm()} className="add-transaction-btn">+ Add Transaction</button>
          )
          
          }        
          <nav>
          <button onClick={toggleMenu}><img src={menu} className="menu-image"/></button>
            <div className={`dropdown ${showMenu ? 'show' : ''}`}>
              <NavLink to={`${user}/profile`}>
                {user}
              </NavLink>

              <NavLink to={`${user}/expenses`}>
                Expenses
              </NavLink>

              <NavLink to="userslist">
                Users List
              </NavLink>

              <NavLink className="nav-link" to={`${user}/testing`}>
                Testing Page
              </NavLink>

              <NavLink to="/" onClick={ handleLogout }>
                Log out
              </NavLink>
            </div>
          </nav>
        </div>
      </div>
    )
  }

  if(user){
    return(
      <div className="top-nav-container">
        <div className="top-nav-content">
          {showForm ? (
            <div style={{ display: showForm ? "block" : "none"}}>
              <NewExpense username={user} categories={userCategories} paymentMethods={userPaymentMethods}  refetch={refetchUserExpenses && refetchRecentExpenses} toggleDisplay={() => displayForm()}/>
            </div>
          ) : (
              <button onClick={() => displayForm()} className="add-transaction-btn">+ Add Transaction</button>
          )
          
          }        
          <nav>
          <button onClick={toggleMenu}><img src={menu} className="menu-image"/></button>
            <div className={`dropdown ${showMenu ? 'show' : ''}`}>
              <NavLink to="/" onClick={ handleLogout }>
                Log out
              </NavLink>
            </div>
          </nav>
        </div>
      </div>
    )
  }
}

export default TopNavigation;

