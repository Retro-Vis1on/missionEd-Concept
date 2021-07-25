import classes from './Select.module.css'
const Select = (props) => {
    const selectclass = `${classes.select} ${!props.isValid ? classes.invalid : ''}`
    return <select name={props.name} className={selectclass} value={props.value} onChange={props.onChange} disabled={props.disabled} >{props.children}</select>
}
export default Select