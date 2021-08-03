import Button from '../../UI/Button/Button'
import Input from '../../UI/Input/Input'
import classes from './Form.module.css'
import { useEffect, useReducer, useState } from 'react'
import { reducer, signInState } from './IntialStates'
import ObjCpy from '../../../helpers/ObjCpy'
import LoadingSpinner from '../../UI/LoadingSpinner/LoadingSpinner'
import { useHistory } from 'react-router-dom'
import { Login, loginWithGoogle } from '../../../apis/User'
import Alert from '../../UI/Alert/Alert'
import ReactGa from 'react-ga'
let timer = null
const SignIn = (props) => {
    useEffect(() => ReactGa.modalview(`Sign In`), [])
    const [signinCred, dispatcher] = useReducer(reducer, ObjCpy(signInState))
    const [isSending, sendingStateUpdater] = useState(false)
    const [error, errorStateUpdater] = useState(null)
    const history = useHistory()
    const inputChangeHandler = (event) => {
        dispatcher({ type: "update", field: event.target.name, value: event.target.value })
    }
    const formHandler = async (event) => {
        sendingStateUpdater(true)
        try {
            event.preventDefault()
            dispatcher({ type: "submit" })
            for (let field in signinCred)
                if (!signinCred[field].isValid) {
                    clearTimeout(timer)
                    timer = setTimeout(() => dispatcher({ type: "resetValid" }), 3000)
                    return sendingStateUpdater(false)

                }
            await Login(signinCred.email.value, signinCred.password.value)
            history.replace('/')
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
            <h3><span>Ready</span> to jump back in?</h3>
        </header>
        <form className={classes.form} onSubmit={formHandler}>
            <Input type="email" placeholder="Email" name="email" onChange={inputChangeHandler} value={signinCred.email.value} isValid={signinCred.email.isSubmitted ? signinCred.email.isValid : true} disabled={isSending || !props.isOpen} />
            <Input type="password" placeholder="Password" name="password" onChange={inputChangeHandler} isValid={signinCred.password.isSubmitted ? signinCred.password.isValid : true} value={signinCred.password.value} disabled={isSending || !props.isOpen} />
            {isSending ? <div style={{ textAlign: "center" }}> <LoadingSpinner /></div> :
                <div className={classes.formActions}>
                    <Button onClick={props.onClose} disabled={isSending || !props.isOpen}>Cancel</Button>
                    <Button type="submit" disabled={isSending || !props.isOpen}>Sign In</Button>
                </div>
            }
        </form>
        {!isSending && <div className={classes.additionalActions}>
            <div className={classes.google}>
                <p>Continue with </p><i className="fab fa-google" onClick={() => { if (props.isOpen) googleHandler() }}></i>
            </div>
            <div className={classes.stateHandler}>
                <p>New here?<button onClick={props.changeState.bind(this, 1)} className={classes.btn} disabled={isSending || !props.isOpen}>Sign up here</button></p>
                <button onClick={props.changeState.bind(this, 2)} className={classes.btn} disabled={isSending || !props.isOpen}>Forgot Password?</button>
            </div>
        </div>}
    </>
}
export default SignIn