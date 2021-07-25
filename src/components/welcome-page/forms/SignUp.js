import Button from '../../UI/Button/Button'
import Input from '../../UI/Input/Input'
import { useReducer, useState } from 'react'
import ObjCpy from '../../../helpers/ObjCpy'
import emailValidator from '../../../helpers/emailValidator'
import classes from './Form.module.css'
import { signUpState } from './IntialStates'
import { createUser, loginWithGoogle, signUpWithEmail } from '../../../apis/User'
import { useHistory } from 'react-router-dom'
import LoadingSpinner from '../../UI/LoadingSpinner/LoadingSpinner'
import Alert from '../../UI/Alert/Alert'
const reducer = (state, action) => {
    const updatedState = ObjCpy(state)
    if (action.type === "update") {
        updatedState[action.field].value = action.value
        updatedState[action.field].isValid = action.field === "email" ? emailValidator(action.value) : action.value.trim().length > 0
        if (action.field === "confirmPassword")
            updatedState[action.field].isValid = action.value.trim().length > 0 && action.value === updatedState.password.value
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
const SignUp = (props) => {
    const [signupCred, dispatcher] = useReducer(reducer, ObjCpy(signUpState))
    const [error, errorStateUpdater] = useState(null)
    const history = useHistory()
    const [isSending, sendingStateUpdater] = useState(false)
    const inputChangeHandler = (event) => {
        dispatcher({ type: "update", field: event.target.name, value: event.target.value })
    }
    const formHandler = async (event) => {
        event.preventDefault()
        try {
            sendingStateUpdater(true)
            dispatcher({ type: "submit" })
            let data = {}
            for (let field in signupCred) {
                if (!signupCred[field].isValid) {
                    clearTimeout(timer)
                    timer = setTimeout(() => dispatcher({ type: "resetValid" }), 3000)
                    return sendingStateUpdater(false)

                }
                else if (!field.includes('word')) data[field] = signupCred[field].value
            }
            await signUpWithEmail(signupCred.email.value, signupCred.password.value)
            await createUser(data)
        }
        catch (err) {
            sendingStateUpdater(false)
            errorStateUpdater(err.message)
        }
    }
    const googleHandler = async () => {
        const isExists = await loginWithGoogle()
        if (!isExists)
            props.changeState(3)
        else history.replace('/')
    }
    return <>
        <Alert error={error} onClose={errorStateUpdater.bind(this, null)} />
        <header className={classes.header}>
            <h3>Let's get <span>started</span></h3>
        </header>
        <form onSubmit={formHandler} className={classes.form}>
            <div className={classes.siblingFields}>
                <Input type="text" placeholder="Enter Name" name="name" onChange={inputChangeHandler} isValid={signupCred.name.isSubmitted ? signupCred.name.isValid : true} value={signupCred.name.value} />
                <Input type="text" placeholder="Enter Username" name="username" onChange={inputChangeHandler} isValid={signupCred.username.isSubmitted ? signupCred.username.isValid : true} value={signupCred.username.value} />
            </div>
            <Input type="email" placeholder="Email" name="email" onChange={inputChangeHandler} isValid={signupCred.email.isSubmitted ? signupCred.email.isValid : true} value={signupCred.email.value} />
            <div className={classes.siblingFields}>
                <Input type="password" placeholder="Password" name="password" onChange={inputChangeHandler} isValid={signupCred.password.isSubmitted ? signupCred.password.isValid : true} value={signupCred.password.value} />
                <Input type="password" placeholder="Confirm Password" name="confirmPassword" onChange={inputChangeHandler} isValid={signupCred.confirmPassword.isSubmitted ? signupCred.confirmPassword.isValid : true} value={signupCred.confirmPassword.value} />
            </div>
            {isSending ? <div style={{ textAlign: "center" }}> <LoadingSpinner /></div> :
                <div className={classes.formActions}>
                    <Button onClick={props.onClose}>Cancel</Button>
                    <Button type="submit">Sign Up</Button>
                </div>
            }
        </form>
        {
            !isSending &&
            <div className={classes.additionalActions}>
                <div className={classes.google}>
                    <p>Continue with <i className="fab fa-google" onClick={googleHandler}></i></p>
                </div>
                <p>Already have an account? <button onClick={props.changeState.bind(this, 0)} className={classes.btn}>Sign in</button></p>
            </div>
        }
    </>
}
export default SignUp