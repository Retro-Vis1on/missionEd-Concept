import classes from './LoadingSpinner.module.css'
const LoadingSpinner = (props) => {
    const spinnerClass = `${classes['lds-ellipsis']} ${props.className ? props.className : ''}`
    return <div className={spinnerClass}><div></div><div></div><div></div><div></div></div>
}
export default LoadingSpinner