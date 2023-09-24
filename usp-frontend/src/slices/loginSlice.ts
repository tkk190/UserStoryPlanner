import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export const AllReadwriteTypes = ['read', 'write', 'none'] as const;
export type ReadwriteTypeTuple = typeof AllReadwriteTypes;
export type ReadwriteType = ReadwriteTypeTuple[number];

const initialState: { readwrite: ReadwriteType } = {
  readwrite: 'none'
}



export const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    setNoRight: (state) => {
      state.readwrite = 'none'
    },
    setReadRight: (state) => {
      state.readwrite = 'read'
    },
    setWriteRight: (state) => {
      state.readwrite = 'write'
    },
    setRight: (state, action: PayloadAction<ReadwriteType>) => {
      state.readwrite = action.payload
    },
  },
})

export const {
    setReadRight,
    setWriteRight,
    setNoRight,
    setRight
} = loginSlice.actions


export default loginSlice.reducer