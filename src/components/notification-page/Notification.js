import { useEffect } from "react"
import { useSelector } from "react-redux"
import { markAsSeen } from "../../apis/User"
import NotificationItem from "./Notification-Item"
import classes from './Notification.module.css'
let isMounted = true
const Notifications = () => {
  useEffect(() => {
    isMounted = true
    return () => isMounted = false
  }, [])
  const { notifications, unseen } = useSelector(state => state.notifications)
  useEffect(() => {
    return () => {
      if (!isMounted)
        markAsSeen(unseen)
    }
  }, [unseen])
  if (!notifications.length)
    return <p className={classes.empty}>You have no notifications</p>
  return <ul className={classes.notifications}>
    {notifications.map(notification => <NotificationItem {...notification} key={notification.id} />)}
  </ul>
}
export default Notifications