import React, { useState, useEffect} from 'react'
import './Feed.css'
import { makeStyles, withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputBase from '@material-ui/core/InputBase';
import FeedItem from './Feed-item'
import {db} from './../../firebase'
import Feedback from './../Navigation/FeedBack'
const BootstrapInput = withStyles((theme) => ({  
  root: {
      'label + &': {
        marginTop: theme.spacing(3),
      },
    },
    input: {
      borderRadius: 4,
      position: 'relative',
      backgroundColor: theme.palette.background.paper,
      border: '1px solid #ced4da',
      fontSize: 15,
      padding: '10px 26px 10px 12px',
      transition: theme.transitions.create(['border-color', 'box-shadow']),
      // Use the system font instead of the default Roboto font.
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
      '&:focus': {
        borderRadius: 4,
        borderColor: '#80bdff',
        boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
      },
    },
    menuStyle:{
        border: "1px solid black",
        borderRadius: "5%",
        backgroundColor: 'lightgrey',
      },
  }))(InputBase);


  const useStyles = makeStyles((theme) => ({
    margin: {
      margin: theme.spacing(1),
    },
  }));
  
export default function Feed() {
    const [loading, setLoading] = useState(true);
    const [Posts, setPosts] = useState([]);
    const classes = useStyles();
    const [age, setAge] = React.useState('');

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
      {/* <div>
        <FormControl className={classes.margin}>
          <NativeSelect
            id="demo-customized-select-native"
            value={age}
            onChange={handleChange}
            option
            input={<BootstrapInput />}
            
            >
            <option value={10}>All Categories</option>
            <option value={20}>General</option>
            <option value={30}>Internship</option>
            <option value={40}>Experience</option>
            <option value={50}>Suggestions</option>
            <option value={60}>Questions</option>
          </NativeSelect>
        </FormControl>
      </div> */}
      <div>
      <div className={'feed-section'}>
            <div className={'feed'}>   
                      <div className={'topic-item-box'}>
                          <h4>Posts</h4>
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
