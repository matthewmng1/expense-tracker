import { createSlice } from "@reduxjs/toolkit";

const expensesSlice = createSlice({
  name: 'expenses',
  initialState: {
    date: null,
    description: null,
    amount: null,
    category: null,
    paymentMethod: null,
    _id: null
  },
  reducers: {
    editExpenses: (state, action) => {
      const {date, description, amount, category, paymentMethod, _id} = action.payload;
      state.date = date;
      state.description = description;
      state.amount = amount;
      state.category = category;
      state.paymentMethod = paymentMethod;
      state._id = _id;
    },
  }
})

export const { editExpenses } = expensesSlice.actions;

export default expensesSlice.reducer