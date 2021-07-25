import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import Resizer from "react-image-file-resizer";
import DefaultProfilePic from "../../helpers/DefaultProfilePic"
import { updaterProfilePic } from "../../apis/User";
import Button from "../UI/Button/Button";
import LoadingSpinner from "../UI/LoadingSpinner/LoadingSpinner";
import classes from './Account.module.css'
import UpdateInfo from "./UpdateInfo";
import UpdatePasssword from './UpdatePassword'
let file = null
const Account = () => {
    const user = useSelector(state => state.user)
    const [profilePic, profilePicUpdater] = useState(null)
    const [isLoading, loadingStateUpdater] = useState(0)
    const [modalState, modalStateUpdater] = useState(0)
    useEffect(() => {
        profilePicUpdater(user.profile_image)
        return () => file = null
    }, [user.profile_image])
    const uploadImage = async () => {
        try {
            loadingStateUpdater(3)
            await updaterProfilePic(file)
        }
        catch (err) {
            console.log(err)
        }
        finally {
            loadingStateUpdater(0)
        }

    }
    const cancelUpload = () => {
        file = null
        profilePicUpdater(user.profile_image)
        loadingStateUpdater(0)
    }
    const confirmUpload = (uri) => {
        profilePicUpdater(URL.createObjectURL(uri))
        file = uri
    }
    const imageHandler = async (e) => {
        loadingStateUpdater(1)
        try {
            const image = e.target.files[0];
            if (!image)
                throw new Error('Invalid Image file')
            Resizer.imageFileResizer(
                image,
                100,
                100,
                "JPEG",
                100,
                0,
                (uri) => confirmUpload(uri),
                "file",
                200,
                200
            );
            loadingStateUpdater(2)
        }
        catch (err) {
            loadingStateUpdater(0)
            console.log(err)
        }

    }
    if (!user.username)
        return <div style={{ textAlign: "center" }}><LoadingSpinner /></div>
    return <>
        <UpdateInfo isOpen={modalState === 1} onClose={modalStateUpdater.bind(this, 0)} user={user} />
        <UpdatePasssword isOpen={modalState === 2} onClose={modalStateUpdater.bind(this, 0)} />
        <h1 className={classes.title}>My <span>Account</span></h1>
        <header className={classes.intro}>
            <div className={classes.imageAndControls}>
                <div className={classes.image}>
                    {isLoading === 1 && <div><LoadingSpinner /></div>}
                    <img src={profilePic ? profilePic : DefaultProfilePic(user.username)} alt={user.username} />
                </div>
                <div className={classes.imageControls}>
                    {isLoading === 0 ?
                        <Button onClick={() => { document.getElementById('file').click(); }}>Upload new image</Button>
                        :
                        (isLoading === 2 ?
                            <div className={classes.confirm}>
                                <Button onClick={cancelUpload}>Cancel</Button>
                                <Button onClick={uploadImage}>Upload</Button>
                            </div> : (isLoading === 3 ?
                                <div style={{ textAlign: "center" }}><LoadingSpinner /></div> : null))
                    }
                </div>
                <input id="file" name={'image'} type="file" onChange={(e) => imageHandler(e)} accept={'image/jpg , image/png, image/jpeg'} hidden />
            </div>
            <div className={classes.identity}>
                <h2>{user.name ? user.name : <i className={classes.empty}>Unset</i>} <i style={{ fontSize: "1.1rem" }}>@{user.username}</i></h2>

                <h2><span>Coins: </span> {user.coins}</h2>
                <div className={classes.infoActions}>
                    <Button onClick={modalStateUpdater.bind(this, 1)}>Update Info</Button>
                    <Button onClick={modalStateUpdater.bind(this, 2)}>Update Password</Button>
                    <Button>Redeem Coins</Button>
                </div>
            </div>
        </header>
        <div className={classes.details}>
            <h3>
                <span>Bio: </span>
                {user.bio ? user.bio : <i>Tell us about yourself</i>}
            </h3>
            <h3>
                <span>Education: </span>
                {user.education ? user.education : <i className={classes.empty}>You have not specified your education</i>}
            </h3>
            <h3>
                <span>Location: </span>
                {user.location ? user.location : <i className={classes.empty}>You have not specified your location</i>}
            </h3>
        </div>

    </>
}
export default Account