import React from 'react'
import { Link } from 'react-router-dom'
export default function SearchItem(props) {
    return (
        <Link to={`/post/${props.data.id}`} style={{textDecorationLine:'none'}}>
        <div className={'search-item'}>
            <text>{props.data.data.title}</text>
            <text style={{color:'rgb(92, 185, 5)'}}>{props.data.data.tag}</text>
        </div>
        </Link>
    )
}
