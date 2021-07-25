import Input from "../Input/Input"
import classes from './FeedBack.module.css'
import Button from "../Button/Button"
import { useReducer, useState } from "react"
import emailValidator from '../../../helpers/emailValidator'
import ObjCpy from "../../../helpers/ObjCpy"
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'
import Alert from "../Alert/Alert"
import { sendFeedback } from "../../../apis/Feed"
import CustomModal from "../Modal/Modal"
import Textarea from "../Textarea/Textarea"
const intialState = {
    name: {
        value: "",
        isValid: false,
        isSubmitted: false
    },
    email: {
        value: "",
        isValid: false,
        isSubmitted: false
    },
    subject: {
        value: "",
        isValid: false,
        isSubmitted: false
    },
    description: {
        value: "",
        isValid: false,
        isSubmitted: false
    },
}
const reducer = (state, action) => {
    const updatedState = ObjCpy(state)
    if (action.type === "update") {
        updatedState[action.field].value = action.value
        updatedState[action.field].isValid = action.field === "email" ? emailValidator(action.value) : action.value.trim().length > 0
        updatedState[action.field].isSubmitted = false
    }
    else if (action.type === "submitData")
        for (let field in updatedState)
            updatedState[field].isSubmitted = true
    else if (action.type === "resetValid")
        for (let field in updatedState)
            updatedState[field].isSubmitted = false
    return updatedState
}
let timer = null
const Feedback = (props) => {
    const [star, starUpdater] = useState(0)
    const [prevStar, prevStarUpdater] = useState(0)
    const [unMarked, unMarkedUpdater] = useState(false)
    const [isSending, sendingStateUpdater] = useState(false)
    const [isSent, sentStateUpdater] = useState(false)
    const [feedback, dispatcher] = useReducer(reducer, ObjCpy(intialState))
    const [error, errorStateUpdater] = useState("")
    let stars = []
    const inputChangeHandler = (event) => {
        dispatcher({ type: "update", value: event.target.value, field: event.target.name })
    }
    for (let i = 1; i <= 5; i++) {
        stars.push(
            <button onClick={() => { prevStarUpdater(i); starUpdater(i) }} className={` ${classes.star} ${i <= star ? classes.activeStar : ''} ${unMarked ? classes.unMarked : ''}`} onFocus={() => starUpdater(i)} onMouseOver={() => { starUpdater(i) }} onMouseLeave={() => { starUpdater(prevStar) }} key={i} disabled={isSending}>
                <i className={`fas fa-star `} key={`${i}thStar`}></i>
            </button >
        )
    }
    const formSubmitHandler = async (e) => {
        try {
            e.preventDefault()
            dispatcher({ type: "submitData" })
            clearTimeout(timer)

            if (!star) {
                unMarkedUpdater(true)
            }
            timer = setTimeout(() => {
                unMarkedUpdater(false)
                dispatcher({ type: "resetValid" })
            }
                , 3000)
            for (let field in feedback)
                if (!feedback[field].isValid)
                    return
            sendingStateUpdater(true)
            const data = {}
            for (let field in feedback)
                data[field] = feedback[field].value
            await sendFeedback(data)
            sendingStateUpdater(false)
            sentStateUpdater(true)
            setTimeout(() => props.onClose(), 1500)
        }
        catch (err) {
            sendingStateUpdater(false)
            errorStateUpdater(err.message)
        }
    }
    const closePrompt = () => errorStateUpdater("")
    return <>{error && <Alert error={error} onClick={closePrompt} />}
        <CustomModal isOpen={props.isOpen} className={classes.modal}>
            {isSent ? <h2 className={classes.heading} style={{ margin: "0" }}><span>Thank you</span> for your feedback 😄 </h2> :
                <>
                    <h2 className={classes.heading}>Your <span>Feedback</span> is valuable to us</h2>
                    <form className={classes.form} onSubmit={formSubmitHandler} noValidate>
                        <div className={classes.starDiv}>
                            {stars}
                        </div>
                        <div className={classes.credentials}>
                            <Input type="text" placeholder="Name" name="name" onChange={inputChangeHandler} value={feedback.name.value} isValid={feedback.name.isSubmitted ? feedback.name.isValid : true} />
                            <Input type="email" placeholder="Email" name="email" onChange={inputChangeHandler} value={feedback.email.value} isValid={feedback.email.isSubmitted ? feedback.email.isValid : true} />
                        </div>
                        <Input type="text" placeholder="Subject" name="subject" onChange={inputChangeHandler} value={feedback.subject.value} isValid={feedback.subject.isSubmitted ? feedback.subject.isValid : true} />
                        <Textarea placeholder="Description" name="description" onChange={inputChangeHandler} value={feedback.description.value} isValid={(feedback.description.isSubmitted ? feedback.description.isValid : true)} />
                        <div className={classes.formActions}>
                            {isSending ? <LoadingSpinner /> :
                                <>                   <Button onClick={props.onClose}>Discard</Button>
                                    <Button type="submit">Submit</Button></>
                            }
                        </div>
                    </form></>}
        </CustomModal>
    </>
}
export default Feedback