
import { configureStore } from '@reduxjs/toolkit'
import CachingReducer from './CachingSlice'
import UserReducer from './UserSlice'
const Store = configureStore({
    reducer: {
        user: UserReducer,
        cache: CachingReducer
    }
})
export default Store