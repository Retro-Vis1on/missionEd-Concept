import { useSelector } from 'react-redux'
import Footer from '../UI/Footer/Footer'
import Navbar from '../UI/Navbar/Navbar'
import classes from './Layout.module.css'
const Layout = (props) => {
    const isLoggedIn = useSelector(state => state.user).isLoggedIn
    return <>
        <Navbar />
        <main className={`${classes.main} ${isLoggedIn !== true ? classes.noPadding : ''}`}>
            {props.children}
        </main>
        <Footer />
    </>
}
export default Layout