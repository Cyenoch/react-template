import type { StateCreator } from 'zustand'

export interface UserSlice {
  user: undefined
  setUser: (user: UserSlice['user']) => void
}

export const createUserSlice: StateCreator<
  UserSlice,
  [],
  [],
  UserSlice
>
  = set => ({
    user: undefined,
    setUser: user => set({ user }),
  })
