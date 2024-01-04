import React, { useState } from "react"
import { useDeleteUserExpenseMutation } from './expensesApiSlice';

const DeleteExpense = ({ username, expenseId }) => {
  const [deleteUserExpense] = useDeleteUserExpenseMutation();
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirmDelete = () => {
    setConfirmed(true);
    // You can trigger the actual deletion here if needed
  };

  const handleDelete = async (e) => {
    try{
      const response = await deleteUserExpense({username, expenseId}).unwrap()
      console.log(response)
      window.location.reload()
    } catch(err){
      console.log(err)
    }
  }

  let content = (
    <div>
    {/* {confirmed ? (
      <React.Fragment>
        <button className='delete-expense-btn' onClick={handleDelete}>Confirm</button>
        <button className='delete-expense-btn' onClick={() => setConfirmed(false)}>Cancel</button>
      </React.Fragment>
      ) : ( */}
        <button className='delete-expense-btn' onClick={handleDelete}>Delete</button>
      {/* )} */}
    </div>
  )
  return content;
}

export default DeleteExpense;