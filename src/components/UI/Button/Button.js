import classes from './Button.module.css'
import { isMobile } from "react-device-detect";
const Button = (props) => {
    const btnclass = `${classes.button} ${props.className ? props.className : ''}`
    return <button className={btnclass} type={props.type ? props.type : 'button'} onClick={!isMobile ? props.onClick : null} onTouchStart={isMobile ? props.onClick : null} disabled={props.disabled}>{props.children}</button>
}
export default Button