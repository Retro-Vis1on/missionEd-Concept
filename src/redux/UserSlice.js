import { createSlice } from "@reduxjs/toolkit";
import ObjCpy from "../helpers/ObjCpy";
const InitialUserState = {
    bio: null,
    coins: 0,
    education: null,
    email: null,
    following: [],
    location: null,
    name: null,
    profile_image: null,
    saved: [],
    applied: [],
    interested_products: [],
    is_recruiter: false,
    looking_for: [],
    username: null,
    isLoggedIn: -1
}
const userSlice = createSlice({
    name: 'user',
    initialState: ObjCpy(InitialUserState),
    reducers: {
        onLoad(state, action) {
            state.isLoggedIn = true
        },
        userLogin(state, action) {
            for (let field in state) {
                if (action.payload[field])
                    state[field] = action.payload[field]
            }
        },
        userLogout(state, action) {
            const freshState = ObjCpy(InitialUserState)
            for (let field in state) {
                state[field] = freshState[field]
            }
            state.isLoggedIn = false
        },
        userDataUpdater(state, action) {
            for (let field in state) {
                if (action.payload[field])
                    state[field] = action.payload[field]
            }
        }
    }
})
export default userSlice.reducer
export const UserActions = userSlice.actions