
import { useState } from 'react'
import { newsletterSub } from '../../../apis/Feed'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'
import emailValidator from '../../../helpers/emailValidator'
import Button from '../Button/Button'
import Feedback from '../Feedback/FeedBack'
import Input from '../Input/Input'
import classes from './Footer.module.css'
import { useSelector } from 'react-redux'
import Alert from '../Alert/Alert'
const Footer = () => {
    const [showFeedback, showStateUpdater] = useState(false)
    const [email, updateEmail] = useState({ value: "", isValid: true })
    const [isSending, sendingStateUpdater] = useState(false)
    const [isSent, sentStateUpdater] = useState(false)
    const [error, errorStateUpdater] = useState(null)
    const isLoggedIn = useSelector(state => state.user).isLoggedIn
    const closeFormHandler = () => {
        showStateUpdater(false)
    }
    const fieldChangeHandler = (e) => {
        updateEmail({ isValid: true, value: e.target.value })
    }
    const emailHandler = async (e) => {
        try {
            e.preventDefault()
            updateEmail((prevState) => { return { ...prevState, isValid: emailValidator(prevState.value) } })
            if (!emailValidator(email.value))
                return
            sendingStateUpdater(true)
            await newsletterSub(email.value)
            sendingStateUpdater(false)
            sentStateUpdater(true)
        }
        catch (err) {
            errorStateUpdater("Woops! Something went wrong!")
        }

    }
    return <><Alert error={error} onClose={errorStateUpdater.bind(this, null)} />
        <Feedback isOpen={showFeedback} onClose={closeFormHandler} />
        <footer className={`${classes.footer} ${isLoggedIn !== true ? classes.noMargin : ''}`}>
            <div className={classes.content}>
                <div className={classes.info}>
                    <div className={classes.name}>
                        <h2>MissionEd</h2>
                        <p>Affiliated with Atal Incubation Center</p>
                        <p>Goa Institute of Management</p>
                        <p>India</p>

                    </div>
                    <div className={classes.communication}>
                        <a href="mailto:missionediit@gmail.com"><i className="fas fa-envelope"></i></a>
                        <a href="tel:+91-9674037142" ><i className="fas fa-phone-square-alt"></i></a>
                        <a href="https://www.youtube.com/channel/UCZNAw5GANQMKRobtoR9GUYQ"><i className="fab fa-youtube"></i></a>
                        <a href="https://www.facebook.com/MissionEd2020/"><i className="fab fa-facebook-square"></i></a>
                        <a href="https://www.instagram.com/mission_ed/"><i className="fab fa-instagram"></i></a>
                    </div>
                </div>
                <div className={classes.forms}>
                    {isSending ? <div className={classes.centeredDiv}><LoadingSpinner /></div> : (isSent ? <h2 className={classes.thankyou}><span>Thank you!</span> We will be in touch!</h2> :
                        <form className={classes.subscribe} onSubmit={emailHandler} noValidate>
                            <Input type="email" id="subEmail" placeholder="Subscribe to our newsletter" onChange={fieldChangeHandler} value={email.value} isValid={email.isValid} />
                            <Button type="submit">Subscribe</Button>
                        </form>)
                    }
                    <Button onClick={() => showStateUpdater(true)}>Got a Suggestion?</Button>
                </div>
            </div>
            <p>© Copyright MissionEd. All Rights Reserved</p>
        </footer>
    </>
}

export default Footer