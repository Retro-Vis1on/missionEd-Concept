import React, { useState } from 'react'
import Default from './../../assets/default.jpg'
import { userdb } from './../../firebase'
import { useAuth } from './../../contexts/AuthContext'
export default function UserCard(props) {
    const [user, setUser] = useState(null);
    const { currentUser } = useAuth();

    useState(() => {
        GetUser()
    }, [])
    async function GetUser() {
        let uid = currentUser.uid === props.data.users[0] ? props.data.users[1] : props.data.users[0]
        try {
            userdb.doc(uid).onSnapshot(snap => {
                setUser(snap.data())
            })
        } catch {
            alert('something went wrong!')
        }
    }

    return (
        <div>
            {user && <div className={'chat-user-card'}>
                <img src={!user.profile_image ? Default : user.profile_image} alt={`${user.username}`} />
                <text>{user.username}</text>
            </div>
            }
        </div>
    )
}
