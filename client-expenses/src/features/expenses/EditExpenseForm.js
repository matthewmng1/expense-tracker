import React, { useState } from 'react'
import { useEditUserExpenseMutation } from './expensesApiSlice'

import DeleteExpense from "./DeleteExpense";
import moment from 'moment';

import './EditExpenseForm.css'
const EditExpenseForm = ({username, userCategories, userPaymentMethods, data, refetch, editFormDisplay}) => {
  // console.log(data)
  const _id = data._id;
  const formattedDate = moment(data.date).utc().format('YYYY[-]MM[-]DD')
  const description = data.description;
  const amount = data.amount;
  const category = data.category;
  const paymentMethod = data.paymentMethod;

  const [expenseData, setExpenseData] = useState({
    date: formattedDate,
    description: description,
    amount: amount,
    category: category,
    paymentMethod: paymentMethod
  })

  const [editUserExpense] = useEditUserExpenseMutation();

  const handleChange = async (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setExpenseData(data => ({...data, [name]: value}));
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    try{
      const res = await editUserExpense({
        data: expenseData,
        username: username,
        expenseId: _id
      })
      editFormDisplay(false)
      window.location.reload();
    }catch(err){
      console.log(err)
    }
  }
  
  let content;
  content = (
    <div className='form-popup' id='new-expense-form'>
      <div className='edit-expense-container'>
        <form className='edit-expense-form' onSubmit={handleSubmit}>
          <table className='edit-expense-table'>
            <thead className='edit-expense-table-header'>
              <tr>
                <th colSpan="2">Edit Expense</th>
                <DeleteExpense username={username} expenseId={_id}/>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className='edit-expense-item-title'>Date</td>
                <td>
                  <input
                    type="date"
                    name="date"
                    value={expenseData.date}
                    onChange={handleChange}
                    className='edit-expense-date-input'
                  />
                </td>
              </tr>
              <tr>
                <td className='edit-expense-item-title'>Description</td>
                <td>
                  <input
                    type="text"
                    name="description"
                    value={expenseData.description}
                    onChange={handleChange}
                    placeholder="description"
                    className='edit-expense-description-input'
                  />
                </td>
              </tr>
              <tr>
                <td className='edit-expense-item-title'>Category</td>
                <td>
                  <select
                    name="category"
                    value={expenseData.category}
                    onChange={handleChange}
                    className='edit-expense-category-input'
                  >
                    {userCategories.map(c => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </td>
              </tr>
              <tr>
                <td className='edit-expense-item-title'>Amount</td>
                <td>
                  <input
                    type="number"
                    name="amount"
                    step="0.01"
                    min="0"
                    value={expenseData.amount}
                    onChange={handleChange}
                    placeholder="amount"
                    className='edit-expense-amount-input'
                  />
                </td>
              </tr>
              <tr>
                <td className='edit-expense-item-title'>Payment Method</td>
                <td>
                  <select
                    name="paymentMethod"
                    value={expenseData.paymentMethod}
                    onChange={handleChange}
                    className='edit-expense-payment-method-input'
                  >
                    {userPaymentMethods.map(pm => (
                      <option key={pm}>{pm}</option>
                    ))}
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
          <button className='edit-expense-form-cancel-btn'>Cancel</button>
          <button className='edit-expense-form-save-btn'>Save</button>
        </form>
      </div>
    </div>
  )
  
  return content;
}

export default EditExpenseForm