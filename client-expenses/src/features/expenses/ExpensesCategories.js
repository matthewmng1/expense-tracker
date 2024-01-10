import React from 'react'
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGetCategoryExpensesQuery } from './expensesApiSlice';
import CategoryChart from './CategoryChart';

const ExpensesCategories = () => {
  const { username } = useParams();
  const [selectedOption, setSelectedOption] = useState("currentMonth")
  const [categoryExpenses, setCategoryExpenses] = useState({})

  const {
    data: fetchCategoryExpenses,
    isLoading,
    isSuccess,
    isError,
    error,
    refetch: refetchCategoryExpenses,
  } = useGetCategoryExpensesQuery({
    username: username
  })

  useEffect(() => {
    if(isSuccess){
      setCategoryExpenses(fetchCategoryExpenses)
    }
  }, [isSuccess, fetchCategoryExpenses])


  let content;
  if(isLoading){
    content = <p>"Loading..."</p>
  } else if(isSuccess && categoryExpenses && categoryExpenses.length > 0){
    // console.log(categories)
    content = (
      <section>
        <select onChange={(e) => setSelectedOption(e.target.value)}>
          <option value="currentMonth">Current Month</option>
          <option value="lastSixMonths">Last 6 Months</option>
          <option value="lastYear">Last Year</option>
        </select>
          <CategoryChart chartData={categoryExpenses} selectedOption={selectedOption} />
      </section>
    )
  } else if(isError){
    console.log(error)
  } else {
    content = <div>No Data Available</div>;
  }
  
  return content;
}

export default ExpensesCategories;