import { useState } from 'react'
import { resetPassword } from '../../../apis/User'
import emailValidator from '../../../helpers/emailValidator'
import Button from '../../UI/Button/Button'
import Input from '../../UI/Input/Input'
import LoadingSpinner from '../../UI/LoadingSpinner/LoadingSpinner'
import classes from './ForgotPassword.module.css'
import commonClasses from './Form.module.css'
const ForgotPassword = (props) => {
    const [email, emailValUpdater] = useState("")
    const [isValid, validStateUpdater] = useState(true)
    const [isWaiting, waitingStateUpdater] = useState(false)
    const [sendAgain, againStateUpdater] = useState(false)
    const [standby, standbyStateUpdater] = useState(false)
    const inputChangeHandler = (e) => {
        emailValUpdater(e.target.value)
        if (!isValid)
            validStateUpdater(true)
    }
    const formHandler = (e) => {
        e.preventDefault()
        validStateUpdater(emailValidator(email))
        if (!emailValidator(email))
            return
        resetPassword(email)
        waitingStateUpdater(true)
        standbyStateUpdater(true);
        setTimeout(() => standbyStateUpdater(false), 15000)
    }
    const resendHandler = () => {
        againStateUpdater(true)
        resetPassword(email)
        standbyStateUpdater(true);
        setTimeout(() => standbyStateUpdater(false), 15000)
    }
    return <>

        {!isWaiting ? <div className={classes.sendEmail}>
            <i className="fas fa-user-lock"></i>
            <h2>Type in your registered email id and we will send you a locksmith</h2>
            <form onSubmit={formHandler} className={classes.form} noValidate>
                <Input type="email" placeholder="Your registered email" isValid={isValid} value={email} onChange={inputChangeHandler} disabled={isWaiting || !props.isOpen} />
                <div className={commonClasses.formActions}>
                    <Button type="submit" >Send One</Button>
                </div>
            </form>
            <div className={commonClasses.additionalActions}>
                <button className={commonClasses.btn} onClick={props.changeState.bind(this, 0)} disabled={!props.isOpen}>Wait! I found my keys!</button>
            </div>
        </div> :
            <div className={classes.waiting}>
                <LoadingSpinner />
                <h2>{sendAgain ? "Apologies. We have sent another one." : "Check your inbox. We have sent the locksmith."}</h2>
                <div className={classes.standbyActions}>
                    <Button disabled={standby || !props.isOpen} onClick={resendHandler}>{standby ? "Patience" : "No one came"}</Button>
                    <Button onClick={props.foundPassword} disabled={!props.isOpen}>I have a new key</Button>
                </div>
            </div>
        }
    </>
}
export default ForgotPassword