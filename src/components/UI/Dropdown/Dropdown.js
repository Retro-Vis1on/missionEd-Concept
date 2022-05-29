import classes from './Dropdown.module.css'
const Dropdown = (props) => {
    const selectHandler = (field) => {
        props.onClick(field)
    }
    return <div className={classes.filter}>
        <button className={classes.filterBtn}>
            {props.text}<span style={{ color: "orange" }}> v</span>
        </button>
        <ul className={classes.filters}>
            {props.filters.map((filter) => <li onClick={selectHandler.bind(this, filter)} key={filter}>{filter}</li>)}
        </ul>
    </div>
}
export default Dropdown