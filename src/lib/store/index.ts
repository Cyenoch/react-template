import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { type UserSlice, createUserSlice } from './user'

export * from './user'

type BoundState = UserSlice

export const useBoundStore = create<BoundState>()(devtools(
  (...a) => ({
    ...createUserSlice(...a),
  }),
))

export const useUser = () => useBoundStore(s => s.user)
