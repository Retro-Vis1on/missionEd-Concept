import { useReducer, useState } from "react"
import { updatePassword } from "../../apis/User"
import ObjCpy from "../../helpers/ObjCpy"
import Alert from "../UI/Alert/Alert"
import Button from "../UI/Button/Button"
import Input from "../UI/Input/Input"
import LoadingSpinner from "../UI/LoadingSpinner/LoadingSpinner"
import CustomModal from "../UI/Modal/Modal"
import classes from './Forms.module.css'
const initialState = {
    oldPassword: {
        value: "",
        isValid: false,
        isSubmitted: false,
    },
    newPassword: {
        value: "",
        isValid: false,
        isSubmitted: false,
    },
    confirmPassword: {
        value: "",
        isValid: false,
        isSubmitted: false,
    },
}
const reducer = (state, action) => {
    const updatedState = ObjCpy(state)
    if (action.type === "update") {
        updatedState[action.field].value = action.value
        updatedState[action.field].isValid = action.value.trim().length > 0
        if (action.field === "confirmPassword")
            updatedState[action.field].isValid = action.value.trim().length > 0 && action.value === updatedState.newPassword.value
    }
    else if (action.type === "submit") {
        for (let field in updatedState)
            updatedState[field].isSubmitted = true
    }
    else if (action.type === "resetValid")
        for (let field in updatedState)
            updatedState[field].isSubmitted = false
    return updatedState
}
let timer = null
const UpdatePassword = (props) => {
    const [password, dispatcher] = useReducer(reducer, initialState)
    const [isSending, sendingStateUpdater] = useState(0)
    const [error, errorStateUpdater] = useState(null)
    const inputChangeHandler = (event) => {
        dispatcher({ type: "update", field: event.target.name, value: event.target.value })
    }
    const formHandler = async (event) => {
        sendingStateUpdater(true)
        try {
            event.preventDefault()
            dispatcher({ type: "submit" })
            for (let field in password)
                if (!password[field].isValid) {
                    clearTimeout(timer)
                    timer = setTimeout(() => dispatcher({ type: "resetValid" }), 3000)
                    return sendingStateUpdater(false)

                }
            await updatePassword({ oldPassword: password.oldPassword.value, newPassword: password.newPassword.value })
            sendingStateUpdater(2)
            setTimeout(() => {
                props.onClose()
            }, 2000)
        }
        catch (err) {
            sendingStateUpdater(false)
            errorStateUpdater(err.message)
        }
    }
    return <>
        <Alert error={error} onClose={errorStateUpdater} />
        <CustomModal isOpen={props.isOpen} className={classes.modal}>
            {isSending === 2 ? <h2 className={classes.title}>Password successfully <span>updated!</span> 😄</h2> : <>
                <h2 className={classes.title}><span>Update</span> Password</h2>
                <form className={classes.form} onSubmit={formHandler}>
                    <Input placeholder="Old Password" name="oldPassword" onChange={inputChangeHandler} value={password.oldPassword.value} isValid={password.oldPassword.isSubmitted ? password.oldPassword.isValid : true} />
                    <Input placeholder="New Password" name="newPassword" onChange={inputChangeHandler} value={password.newPassword.value} isValid={password.newPassword.isSubmitted ? password.newPassword.isValid : true} />
                    <Input placeholder="Confirm New Password" name="confirmPassword" onChange={inputChangeHandler} value={password.confirmPassword.value} isValid={password.confirmPassword.isSubmitted ? password.confirmPassword.isValid : true} />
                    {isSending ? <div style={{ textAlign: "center" }}><LoadingSpinner /></div> :
                        <div className={classes.formActions}>
                            <Button onClick={props.onClose}>Discard</Button>
                            <Button type="submit">Update</Button>
                        </div>
                    }
                </form>
            </>}
        </CustomModal>
    </>
}
export default UpdatePassword