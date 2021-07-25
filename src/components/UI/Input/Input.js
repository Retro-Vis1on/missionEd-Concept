import classes from './Input.module.css'
const Input = (props) => {
    const inputClasses = `${classes.input} ${!props.isValid ? classes.invalid : ''} ${props.className ? props.className : ''}`
    return <input type={props.type} id={props.id} className={inputClasses} value={props.value} placeholder={props.placeholder} name={props.name} onChange={props.onChange} onInvalid={null} disabled={props.disabled} onFocus={props.onFocus} max={props.max} min={props.min} />
}
export default Input