// All fields: date, description, amount, category, payment method
// On submit, send the information to 

import React, { useRef, useState } from 'react';
import moment from 'moment';
import { useAddNewUserExpenseMutation } from './expensesApiSlice'
import "./NewExpense.css"

const NewExpense = ({username, categories, paymentMethods, refetch, toggleDisplay}) => {
  const errRef = useRef();
  const currentDate = moment().format('YYYY[-]MM[-]DD')
  const [expenseData, setExpenseData] = useState({
    date: currentDate,
    description: "",
    amount: "",
    category: categories[0],
    paymentMethod: paymentMethods[0],
  })
  const [errMsg, setErrMsg] = useState('')

  const [ addNewUserExpense ] = useAddNewUserExpenseMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // console.log(expenseData.date)
    // console.log(username)
    try{
      // Make the API call to add a new expense
      const response = await addNewUserExpense({data: expenseData, username: username}).unwrap();

      // Reset the form after successful submission
      setExpenseData({
        date: currentDate,
        description: '',
        amount: '',
        category: categories[0],
        paymentMethod: paymentMethods[0],
      });
      
      window.location.reload();
    } catch (err) {
      if(err.status === 400){
        setErrMsg('You must fill all inputs.')
      }
    }
  }

  const handleChange = async (e) => {
    const { name, value } = e.target;
    const newValue = e.target.type === 'select-one' ? e.target.value : value;
    setExpenseData(data => ({...data, [name]: newValue}))
  }
    let content;
    content = (
      <div className='form-popup' id='new-expense-form'>
        <div className='new-expense-container'>
          <form className='new-expense-form' onSubmit={handleSubmit}>
            <table className='new-expense-table'>
              <thead>
                <tr>
                  <th className='new-expense-table-header' colSpan="3">Add New Expense</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <input
                      type="date"
                      name="date"
                      value={expenseData.date}
                      onChange={handleChange}
                      className="new-expense-date-input"
                    />
                  </td>
                  <td colSpan="2">
                    <input
                      type="text"
                      name="description"
                      value={expenseData.description}
                      onChange={handleChange}
                      placeholder="description"
                      className='new-expense-description-input'
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <select
                      name="category"
                      value={expenseData.category}
                      onChange={handleChange}
                      className='new-expense-category-input'
                    >
                      {categories.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      type="number"
                      name="amount"
                      step="0.01"
                      min="0"
                      value={expenseData.amount}
                      onChange={handleChange}
                      placeholder="amount"
                      className='new-expense-amount-input'
                    />
                  </td>
                  <td>
                    <select
                        name="paymentMethod"
                        value={expenseData.paymentMethod}
                        onChange={handleChange}
                        className='new-expense-paymentMethod-input'
                      >
                        {paymentMethods.map(pm => (
                          <option key={pm}>{pm}</option>
                        ))}
                      </select>
                  </td>
                </tr>
                <tr>
                <p ref={errRef} className={errMsg?"errmsg" : "offscren"}aria-live="assertive">{errMsg}</p>
                  <td className='new-expense-form-btn-container' colSpan="3">
                    <button onClick={() => toggleDisplay()} className='new-expense-form-cancel-btn'>Cancel</button>
                    <button className='new-expense-form-save-btn'>Save</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </form>
        </div>
      </div>
    )

  return content;
}

export default NewExpense