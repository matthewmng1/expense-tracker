import React, { useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'
import { useGetUserCategoriesQuery, useAddUserCategoryMutation, useRemoveUserCategoryMutation } from './usersApiSlice';

import './UserCategories.css'

const UserCategories = () => {
  const { username } = useParams();
  const [userCategories, setUserCategories] = useState([])
  const [displayInput, setDisplayInput] = useState(false)
  const [newCategory, setNewCategory] = useState("")
  const [categoryToRemove, setCategoryToRemove] = useState("")
  const [addNewCategory] = useAddUserCategoryMutation();
  const [removeCategory] = useRemoveUserCategoryMutation();
  const [confirm, setConfirm] = useState("")

  const {
    data: fetchUserCategories,
    isLoading,
    isSuccess,
    isError,
    error,
    refetch
  } = useGetUserCategoriesQuery({
    username: username
  })
  
  useEffect(() => {
    if(isSuccess){
      setUserCategories(fetchUserCategories)
    }
  }, [isSuccess, fetchUserCategories])

  const handleAdd = async (e) => {
    e.preventDefault();

    if (userCategories.categories.includes(newCategory)) {
      console.log("Category", newCategory, 'already exists.');
      setNewCategory("")
      return;
    }
    if(!newCategory){
      console.log('Add Category field cannot be empty.')
      return;
    }
    const res = await addNewCategory({data: newCategory, username: username}).unwrap()
    console.log(res)
    setNewCategory("")
    setDisplayInput(false)
    refetch();
  }

  const handleNewCategory = e => setNewCategory(e.target.value)

  const handleRemove = (category) => {
    setCategoryToRemove(category);
    setConfirm(category)
  }

  const handleCancelRemove = () => {
    setCategoryToRemove("");
    setConfirm("");
  }

  
  const confirmRemove = async (e) => {
    console.log(categoryToRemove)
    const res = await removeCategory({category: categoryToRemove, username: username})
    console.log(res)
    setCategoryToRemove("")
    setConfirm("")
    refetch();
  }

  let content;
  if(isLoading){
    content = <p>Loading...</p>
  } else if(isSuccess && userCategories.categories){
    console.log(userCategories)
      content = (
        <div className='categories-wrapper'>
          <h1>Edit Categories</h1>
            {displayInput ? (
                  <form onSubmit={handleAdd} className="new-category-form">
                    <input
                      type="text"
                      id="newCategory"
                      value={newCategory}
                      onChange={handleNewCategory}
                      className="new-category-input"
                    />&nbsp;&nbsp;
                    <button className="category-add-btn">Add</button> &nbsp;
                    <button onClick={() => setDisplayInput(false)} className="category-cancel-btn">Cancel</button>
                  </form>
                ) : (
                  <div>
                    <button onClick={() => setDisplayInput(true)} className="new-category-btn"> + New Category </button>
                  </div>
                  )
                }
            <div className='categories-container'>
                {userCategories.categories.map(c => (
                  <React.Fragment key={c}>
                    <input 
                      key={c}
                      value={c} 
                      readOnly
                      className='user-category'
                    /> &nbsp;
                    { confirm === c ? (
                      <>
                        <button onClick={confirmRemove} className="category-confirm-remove-btn"> Confirm </button> &nbsp;
                        <button onClick={handleCancelRemove} className="category-cancel-remove-btn">Cancel</button>
                      </>
                    ) : (
                      <button onClick={() => handleRemove(c)} className="category-remove-btn"> x </button>
                    )}
                    <br/>
                  </React.Fragment>
                ))
                }
            </div>
        </div>
    )
  } else if(isError){
    console.log(error)
  }


  return content;
}

export default UserCategories