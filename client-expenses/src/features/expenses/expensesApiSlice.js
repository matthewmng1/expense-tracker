import { apiSlice } from "../../app/api/apiSlice"

export const expensesApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getUserExpenses: builder.query({
      query: ({username}) => ({
        url: `/expenses/${username}/allExpenses`
      })
    }),
    getRecentExpenses: builder.query({
      query: ({username, currentDate, lastWeekDate}) => ({
        url: `/expenses/${username}/recent`,
        params: {
          currentDate: currentDate,
          lastWeekDate: lastWeekDate
        }
      })
    }),
    getMonthlyExpenses: builder.query({
      query: ({username}) => ({
        url: `/expenses/${username}/monthlyTotals`
      })
    }),
    getYearlyExpenses: builder.query({
      query: ({username, year}) => ({
        url: `/expenses/${username}/yearlyTotals`,
        params: {
          year: year
        }
      })
    }),
    getCategoryExpenses: builder.query({
      query: ({username}) => ({
        url: `expenses/${username}/categoryTotals`
      })
    }),
    getCategories: builder.query({
      query: ({username}) => ({
        url: `expenses/${username}/categories`
      })
    }),
    addNewUserExpense: builder.mutation({
      query: ({data, username}) => ({
        url: `/expenses/${username}/addExpense`,
        method: 'POST',
        body: {... data}
    })
    }),
    editUserExpense: builder.mutation({
      query: ({data, username, expenseId}) => ({
        url: `/expenses/${username}/${expenseId}`,
        method: 'PATCH',
        body: {... data}
      })
    }),
    deleteUserExpense: builder.mutation({
      query: ({username, expenseId }) => ({
        url:  `/expenses/${username}/${expenseId}`,
        method: 'DELETE',
      })
    }),
  })
})

export const {
  useGetUserExpensesQuery,
  useAddNewUserExpenseMutation,
  useDeleteUserExpenseMutation,
  useEditUserExpenseMutation,
  useGetRecentExpensesQuery,
  useGetMonthlyExpensesQuery,
  useGetYearlyExpensesQuery,
  useGetCategoryExpensesQuery,
  useGetCategoriesQuery,
} = expensesApiSlice;