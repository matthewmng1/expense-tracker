import React from 'react'
import moment from 'moment';
import './ExpenseTable.css'

const ExpenseTable = ({data, editExpense}) => {
  const handleEditClick = (expenseId) => {
    // console.log(expenseId)
    editExpense(expenseId);
  };
  
  return (
    <table className='expense-table-container' style={{ "minWidth": "440px"}}>
      <thead className='expense-table-header'>
        <tr>
          <th>Date</th>
          <th>Description</th>
          <th>Category</th>
          <th>Amount</th>
          <th>Payment Method</th>
          <th></th>
        </tr>            
      </thead>
      <tbody className='expense-table-body'>
        {data === null || data.length === 0 ? (
          <tr className="expense-table-body-row">
            <td colSpan="5">No data available</td>
          </tr>
        ) : (
        data.map((d) => {
          const formattedDate = moment(d.date).utc().format('DD MMM YYYY')

          return (
            <tr key={d._id} className="expense-table-body-row">
              <td style={{textAlign: "center"}}>{formattedDate}</td>
              <td>{d.description}</td>
              <td>{d.category}</td>
              <td style={{textAlign: "right"}}>${d.amount}</td>
              <td style={{textAlign: "left", paddingLeft: "30px"}}>{d.paymentMethod}</td>
              { editExpense !== undefined && 
                <td>
                  <button onClick={() => handleEditClick(d._id)} className="expense-table-edit-btn">
                    Edit
                  </button>
                </td>
              }
              
              
              
            </tr>
          );
        })
      )}
      </tbody>
    </table>
  )
}

export default ExpenseTable;