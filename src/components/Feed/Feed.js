import React, { useState, useEffect, useContext, useRef} from 'react'
import './Feed.css'
import {useAuth} from './../../contexts/AuthContext'
import FeedItem from './Feed-item'
import {db} from './../../firebase'
import Feedback from './../Navigation/FeedBack'
import CreateTopic from '../Navigation/CreatePost';
import { Redirect } from 'react-router';
import {useFeedContext} from './../../contexts/FeedContext'
import {withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import SearchItem from './SearchItem'
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputBase from '@material-ui/core/InputBase';
import Pagination from '@material-ui/lab/Pagination';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

const options = ['likes', 'date', 'my post','saved posts','comments'];

const BootstrapInput = withStyles((theme) => ({
  input: {
    borderRadius: 15,
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #ced4da',
    fontSize: 14,
    padding: '8px 24px 8px 12px',
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
      borderRadius: 15,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.1rem rgba(0,0,0,.25)',
    },
  },
}))(InputBase);

const Menu = withStyles((theme)=>({
  selectMenu:{

  }
}))

export default function Feed() {
  const {posts, loading, TagPosts, pageCount, GetCount,currentPage, SetPageNo}  = useFeedContext();
  const {currentUser} = useAuth();
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [selectedIndex, setSelectedIndex] = React.useState(1);
  const [searchActive, setSearchActive] = useState(false);
  const [search, setSearch] = useState('');
  const [searchPost, setSearchPost] = useState(null);
  const [tag, setTag] = React.useState('alltag');
  
  const handleChange = (event) => {
    setTag(event.target.value);
    TagPosts(event.target.value);
    GetCount(event.target.value);
  };

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
  
  async function GetSearchData(value){
    setSearch(value)
    try{
      db.collection('posts').where('title','==',value).limit(10).get().then(data=>{
        setSearchPost(data.docs.map(snap=>{return{id:snap.id,data:snap.data()}}));
        console.log(data.docs.length)
      })
    }
    catch{
      console.log('somthing went wrong')
    }
  }
   const onNext = () =>{
     window.scroll(0,0);
     SetPageNo(currentPage+1);
   }
   const OnPrev = () =>{
    window.scroll(0,0);
     SetPageNo(currentPage-1);
   }
    return (
      <div>
        {!currentUser ? <Redirect to="/welcome" /> : null}
      <div>
      <div className={'feed-section'}>
            <div className={'feed'}>   
                      <div className={'topic-item-box'}>
                        <div className="topic-header"> 
                          <div className="heading-grid">
                            <h5 style={{marginTop : '-3px'}}>Posts</h5>
                          </div>
                          <div style={{marginTop:'-10px',display:'flex',justifyContent:'flex-end'}}>
                          <NativeSelect
                              id="demo-customized-select-native"
                              value={tag}
                              onChange={handleChange}
                              input={<BootstrapInput/>}
                              style={{marginLeft:'10px'}}
                              
                              >
                              <option value={'alltag'} >All</option>
                              <option value={'General'}>General</option>
                              <option value={'Internship'}>Internship</option>
                              <option value={"Question"}>Question</option>
                              <option value={'Placement'} >Placement</option>
                              <option value={'Project'} >Project</option>
                            </NativeSelect>
                            </div>
                          {/* <ClickAwayListener onClickAway={()=>setSearchActive(false)}>
                          <div className={searchActive? 'search-field search-field-active search-grid':"search-field search-grid"}>
                              <input onClick={()=>setSearchActive(true)} value={searchActive? search : ''} onChange={(e)=>GetSearchData(e.target.value)}  type="text"
                                     placeholder="Search Posts...." 
                                     ></input>
                              <img src="/images/search-icon.svg"/>
                              <div>
                                {searchActive? 
                                   <div className='result-box'>
                                     {searchPost && search?
                                      <div>
                                        {searchPost.length>0?
                                        <div>
                                         {searchPost.map(post=>{
                                           return <SearchItem data={post}/>
                                          })}
                                        </div>
                                        :
                                        <div><text>Not Found</text></div>}
                                      </div>
                                      :
                                      <div>
                                        <text >Search Posts by Title</text>
                                      </div> 
                                    }
                                   </div>
                                   :
                                   null
                                  }
                              </div>
                          </div>
                          </ClickAwayListener>
                          <div className="filter filter-grid">
                            <Grid container direction="column" alignItems="center" className="filter-field">
                              <Grid item xs={12}> */}
                                {/* <ButtonGroup variant="outlined"  color="primary" ref={anchorRef} aria-label="split button">
                                  <Button className="filter-button" 
                                  color="primary"
                                  size="small"
                                  variant='outlined'
                                  aria-controls={open ? 'split-button-menu' : undefined}
                                  aria-expanded={open ? 'true' : undefined}
                                  aria-label="select merge strategy"
                                  aria-haspopup="menu"
                                  onClick={handleToggle}
                                  style={{paddingBottom:'3px',paddingTop:'6px',borderRadius:'15px'}}
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
                                </Popper> */}
                            {/* <NativeSelect
                              id="demo-customized-select-native"
                              value={tag}
                              onChange={handleChange}
                              input={<BootstrapInput/>}
                              style={{marginLeft:'10px'}}
                            >
                              <option value={'alltag'} >All</option>
                              <option value={'General'}>General</option>
                              <option value={'Internship'}>Internship</option>
                              <option value={"Question"}>Question</option>
                              <option value={'Placement'} >Placement</option>
                              <oprion value={'Project'} >Project</oprion>
                            </NativeSelect>
                              </Grid>
                            </Grid> */}

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
                          {/* </div> */}
                        </div>
                        
                      <hr style={{height:'3px',backgroundColor:'#7C7E7F',marginTop : '1px'}}/>
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
                          {posts.length>0 ?
                           <div>
                           {
                             posts.map(data=>{
                               return <FeedItem id={data.id} data={data.data}/>
                              })
                            }
                            </div>
                            :
                            <div>No Posts Found!</div>
                            }
                            </div>
                           }
                        </div> 
                      }
                      </div>
                      <div style={{display:tag=='alltag'?'flex':'none',justifyContent:'center',padding:'10px',alignItems:'center'}}>
                       <div onClick={()=>OnPrev()} className={'pagination-button'} style={{display:currentPage-1>0? null:'none'}}>
                          <ArrowBackIosIcon style={{fontSize:'20px'}}/>Back
                       </div>
                       <div className='pages'>
                         <text onClick={()=>OnPrev()} style={{display:currentPage-1>0? null:'none'}} className='page-number' >{currentPage-1}</text>
                         <text className='page-number page-number-active'>{currentPage}</text>
                         <text style={{display:currentPage===pageCount? 'none':null}} onClick={()=>onNext()} className='page-number'>{currentPage+1}</text>
                       </div>
                       <div className='pagination-button' onClick={()=>onNext()} style={{display:currentPage===pageCount? 'none':null}}>
                         Next<ArrowForwardIosIcon style={{fontSize:'20px'}}/>
                       </div>
                      </div>
                 </div>
        </div>
      </div>
      <Feedback/>
      </div>
    );
  }