import { createSlice } from "@reduxjs/toolkit";
const userSlice = createSlice({
    name: 'user',
    initialState: {
        bio: null,
        coins: 0,
        education: null,
        email: null,
        following: [],
        location: null,
        name: null,
        profile_image: null,
        saved: [],
        username: null
    },
    reducers: {
        userLogin(state, action) {
            for (let field in state) {
                if (action.payload[field])
                    state[field] = action.payload[field]
            }
        },
        userLogout(state, action) {
            for (let field in state) {
                if (field === "following" || field === "saved")
                    state[field] = []
                else state[field] = null
            }
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