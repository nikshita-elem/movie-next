import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'

export interface UserState {
    user: {
        userId: string,
        email: string
    }
}

const initialState: UserState = {
    user: {
        userId: '',
        email: ''
    }
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<UserState['user']>) => {
            state.user.email = action.payload.email
            state.user.userId = action.payload.userId
        },
        clearUser: state => {
            state.user = {
                userId: '',
                email: ''
            }
        }
    }
})

export const { setUser, clearUser } = userSlice.actions

export const selectUser = (state: RootState) => state.user.user

export default userSlice.reducer
