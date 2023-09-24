import { uspApi } from './apiSlice'



const loginApi = uspApi.injectEndpoints({
  endpoints: (build) => ({
    getToken: build.mutation<any, any>({
      query: (data) => ({
        url: `auth/login`,
        method: 'POST',
        body: new URLSearchParams({...data, password: btoa(data.password)}),
        credentials: 'include',
      })
    }),
    createUser: build.mutation<any, any>({
      query: (data) => ({
        url: `auth/create_user`,
        method: 'POST',
        body: {...data, password: btoa(data.password)},
      })
    }),
    resetPassword: build.mutation<any, any>({
      query: (data) => ({
        url: `auth/reset_password`,
        method: 'POST',
        body: {...data, password: btoa(data.password)},
      })
    }),
  }),
  overrideExisting: false,
})



export const {
    useGetTokenMutation,
    useCreateUserMutation,
    useResetPasswordMutation
} = loginApi