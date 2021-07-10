import classes from './Layout.module.css'
const Layout = (props) => {
    return <main className={classes.main}>
        {props.children}
    </main>
}
export default Layout