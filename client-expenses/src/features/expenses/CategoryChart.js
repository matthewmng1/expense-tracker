import React from 'react'
import { Doughnut } from "react-chartjs-2"
import { Chart as ChartJS } from "chart.js/auto"

import './CategoryChart.css'

const CategoryChart = ({chartData, selectedOption}) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;

  const filterDataFunc = (timeFrame) => {
    const monthDiffMap = {
      'currentMonth': 1,
      'lastSixMonths': 6,
      'lastYear': 12,
    };
  
    const monthDiff = monthDiffMap[timeFrame];
  
    return (item) => {
      return monthDiff === 1 ? item._id.month === currentMonth :
        (currentMonth - item._id.month >= 0 && currentMonth - item._id.month <= monthDiff);
    };
  }

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


  let filterData = chartData
    .filter(filterDataFunc(selectedOption))
    .reduce((acc, category) => {
      const existingCategory = acc.find(
        (existingItem) => existingItem._id.category === category._id.category
      );
      if(existingCategory){
        existingCategory.totalSpent += category.totalSpent;
      } else {
        acc.push({
          _id: {category: category._id.category},
          totalSpent: category.totalSpent,
        })
      }
      return acc;
    }, [])

  let data = {
    labels: filterData.map((expense) => expense._id.category),
    datasets: [
    {
      label: "Expenses by Category",
      data: filterData.map((expense) => expense.totalSpent),
      backgroundColor: filterData.map(() => getRandomColor())
      }
    ]
  }
  return (
    <div className='chart-main'>
      <div style={{width: 1000}} className='chart-container'>
        <Doughnut
          data = {data}
          options = {{
            plugins: {
              legend: {
                position: 'bottom'
              }
            },
            responsive: true,
            maintainAspectRatio: false,
          }}
        />
      </div>
      <div className='chart-items-container'>
        <table className='chart-items-table'>
          <thead>
            <tr className='chart-items-header'>
              <th colSpan="2">Your Expenses</th>
            </tr>
          </thead>
          <tbody className='chart-items-body'>
            {filterData.map(item => 
              <tr key={item._id.category} className='chart-items-row'>
                <td>{item._id.category}</td>
                <td>${item.totalSpent.toFixed(2)}</td>
              </tr>
              )}
          </tbody>
        </table>
      </div>
    </div>     
  )
}

export default CategoryChart;