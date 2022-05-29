import { useEffect } from "react"
import { useSelector } from "react-redux"
import { markAsSeen } from "../../apis/User"
import LoadingSpinner from "../UI/LoadingSpinner/LoadingSpinner"
import NotificationItem from "./Notification-Item"
import classes from './Notification.module.css'
let isMounted = true
const Notifications = () => {
  const { notifications, unseen, isLoading } = useSelector(state => state.notifications)
  useEffect(() => {
    isMounted = true
    return () => isMounted = false
  }, [])
  useEffect(() => {
    return () => {
      if (!isMounted)
        markAsSeen(unseen)
    }
  }, [unseen])
  if (isLoading)
    return <div style={{ textAlign: "center" }}><LoadingSpinner /></div>
  if (!notifications.length)
    return <p className={classes.empty}>You have no notifications</p>

  return <ul className={classes.notifications}>
    {notifications.map(notification => <NotificationItem {...notification} key={notification.id} />)}
  </ul>
}
export default Notifications