import Button from "../Button/Button"
import classes from './UserView.module.css'
import PostItem from './PostItem'
import { useState } from "react"
import UsersList from "../UserModal/UsersList"
import useWindowDimensions from "../../../hooks/useWindowDimensions"
import DefaultProfilePic from "../../../helpers/DefaultProfilePic"
import { useLocation } from "react-use"
import AboutMe from "./AboutMe"
let list = []
const UserView = (props) => {
    const isCurUser = useLocation().pathname === "/profile"
    const [showModal, modalStateUpdater] = useState(0)
    const [aboutMe, aboutMeState] = useState(false)
    const { width } = useWindowDimensions()
    if (showModal === 1)
        list = props.follower
    else if (showModal === 2)
        list = props.following
    let user = null
    if (width > 670)
        user = <><div className={classes.info}>
            <div>
                {props.location && <address itemProp="address">
                    <i className="fas fa-map-marker-alt"></i>
                    <span>{props.location}</span></address>}
                <p><span className={classes.marker}>Coins: </span><span>{props.coins}</span></p>
                {props.education && <p >
                    <span className={classes.marker}>Education: </span><span itemProp="alumniOf">{props.education}</span></p>}
            </div>
            {props.bio && <Button onClick={aboutMeState.bind(this, true)} onClose={aboutMeState.bind(this, false)}>More about me</Button>}
        </div>
            <div className={classes.user}>
                <img src={props.profile_image ? props.profile_image : DefaultProfilePic(props.username)} alt={props.username} />
                <h2 itemProp="givenName">{props.name ? props.name : props.usernmae}</h2>
                {props.name && <p><i>@{props.username}</i></p>}
                <p itemProp="description"><i>{props.bio}</i></p>
            </div>
            <div className={classes.actions}>
                <div className={classes.network}>
                    <button className={classes.btn} onClick={modalStateUpdater.bind(this, 1)}><span className={classes.count}>{props.follower.length}</span><span className={classes.text}>Follower{props.follower.length === 1 ? "" : "s"}</span></button>
                    <button className={classes.btn} onClick={modalStateUpdater.bind(this, 2)}><span className={classes.count}>{props.following.length}</span><span className={classes.text}>Following</span></button>
                </div>
                <div className={classes.interact}>
                    <Button onClick={props.btn1.onClick}>{props.btn1.text}</Button>
                    <Button onClick={props.btn2.onClick}>{props.btn2.text}</Button>
                </div>
            </div>
        </>
    else
        user = <>
            <div className={classes.user}>
                <img src={props.profile_image ? props.profile_image : DefaultProfilePic(props.username)} alt={props.username} />
                <h2 itemProp="givenName">{props.name ? props.name : props.usernmae}</h2>
                {props.name && <p><i>@{props.username}</i></p>}
                <p itemProp="description"><i>{props.bio}</i></p>
            </div>

            <div className={classes.actions}>
                <div className={classes.network}>
                    <button className={classes.btn} onClick={modalStateUpdater.bind(this, 1)}><span className={classes.count}>{props.follower.length}</span><span className={classes.text}>Follower{props.follower.length === 1 ? "" : "s"}</span></button>
                    <button className={classes.btn} onClick={modalStateUpdater.bind(this, 2)}><span className={classes.count}>{props.following.length}</span><span className={classes.text}>Following</span></button>
                </div>
                <div className={`${classes.interact} ${!props.bio && classes.noAbout}`}>
                    <Button onClick={props.btn1.onClick}>{props.btn1.text}</Button>
                    <Button onClick={props.btn2.onClick}>{props.btn2.text}</Button>
                    {props.bio && <Button onClick={aboutMeState.bind(this, true)} onClose={aboutMeState.bind(this, false)}>About me</Button>}
                </div>
            </div>

        </>
    return <>
        <AboutMe {...props} isOpen={aboutMe} onClose={aboutMeState.bind(this, false)} />
        <UsersList list={list} onClose={modalStateUpdater.bind(this, 0)} isOpen={showModal !== 0} isFollower={showModal === 1} username={props.username} />
        <div className={classes.profile} itemScope itemType="https://schema.org/Person">
            <div className={classes.backgroundImage}></div>
            <header className={classes.header}>
                {user}
            </header>
            <div className={classes.posts}>
                {isCurUser ? <div className={classes.feedControls}>
                    <button className={`${classes.switchBtn} ${props.postState === 0 && classes.activeBtn}`} onClick={props.setRecent}>My Posts</button>
                    <button className={`${classes.switchBtn} ${props.postState === 1 && classes.activeBtn}`} onClick={props.setSaved}>Saved Posts</button>
                    <button className={`${classes.switchBtn} ${props.postState === 2 && classes.activeBtn}`} onClick={props.setApplication}>My Applications</button>
                </div> : <h2>Recent Activity</h2>}
                {props.posts.length ? <ul className={classes.postsList}>
                    {props.posts.map(post => <PostItem key={post.id} post={post.data} id={post.id} />)}
                </ul> : <p className={classes.empty}>No posts</p>
                }
            </div>
        </div>
    </>

}
export default UserView