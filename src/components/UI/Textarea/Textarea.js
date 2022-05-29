import classes from './Textarea.module.css'
const Textarea = (props) => {
    const textareaClasses = `${classes.textarea} ${!props.isValid ? classes.invalid : ''} ${props.className ? props.className : ''}`
    return <textarea placeholder={props.placeholder} name={props.name} onChange={props.onChange} value={props.value} className={textareaClasses} />
}
export default Textarea