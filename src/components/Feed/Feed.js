import React, { useState, useEffect} from 'react'
import './Feed.css'
import { makeStyles, withStyles } from '@material-ui/core/styles';
import {useAuth} from './../../contexts/AuthContext'
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputBase from '@material-ui/core/InputBase';
import FeedItem from './Feed-item'
import {db} from './../../firebase'
import Feedback from './../Navigation/FeedBack'
import CreateTopic from '../Navigation/CreatePost';
import { Redirect } from 'react-router';

export default function Feed() {
    const [loading, setLoading] = useState(true);
    const [Posts, setPosts] = useState([]);
    const [age, setAge] = React.useState('');
    const {currentUser} = useAuth();

    useEffect(() => {
      GetPosts();
    }, [])

    async function GetPosts(){
      try{
        await db.collection('posts').orderBy('timestamp','desc').onSnapshot(snap=>{
          setPosts(snap.docs.map(doc=>({id:doc.id,data:doc.data()})))
        })
      }catch{
        alert('something went wrong')
      }
       setLoading(false);
    }

    const handleChange = (event) => {
      setAge(event.target.value);
    };
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
                      {Posts==null ?
                           <div className='loading-box'>
                             <div className='loader'></div>
                           </div>
                           :
                           <div>
                           {
                             Posts.map(data=>{
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
