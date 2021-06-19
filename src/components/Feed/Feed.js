import React, { useState, useEffect, useContext} from 'react'
import './Feed.css'
import {useAuth} from './../../contexts/AuthContext'
import FeedItem from './Feed-item'
import {db} from './../../firebase'
import Feedback from './../Navigation/FeedBack'
import CreateTopic from '../Navigation/CreatePost';
import { Redirect } from 'react-router';
import {useFeedContext} from './../../contexts/FeedContext'
export default function Feed() {
  const {posts, loading}  = useFeedContext();
  const {currentUser} = useAuth();
  
   
    return (
      <div>
        {!currentUser ? <Redirect to="/welcome" /> : null}
      <CreateTopic />
      <div>
      <div className={'feed-section'}>
            <div className={'feed'}>   
                      <div className={'topic-item-box'}>
                          <h5>Posts</h5>
                      <hr style={{height:'3px',backgroundColor:'#7C7E7F'}}/>
                      {loading ? 
                        <div className='loading-box'>
                        <div className='loader'></div>
                      </div>
                      :
                      <div>
                      {posts==null ?
                           <div className='loading-box'>
                             <div className='loader'></div>
                           </div>
                           :
                           <div>
                           {
                             posts.map(data=>{
                               return <FeedItem id={data.id} data={data.data}/>
                              })
                            }
                            </div>
                           }
                        </div> 
                      }
                         
                      </div>
                 </div>
        </div>
      </div>
      <Feedback/>
      </div>
    );
  }