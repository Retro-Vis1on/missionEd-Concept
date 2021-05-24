import React from 'react'
import Default from './../../assets/default.jpg'
export default function UserCard() {
    return (
        <div className={'chat-user-card'}>
            <img src={Default}/>
            <text>Amar Preet Singh</text>
        </div>
    )
}
