import { useState } from "react"
import Alert from "../../UI/Alert/Alert"
import Button from "../../UI/Button/Button"
import LoadingSpinner from "../../UI/LoadingSpinner/LoadingSpinner"
import CustomModal from "../../UI/Modal/Modal"
import classes from './DeleteModal.module.css'
const DeleteModal = (props) => {
    const [isLoading, loadingStateUpdater] = useState(false)
    const [error, errorStateUpdater] = useState(null)
    const deleteHandler = async () => {
        try {
            loadingStateUpdater(true)
            props.deleteHandler()
        }
        catch (err) {
            loadingStateUpdater(false)
            errorStateUpdater("Something went wrong on our end!")
            props.onClose();
        }
    }
    return <>
        <Alert error={error} onClose={errorStateUpdater.bind(this, null)} />
        <CustomModal isOpen={props.open} className={classes.modal}>
            <h2 className={classes.title}>
                Are you sure you want to delete this {props.type}?
            </h2>
            {isLoading ?
                <div style={{ textAlign: "center", marginTop: "10px" }}><LoadingSpinner /></div> :
                <div className={classes.modalActions}>
                    <Button onClick={props.onClose}>Cancel</Button>
                    <Button onClick={deleteHandler}>Delete</Button>
                </div>
            }

        </CustomModal>
    </>
}
export default DeleteModal