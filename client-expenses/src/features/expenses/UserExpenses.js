import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGetUserExpensesQuery } from "./expensesApiSlice";
import { useGetUserByUsernameQuery } from "../users/usersApiSlice";
import EditExpenseForm from "./EditExpenseForm";
import ExpenseTable from "./ExpenseTable";


const UserExpenses = () => {
  const { username } = useParams();
  const [showEditExpenseForm, setShowEditExpenseForm] = useState(false);
  const [editExpenseData, setEditExpenseData] = useState({
    date: "",
    description: "",
    amount: "",
    category: "",
    paymentMethod: ""
  })
  const [userExpenses, setUserExpenses] = useState([])
  const [userCategories, setUserCategories] = useState([])
  const [userPaymentMethods, setUserPaymentMethods] = useState([])
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [yearsSet, setYearsSet] = useState(new Set());

  const {
    data: fetchUserData,
    isLoading,
    isSuccess,
    isError,
    error,
    refetch
  } = useGetUserByUsernameQuery({
    username: username
  })

  // Call get User Expenses using username from
  const { 
    data: fetchUserExpenses,
    isLoading: loadingUserExpenses,
    isSuccess: successUserExpenses,
    isError: errorUserExpenses,
    error: errorDetailsUserExpenses,
    refetch: refetchUserExpenses
  } = useGetUserExpensesQuery({
    username: username
    })


  // Load data on component mount
  useEffect(() => {
    if (isSuccess && successUserExpenses) {
      setUserExpenses(fetchUserExpenses);
      setUserCategories(fetchUserData.categories);
      setUserPaymentMethods(fetchUserData.paymentMethods)
      
      const currentYear = new Date().getFullYear()
      const updatedYearsSet = new Set([currentYear]);

      fetchUserExpenses.forEach((expense) => {
        const year = new Date(expense.date).getFullYear();
        updatedYearsSet.add(year);
      });

      setYearsSet(updatedYearsSet);
      refetchUserExpenses();
    }
  }, [isSuccess,
      successUserExpenses, 
      fetchUserData,
      fetchUserExpenses,
    ]);

  // handle editing an existing transaction
  const handleEditExpenseForm = (expenseId) => {
    const foundExpense = userExpenses.find((expense) => expense._id === expenseId);
    setEditExpenseData(foundExpense)
    setShowEditExpenseForm(true)
  }

  let years;
  if(yearsSet){
    years = Array.from(yearsSet)
  }

  let content;
  if (isLoading && loadingUserExpenses) {
    content = <p>"Loading..."</p>
  } else if (isSuccess && successUserExpenses) {
    console.log(userCategories)
    console.log(userExpenses)
    const filterExpenses = years.map((year) => {
      const yearExpenses = userExpenses.filter((obj) => {
        const objYear = new Date(obj.date).getFullYear()
        return objYear === year
      })
      return {
        year: year,
        data: yearExpenses
      }
    })

    const filteredExpenses = filterExpenses.find((yearData) => yearData.year === parseInt(selectedYear));
    if(filteredExpenses){
      content = (
        <section className="user-expenses">
          <h1>Expenses</h1>
          <div>
            Select Year:&nbsp;
            <select onChange={(e) => setSelectedYear(e.target.value)}>
              {years.map(y => (
                <option key={y}>{y}</option>
              ))}
            </select>
          </div>

          <div>
          <ExpenseTable data={filteredExpenses.data} editExpense={handleEditExpenseForm}/>
          {showEditExpenseForm && (
            <div>
              <EditExpenseForm 
                key={editExpenseData._id}
                username={username}
                userCategories={userCategories}
                userPaymentMethods={userPaymentMethods}
                data={editExpenseData}
                refetch={refetch}
                editFormDisplay={() => setShowEditExpenseForm(false)}
              />
              <button onClick={() => setShowEditExpenseForm(false)}>Cancel</button>
            </div>
          )}
          </div>
        </section>
      )
    } else if (!filteredExpenses) {
      
      content = 
      
      <div>
        <h1>Expenses</h1>
          <div>
            Select Year:&nbsp;
            <select onChange={(e) => setSelectedYear(e.target.value)}>
              {years.map(y => (
                <option key={y}>{y}</option>
              ))}
            </select>
            <ExpenseTable data={null} editExpense={null}/>
          </div>
        </div>
    }
    } else if (isError && errorDetailsUserExpenses) {
    content = <p>{JSON.stringify(error, errorDetailsUserExpenses)}</p>;
  }

  return content;
}

export default UserExpenses;