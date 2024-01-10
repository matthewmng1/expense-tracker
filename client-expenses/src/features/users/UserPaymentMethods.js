import React, { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useGetUserPaymentMethodsQuery, useAddUserPaymentMethodMutation, useRemoveUserPaymentMethodMutation } from './usersApiSlice'

import './UserPaymentMethods.css'

const UserPaymentMethods = () => {
  const { username } = useParams();
  const errRef = useRef();
  const [userPaymentMethods, setUserPaymentMethods] = useState([])
  const [displayInput, setDisplayInput] = useState(false)
  const [newPaymentMethod, setNewPaymentMethod] = useState("")
  const [paymentMethodToRemove, setPaymentMethodToRemove] = useState("")
  const [addNewPaymentMethod] = useAddUserPaymentMethodMutation();
  const [removePaymentMethod] = useRemoveUserPaymentMethodMutation();
  const [confirm, setConfirm] = useState("")
  const [errMsg, setErrMsg] = useState('')

  

  const {
    data: fetchUserPaymentMethods, 
    isLoading, 
    isSuccess, 
    isError, 
    error, 
    refetch 
  } = useGetUserPaymentMethodsQuery({ 
    username: username
  })

  useEffect(() => {
    if(isSuccess){
      setUserPaymentMethods(fetchUserPaymentMethods)
    }
  }, [isSuccess, fetchUserPaymentMethods])

  const handleAdd = async (e) => {
    e.preventDefault();

    if (userPaymentMethods.paymentMethods.includes(newPaymentMethod)) {
      setErrMsg(`Payment Method "${newPaymentMethod}" already exists.`);
      setNewPaymentMethod("")
      return;
    } else if(!newPaymentMethod){
      setErrMsg(`"Add Payment Method" field cannot be empty.`)
      return;
    } else {
    const res = await addNewPaymentMethod({data: newPaymentMethod, username: username}).unwrap()
    setNewPaymentMethod("")
    refetch();
    }
  }

  const handleNewPaymentMethod = e => setNewPaymentMethod(e.target.value)

  const handleRemove = (paymentMethod) => {
    setPaymentMethodToRemove(paymentMethod);
    setConfirm(paymentMethod)
  }

  const confirmRemove = async (e) => {
    // console.log(paymentMethodToRemove)
    const res = await removePaymentMethod({paymentMethod: paymentMethodToRemove, username: username})
    console.log(res)
    setPaymentMethodToRemove("")
    setConfirm("")
    refetch();
  }
  
  let content; 
  if(isLoading){
    content = <p>Loading...</p>
  } else if (isSuccess && userPaymentMethods.paymentMethods){
    // console.log(userPaymentMethods)
    content = (
      <div className='payment-method-wrapper'>
        <h1>Edit Payment Methods</h1>
        <p ref={errRef} className={errMsg?"errmsg" : "offscren"}aria-live="assertive">{errMsg}</p>
          {displayInput ? (
            <form onSubmit={handleAdd} className='payment-method-add-form'>
              <input
                type="text"
                id="newPaymentMethod"
                value={newPaymentMethod}
                onChange={handleNewPaymentMethod}
                className='new-payment-method-input'
              />&nbsp;
            <button className='payment-method-add-btn'>Add</button>&nbsp;
            <button onClick={() => setDisplayInput(false)} className='payment-method-cancel-btn'>Cancel</button>
            </form>
          ) : (
            <div>
              <button onClick={() => setDisplayInput(true)} className='new-payment-method-btn'> + New Payment Method </button>
            </div>
          )
        }
        <div className='payment-method-container'>
          {userPaymentMethods.paymentMethods.map(pm => (
            <React.Fragment key={pm}>
              <input
                key={pm}
                value={pm}
                readOnly
                className='user-payment-method'
              /> &nbsp; 
              { confirm === pm ? (
                <>
                  <button onClick={confirmRemove} className='payment-method-confirm-remove-btn'>Confirm Remove</button>&nbsp;
                  <button onClick={() => setConfirm("")} className='payment-method-cancel-btn'>Cancel</button>
                </>
              ) : (
                  <button onClick={() => handleRemove(pm)} className='payment-method-remove-btn'> x </button>            
              )}
              <br/>
            </React.Fragment>
          ))}
        </div>
      </div>
    )
  } else if (isError){
    console.log(error)
  }
  return content;
}

export default UserPaymentMethods