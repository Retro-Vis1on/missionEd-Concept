import { createSlice } from "@reduxjs/toolkit";
import ObjCpy from "../helpers/ObjCpy";
const InitialNotificationsState = {
    notifications: [],
    unseen: []
}
const notificationsSlice = createSlice({
    name: 'notifications',
    initialState: ObjCpy(InitialNotificationsState),
    reducers: {
        updateNotifications(state, action) {
            let { notifications } = action.payload
            notifications.sort((notification1, notification2) => notification1.data.timestamp < notification2.data.timestamp ? 1 : -1);
            state.notifications = notifications
            let unseen = notifications.filter(notification => notification.data.seen === false)
            state.unseen = unseen
        },
        userLogout(state, action) {
            state.notifications = []
        },
    }
})
export default notificationsSlice.reducer
export const NotificationsActions = notificationsSlice.actions