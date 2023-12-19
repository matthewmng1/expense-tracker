import { apiSlice } from "../../app/api/apiSlice"

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getUsers: builder.query({
      query: () => '/users',
      keepUnusedDataFor: 5,
    }),
    getUserByUsername: builder.query({
      query: ({username}) => ({
        url: `/users/${username}`,
      })
    }),
    getUserCategories: builder.query({
      query: ({username}) => ({
        url: `/users/${username}/categories`
      })
    }),
    getUserPaymentMethods: builder.query({
      query:({username}) => ({
        url: `users/${username}/paymentMethods`
      })
    }),
    editUser: builder.mutation({
      query: ({data, username}) => ({
        url: `/users/${username}`,
        method: 'PATCH',
        body: {...data}
      })
    }),
    addUserCategory: builder.mutation({
      query: ({data, username}) => ({
        url: `/users/${username}/categories`,
        method: 'POST',
        body: {data}
      })
    }),
    removeUserCategory: builder.mutation({
      query: ({ username, category }) => ({
        url: `/users/${username}/categories/${category}`,
        method: 'DELETE',
        body: {category}
      })
    }),
    addUserPaymentMethod: builder.mutation({
      query: ({data, username}) => ({
        url: `/users/${username}/paymentMethods`,
        method: 'POST',
        body: {data}
      })
    }),
    removeUserPaymentMethod: builder.mutation({
      query: ({ username, paymentMethod }) => ({
        url: `/users/${username}/paymentMethods/${paymentMethod}`,
        method: 'DELETE',
        body: {paymentMethod}
      })
    })
  })
})

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useGetUserByUsernameQuery,
  useGetUserCategoriesQuery,
  useGetUserPaymentMethodsQuery,
  useEditUserMutation,
  useAddUserCategoryMutation,
  useRemoveUserCategoryMutation,
  useAddUserPaymentMethodMutation,
  useRemoveUserPaymentMethodMutation,
} = usersApiSlice