import { create } from 'zustand'
import { type UserSlice, createUserSlice } from './user'

import {devtools} from 'zustand/middleware'

export * from './user'

type BoundState = UserSlice

export const useBoundStore = create<BoundState>()(devtools(
  (...a) => ({
    ...createUserSlice(...a),
  })
))

export const useTgUser = useBoundStore(s => s.user)
