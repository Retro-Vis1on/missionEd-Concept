
import { configureStore } from '@reduxjs/toolkit'
import CachingReducer from './CachingSlice'
import UserReducer from './UserSlice'
import NotificationReducer from './NotificationSlice'
const Store = configureStore({
    reducer: {
        user: UserReducer,
        cache: CachingReducer,
        notifications: NotificationReducer
    }
})
export default Store