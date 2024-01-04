import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setCredentials, logOut } from '../../features/auth/authSlice'

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.REACT_RENDER_URL || `http://localhost:3001/` || `http://localhost:${process.env.REACT_RENDER_PORT}`,
  credentials: 'include',
  prepareHeaders: async (headers, { getState }) => {
    const token = getState().auth.token
    if(token){
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  }
})

const baseQueryWithReauth = async(args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)
  if(result?.error?.originalStatus === 403){
    const refreshResult = await baseQuery('/refresh', api, extraOptions);
    if(refreshResult?.data){
      const user = api.getState().auth.user
      console.log(user)
      api.dispatch(setCredentials({ ...refreshResult.data, user }));
      result = await baseQuery(args, api, extraOptions);
    } else {
      console.log("logged out")
      api.dispatch(logOut())
    }
  }
  return result;
}

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: builder => ({})
})