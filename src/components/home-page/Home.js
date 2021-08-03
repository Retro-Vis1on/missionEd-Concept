import React, { useEffect } from 'react'
import './Home.css'
import Feed from './../Feed/Feed'

export default function Home() {


  return (
    <>
      <div className="feed-intro" >
        <Feed />
      </div>
    </>

  )
}