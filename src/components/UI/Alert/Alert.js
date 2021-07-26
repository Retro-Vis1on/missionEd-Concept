import Button from '../Button/Button'
import Modal from '../Modal/Modal'
import classes from './Alert.module.css'
const Alert = (props) => {
    return <Modal isOpen={props.error !== null} className={classes.modal}>
        <div className={classes.alert}>
            <h2>{props.error}</h2>
            <Button onClick={props.onClose}>Okay</Button>
        </div>
    </Modal>
}
export default Alert