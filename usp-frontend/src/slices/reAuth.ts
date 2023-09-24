import { fetchBaseQuery } from '@reduxjs/toolkit/query'
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query'
import {setNoRight} from "./loginSlice";
import {api_url} from "../utils/urls";

function deleteCookies() {
  document.cookie = 'access_token_content=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  document.cookie = 'refresh_token_content=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

const baseQuery = fetchBaseQuery({ baseUrl: api_url })
export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)
  if (result.error && result.error.status === 401) {
    const refreshResult = await baseQuery({url: 'auth/refresh', method: 'POST'}, api, extraOptions)
    if (!!refreshResult.meta && !!refreshResult.meta.response && refreshResult.meta.response.status === 200) {
      result = await baseQuery(args, api, extraOptions)
    } else {
      api.dispatch(setNoRight())
      deleteCookies()
    }
  }
  return result
}