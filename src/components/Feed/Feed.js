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
import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuList from '@material-ui/core/MenuList';

const options = ['likes', 'date', 'my post','saved posts',];

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
    const {currentUser} = useAuth();
    const [likedButton, setLikedButton] = useState('');
    const [dateButton, setDateButton] = useState('');
    const [myPostButton, setMyPostButton] = useState('');
    const [savePostButton, seSavePostButton] = useState('');
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);
    const [selectedIndex, setSelectedIndex] = React.useState(1);
    useEffect(() => {
      GetPosts();
    }, [])
  
    const handleMenuItemClick = (event, index) => {
      setSelectedIndex(index);
      setOpen(false);
    };
    const handleToggle = () => {
      setOpen((prevOpen) => !prevOpen);
    };
  
    const handleClose = (event) => {
      if (anchorRef.current && anchorRef.current.contains(event.target)) {
        return;
      }
  
      setOpen(false);
    };

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
      <CreateTopic />
      <div>
      <div className={'feed-section'}>
            <div className={'feed'}>   
                      <div className={'topic-item-box'}>
                        <div className="topic-header"> 
                          <div className="heading-grid">
                            <h5 style={{marginTop : '-3px'}}>Posts</h5>
                          </div>
                          <div className="search-field search-grid">
                              <input type="text"
                                     placeholder="Search Posts...." 
                              ></input>
                              <img src="/images/search-icon.svg"/>
                          </div>
                          <div className="filter filter-grid">
                            <Grid container direction="column" alignItems="center" className="filter-field">
                              <Grid item xs={12}>
                                <ButtonGroup variant="contained" color="primary" ref={anchorRef} aria-label="split button">
                                  <Button className="filter-button" 
                                  color="primary"
                                  size="small"
                                  aria-controls={open ? 'split-button-menu' : undefined}
                                  aria-expanded={open ? 'true' : undefined}
                                  aria-label="select merge strategy"
                                  aria-haspopup="menu"
                                  onClick={handleToggle}
                                  
                                  >
                                    Filter By
                
                                    <ArrowDropDownIcon />
                                  </Button>
                                </ButtonGroup>
                                <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
                                  {({ TransitionProps, placement }) => (
                                    <Grow
                                      {...TransitionProps}
                                      style={{
                                        transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
                                      }}
                                    >
                                      <Paper>
                                        <ClickAwayListener onClickAway={handleClose}>
                                          <MenuList id="split-button-menu">
                                            {options.map((option, index) => (
                                              <MenuItem
                                                key={option}
                                                disabled={index === 2}
                                                selected={index === selectedIndex}
                                                onClick={(event) => handleMenuItemClick(event, index)}
                                              >
                                                {option}
                                              </MenuItem>
                                            ))}
                                          </MenuList>
                                        </ClickAwayListener>
                                      </Paper>
                                    </Grow>
                                  )}
                                </Popper>
                              </Grid>
                            </Grid>

                            {/* <button className="filter-button">
                              likes
                            </button>
                            <button className="filter-button">
                              date
                            </button>
                            <button className="filter-button">
                              saved posts
                            </button>
                            <button className="filter-button">
                              my posts
                            </button> */}
                          </div>
                        </div>
                        
                      <hr style={{height:'3px',backgroundColor:'#7C7E7F',marginTop : '1px'}}/>
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

//   const SearchField = styled.div`
//   position : relative;
//   margin-left : 15px;
//   margin-top : -15px;
//   input {
//       display : block;
//       width : 250px;
//       background: #e6e6ff;
//       padding : 5px;
//       padding-left : 30px;
//       border : none;
//       @media (max-width : 1030px) {
//           width: 85%;
//           margin-right : 15px;
//       }
//       @media (max-width : 500px) {
//           width: 75%;
//           margin-right : 15px;
//       }
//   }
//   img {
//       position: absolute;
//       top : 10px;
//       margin-left : 10px
//   }
//   @media (max-width : 1030px) {
//       width: 100%;
//   }
  
  
// `;
// const Filter = styled.div`
//   display: flex;
//   align-items: center;
//   width : 100%;
//   align-items : center;
//   margin-left : 20px;
// `;
// const FilterButton = styled.button`
//   padding : 5px 10px;
//   border-radius: 25px;
//   border : 2px solid black;
//   margin-top : -15px;
//   margin-left : 10px;
//   /* background-color : #ff8533;
//   color : white; */
// `;
// const Likes = styled(FilterButton)``;
// const Comments = styled(FilterButton)``;
