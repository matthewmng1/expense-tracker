import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { useGetMonthlyExpensesQuery } from './expensesApiSlice';
import { Line } from "react-chartjs-2"
import { Chart as ChartJS } from "chart.js/auto"

const MonthSpendingTotal = () => {
  const { username } = useParams();
  const [userExpenses, setUserExpenses] = useState([])
  const year = new Date().getFullYear();
  const monthSet = [
    {id: 1, month: 'January', total: {}}, 
    {id: 2, month: 'February', total: {}}, 
    {id: 3, month: 'March', total: {}}, 
    {id: 4, month: 'April', total: {}}, 
    {id: 5, month: 'May', total: {}}, 
    {id: 6, month: 'June', total: {}}, 
    {id: 7, month: 'July', total: {}}, 
    {id: 8, month: 'August', total: {}}, 
    {id: 9, month: 'September', total: {}}, 
    {id: 10, month: 'October', total: {}}, 
    {id: 11, month: 'November', total: {}}, 
    {id: 12, month: 'December', total: {}}
  ]

  const getRandomColor = () => {
    const colors = [
      '#aee39a', 
      '#1b511d', 
      '#54d7eb', 
      '#22577a', 
      '#21f0b6', 
      '#702cb4', 
      '#b69cfd', 
      '#3256c2', 
      '#67f059', 
      '#b31f59', 
      '#bce333', 
      '#604020', 
      '#fea53b', 
      '#67902f', 
      '#95bbef', 
      '#19a71f', 
      '#f73931', 
      '#f6a0ba', 
      '#a43e03', 
      '#f4d403']
    let colorIndex = getRandomColor.colorIndex || 0;
    const color = colors[colorIndex];

    getRandomColor.colorIndex = (colorIndex + 1) % colors.length;
    return color;
  };

  const {
    data: fetchUserExpenses,
    isLoading,
    isSuccess,
    isError,
    error,
    refetch
  } = useGetMonthlyExpensesQuery(
    {username: username}
  )

  useEffect(() => {
    if(isSuccess){
      setUserExpenses(fetchUserExpenses)
      refetch();
    }
  }, [isSuccess, fetchUserExpenses])
  
  let content;
  if(isLoading){
    content = <p>Loading...</p>
  } else if (isSuccess){
    const organizedExpenses = monthSet.map((month) => {
      const monthTotal = userExpenses.filter((row) => {
        if (row._id.year === year && row._id.month === month.id) {
          console.log(row.totalSpent);
          return row.totalSpent;
      }});
      if(monthTotal.length > 0){
        return {
          month: month.month,
          total: monthTotal[0].totalSpent
        };
      } 
      return {
        month: month.month,
        total: 0,
      }
      
    });
    content = (
      <div>
        <div style={{ height: "400px"}}>
          <Line
            data={{
              labels: organizedExpenses.map((row) => row.month),
              datasets: [
                {
                  label: "Total Spent by Month",
                  data: organizedExpenses.map((row) => row.total),
                  fillColor: "white",
                  backgroundColor: ["black"]
                }
              ]
            }}
            options={{
              plugins: {
                legend: {
                  display: false
                },
              },
              responsive: true,
              maintainAspectRatio: false,
            }}
          />
        </div>
      </div>
    )
  } else if (isError){
    console.log(error)
  }
  
  return content;
}

export default MonthSpendingTotal


// <div style={{ width: 300 }}>
//                         <Doughnut
//                           data={{
//                             labels: month.data.map((item) => item.category),
//                             datasets: [
//                               {
//                                 label: "Expenses by Category",
//                                 data: month.data.map((item) => item.amount),
//                                 backgroundColor: month.data.map(() => getRandomColor()),
//                               },
//                             ],
//                           }}
//                           options={{
//                             plugins: {
//                               legend: {
//                                 position: 'right',
//                               },
//                             },
//                           }}
//                         />
//                       </div>