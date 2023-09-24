import { configureStore } from '@reduxjs/toolkit'
import { uspApi } from "../slices/apiSlice";
import { projectSlice } from "../slices/projectSlice";
import { detailsSlice } from '../slices/detailsSlice';
import { loginSlice } from '../slices/loginSlice';


export const store = configureStore({
  reducer: {
    project: projectSlice.reducer,
    details: detailsSlice.reducer,
    login: loginSlice.reducer,
    [uspApi.reducerPath]: uspApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(uspApi.middleware),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch