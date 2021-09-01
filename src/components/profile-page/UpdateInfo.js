import { useEffect, useReducer, useState } from "react"
import { updateProfile } from "../../apis/User"
import ObjCpy from "../../helpers/ObjCpy"
import Alert from "../UI/Alert/Alert"
import Button from "../UI/Button/Button"
import Input from "../UI/Input/Input"
import LoadingSpinner from "../UI/LoadingSpinner/LoadingSpinner"
import CustomModal from "../UI/Modal/Modal"
import Textarea from "../UI/Textarea/Textarea"
import classes from './Forms.module.css'
const initialState = {
    bio: {
        value: "",
        isValid: false,
        isSubmitted: false,
    },
    username: {
        value: "",
        isValid: false,
        isSubmitted: false,
    },
    name: {
        value: "",
        isValid: false,
        isSubmitted: false,
    },
    education: {
        value: "",
        isValid: false,
        isSubmitted: false,
    },
    location: {
        value: "",
        isValid: false,
        isSubmitted: false,
    },
}
const reducer = (state, action) => {
    const updatedState = ObjCpy(state)
    if (action.type === "mount") {
        const { bio,username , name, education, location } = action
        if (bio) {
            updatedState.bio.value = bio
            updatedState.bio.isValid = true
        }
        if (name) {
            updatedState.name.value = name
            updatedState.name.isValid = true
        }
        if (username) {
            updatedState.username.value = username
            updatedState.username.isValid = true
        }
        if (education) {
            updatedState.education.value = education
            updatedState.education.isValid = true
        }
        if (location) {
            updatedState.location.value = location
            updatedState.location.isValid = true
        }
    }
    if (action.type === "update") {
        updatedState[action.field].value = action.value
        updatedState[action.field].isValid = action.value.trim().length > 0
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
const UpdateInfo = (props) => {
    const [info, dispatcher] = useReducer(reducer, initialState)
    useEffect(() => {
        dispatcher({ type: "mount", ...props.user })
    }, [props.user])
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
            for (let field in info)
                if (!info[field].isValid) {
                    clearTimeout(timer)
                    timer = setTimeout(() => dispatcher({ type: "resetValid" }), 3000)
                    return sendingStateUpdater(false)

                }
            const data = {
                username : info.username.value,
                bio: info.bio.value,
                name: info.name.value,
                education: info.education.value,
                location: info.location.value,
            }
            await updateProfile(data)
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
        <Alert error={error} onClose={errorStateUpdater.bind(this, null)} />
        <CustomModal isOpen={props.isOpen} className={classes.modal}>
            {isSending === 2 ? <h2 className={classes.title}>Profile successfully <span>updated!</span> 😄</h2> : <>
                <h2 className={classes.title}><span>Update</span> Profile</h2>
                <form onSubmit={formHandler} className={classes.form}>
                    <Input placeholder="UserName" name="username" onChange={inputChangeHandler} value={info.username.value} isValid={info.username.isSubmitted ? info.username.isValid : true} />
                    <Input placeholder="Name" name="name" onChange={inputChangeHandler} value={info.name.value} isValid={info.name.isSubmitted ? info.name.isValid : true} />
                    <Textarea placeholder="Bio" name="bio" onChange={inputChangeHandler} value={info.bio.value} isValid={info.bio.isSubmitted ? info.bio.isValid : true} />
                    <Input placeholder="Education" name="education" onChange={inputChangeHandler} value={info.education.value} isValid={info.education.isSubmitted ? info.education.isValid : true} />
                    <Input placeholder="Location" name="location" onChange={inputChangeHandler} value={info.location.value} isValid={info.location.isSubmitted ? info.name.isValid : true} />
                    {isSending ? <div style={{ textAlign: "center" }}><LoadingSpinner /></div> :
                        <div className={classes.formActions}>
                            <Button onClick={props.onClose}>Discard</Button>
                            <Button type="submit">Update</Button>
                        </div>
                    }
                </form></>}
        </CustomModal></>
}
export default UpdateInfo