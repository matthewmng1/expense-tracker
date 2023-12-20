import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGetRecentExpensesQuery } from "./expensesApiSlice";
import ExpenseTable from "./ExpenseTable";

const RecentTransactions = () => {
  const {username} = useParams();
  const [userExpenses, setUserExpenses] = useState([])
  const currentDate = new Date();
  const lastWeekDate = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
  const formattedCurrentDate = currentDate.toISOString().split('T')[0]
  const formattedLastWeekDate = lastWeekDate.toISOString().split('T')[0]

  const { 
    data: fetchUserExpenses,
    isLoading,
    isSuccess,
    isError,
    error,
    refetch: refetchUserExpenses
  } = useGetRecentExpensesQuery({
    username: username, 
    currentDate: formattedCurrentDate, 
    lastWeekDate: formattedLastWeekDate
  })

  useEffect(() => {
    if (isSuccess) {
      setUserExpenses(fetchUserExpenses);
      refetchUserExpenses();
    }

  }, [isSuccess, fetchUserExpenses]);

  let content;
  if (isLoading) {
    content = <p>"Loading..."</p>
  } else if (isSuccess) {
      content = (
        <div>
          <div><ExpenseTable data={userExpenses}/></div>
        </div>
      )
    
  } else if (isError){
    console.log(error)
  }
  
  return content;

}

export default RecentTransactions;