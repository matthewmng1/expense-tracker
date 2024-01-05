import React from 'react'
import { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { useParams } from 'react-router-dom';
import { useGetYearlyExpensesQuery } from './expensesApiSlice';
import ExpenseTable from './ExpenseTable';

import './MonthlyExpenses.css'

const MonthlyExpenses = () => {
  const { username } = useParams();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [yearExpenses, setYearExpenses] = useState({})
  const [years, setYears] = useState([])
  const monthSet = [
    {id: 1, month: 'January', data: {}}, 
    {id: 2, month: 'February', data: {}}, 
    {id: 3, month: 'March', data: {}}, 
    {id: 4, month: 'April', data: {}}, 
    {id: 5, month: 'May', data: {}}, 
    {id: 6, month: 'June', data: {}}, 
    {id: 7, month: 'July', data: {}}, 
    {id: 8, month: 'August', data: {}}, 
    {id: 9, month: 'September', data: {}}, 
    {id: 10, month: 'October', data: {}}, 
    {id: 11, month: 'November', data: {}}, 
    {id: 12, month: 'December', data: {}}
  ]
  const [displayMonth, setDisplayMonth] = useState(null)

  const handleDisplayMonth = (month) => {
    setDisplayMonth((currDisplayMonth) => {
      if(currDisplayMonth === month){
        return null;
      } else { 
        return month;
      }
    });
  }

  const {
    data: fetchYearlyExpenses,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetYearlyExpensesQuery({
    username: username,
    year: selectedYear
  })

  useEffect(() => {
    if(isSuccess){
      if (fetchYearlyExpenses && fetchYearlyExpenses.expenses) {
        setYearExpenses(fetchYearlyExpenses.expenses);
      } else {
        setYearExpenses({});
      }
  
      if (fetchYearlyExpenses && fetchYearlyExpenses.years) {
        const currentYear = new Date().getFullYear()
        const yearsSet = new Set([currentYear]);
        fetchYearlyExpenses.years.forEach((year)=>{
          yearsSet.add(year)
        })
        const yearsArr = Array.from(yearsSet)
        setYears(yearsArr);
      } else {
        setYears({});
      }
    }
  }, [isSuccess, fetchYearlyExpenses])


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

  let content;
  if (isLoading) {
    content = <p>"Loading..."</p>;
  } else if (isSuccess && yearExpenses &&  yearExpenses.length > 0 ) {
    const organizedExpenses = monthSet.map((month) => {
      const monthExpenses = yearExpenses.filter((obj) => {
        const arr = obj.date.split('-');
        const month_idx = parseInt(arr[1], 10);
        return month_idx === month.id;
      });
      return {
        month: month.month,
        data: monthExpenses,
      };
    });

    content = (
      <section className='monthly-expenses-wrapper'>
        <h1>Monthly Expenses</h1>
        <div className='monthly-expenses-year-selector-div'>
          Select Year: &nbsp;
          <select onChange={(e) => setSelectedYear(e.target.value)} className='monthly-expenses-year-selector'>
            {years.map((year) => (
              <option value={year} key={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        
        <div className='monthly-expenses-container'>
          {organizedExpenses.map((month) => (
            <ul key={month.month} className='monthly-expenses-list' onClick={() => handleDisplayMonth(month.month)} >
              <li className='monthly-expenses-list-item'>
                <button className='monthly-expenses-month-display'>
                  {displayMonth === month.month ? (
                    <div>
                      - {month.month}
                    </div>
                  ) : ( 
                    <div>
                      + {month.month}
                    </div> )}
                </button>
                <i> {month.data.length} Transaction</i>
              </li>

              <div className={`monthly-expenses-table ${displayMonth === month.month ? 'show' : ''}`}>
                {displayMonth === month.month && (
                  <div className='monthly-expenses-table-div'>
                    {month.data.length > 0 && (
                      <div style={{ width: 500 }} className='monthly-expenses-chart'>
                        <Doughnut
                          data={{
                            labels: month.data.map((item) => item.category),
                            datasets: [
                              {
                                label: "Expenses by Category",
                                data: month.data.map((item) => item.amount),
                                backgroundColor: month.data.map(() => getRandomColor()),
                              },
                            ],
                          }}
                          options={{
                            plugins: {
                              legend: {
                                position: 'right',
                              },
                            },
                          }}
                        />
                      </div>
                    )}
                    <div className='monthly-expenses-expensetable'>
                      <ExpenseTable data={month.data} />
                    </div>
                    
                  </div>
                )}
              </div>
            </ul>
          ))}
        </div>
      </section>
    );
  } else if (isError){
    console.log(error)
  } else {
    content = 
      <section>
        <h1>Monthly Expenses</h1>
          <select>
            <option>{selectedYear}</option>
          </select>
          {monthSet.map(m => (
            <ul key={m.month}>
              <li>
                <button onClick={() => handleDisplayMonth(m.month)}>{m.month}</button>
              </li>
              <div className={`expense-table-container ${displayMonth === m.month ? 'show' : ''}`}>
                {displayMonth === m.month && (
                  <div>
                    <ExpenseTable data={null} />
                  </div>
                )}
              </div>
            </ul>
          ))}
      </section>
  }
  
  return content;
}

export default MonthlyExpenses;


// yearly expenses has the total expneses of the year and all information
// each month should have it's own expenses as a table
// filter yearExpenses by date
// split up the transactions by month