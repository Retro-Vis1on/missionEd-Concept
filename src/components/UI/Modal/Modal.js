import Modal from 'react-modal'
import classes from './Modal.module.css'
const CustomModal = (props) => {
    return <Modal isOpen={props.isOpen} ariaHideApp={false} className={`${classes.modal} ${props.className ? props.className : ''} ${!props.isOpen ? classes.closeModal : ''}`} overlayClassName={`${classes.overlay} ${props.overlayClass ? props.overlayClass : ''} ${!props.isOpen ? classes.closeOverlay : ''}`} preventScroll={true} closeTimeoutMS={300}>
        {props.children}
    </Modal>
}
export default CustomModal