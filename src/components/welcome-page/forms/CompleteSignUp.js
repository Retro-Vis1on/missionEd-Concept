import Button from '../../UI/Button/Button'
import Input from '../../UI/Input/Input'
import { useEffect, useReducer, useState } from 'react'
import ObjCpy from '../../../helpers/ObjCpy'
import classes from './Form.module.css'
import { completeSignUpState, reducer } from './IntialStates'
import { createUser } from '../../../apis/User'
import LoadingSpinner from '../../UI/LoadingSpinner/LoadingSpinner'
import { useHistory } from 'react-router-dom'
import Alert from '../../UI/Alert/Alert'
import ReactGa from 'react-ga'
let timer = null

const CompleteSignUp = (props) => {
    useEffect(() => ReactGa.modalview(`Complete Sign Up`), [])
    const [remCred, dispatcher] = useReducer(reducer, ObjCpy(completeSignUpState))
    const [isSending, sendingStateUpdater] = useState(false)
    const [error, errorStateUpdater] = useState(null)
    const history = useHistory()
    const inputChangeHandler = (event) => {
        dispatcher({ type: "update", field: event.target.name, value: event.target.value })
    }
    const formHandler = async (event) => {
        try {
            event.preventDefault()
            sendingStateUpdater(true)
            dispatcher({ type: "submit" })
            for (let field in remCred)
                if (!remCred[field].isValid) {
                    clearTimeout(timer)
                    timer = setTimeout(() => dispatcher({ type: "resetValid" }), 3000)
                    return sendingStateUpdater(false)
                }
            const data = { username: remCred.username.value, name: remCred.name.value }
            await createUser(data)
            if (history.location.pathname === "/welcome")
                history.replace('/')
        }
        catch (err) {
            sendingStateUpdater(false)
            errorStateUpdater(err.message)
        }
    }
    return <>
        <Alert error={error} onClose={errorStateUpdater.bind(this, null)} />
        <header className={classes.header}>
            <h3>Almost <span>There!</span></h3>
        </header>
        <form onSubmit={formHandler} className={classes.form}>
            <div className={classes.siblingFields}>
                <Input type="text" placeholder="Enter Name" name="name" onChange={inputChangeHandler} isValid={remCred.name.isSubmitted ? remCred.name.isValid : true} value={remCred.name.value} disabled={isSending || !props.isOpen} />
                <Input type="text" placeholder="Enter Username" name="username" onChange={inputChangeHandler} isValid={remCred.username.isSubmitted ? remCred.username.isValid : true} value={remCred.username.value} disabled={isSending || !props.isOpen} />
            </div>
            {isSending ? <div style={{ textAlign: "center" }}> <LoadingSpinner /></div> :
                <div className={classes.singleBtn}>
                    <Button type="submit" disabled={isSending || !props.isOpen}>Complete SignUp</Button>
                </div>
            }
        </form>
    </>
}
export default CompleteSignUp