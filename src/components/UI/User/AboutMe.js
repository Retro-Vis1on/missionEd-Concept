import Button from "../Button/Button"
import CustomModal from "../Modal/Modal"
import classes from './AboutMe.module.css'
const AboutMe = (props) => {
    return <CustomModal isOpen={props.isOpen} className={classes.modal}>
        <div className={classes.aboutMe}>
            <h2>Handle</h2>
            <h3>{props.username}</h3>

            <h2>Bio</h2>
            <h3>{props.bio}</h3>

            {props.education && <><h2>Education</h2>
                <h3>{props.education}</h3>
            </>}
            {
                props.location &&
                <>
                    <h2>Currently Living In</h2>
                    <h3>{props.location}</h3>
                </>
            }
        </div>
        <Button onClick={props.onClose}>Close</Button>

    </CustomModal>
}
export default AboutMe