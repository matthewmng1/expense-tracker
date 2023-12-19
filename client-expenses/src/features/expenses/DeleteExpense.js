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
    {confirmed ? (
      <React.Fragment>
        <p>Are you sure you want to delete this expense?</p>
        <button onClick={handleDelete}>Yes, Delete</button>
        <button onClick={() => setConfirmed(false)}>Cancel</button>
      </React.Fragment>
      ) : (
        <button onClick={handleConfirmDelete}>Delete</button>
      )}
    </div>
  )
  return content;
}

export default DeleteExpense;