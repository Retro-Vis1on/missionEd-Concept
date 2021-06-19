import React, { useState, useEffect, useContext} from 'react'
import './Feed.css'
import {useAuth} from './../../contexts/AuthContext'
import FeedItem from './Feed-item'
import {db} from './../../firebase'
import Feedback from './../Navigation/FeedBack'
import CreateTopic from '../Navigation/CreatePost';
import { Redirect } from 'react-router';
import {useFeedContext} from './../../contexts/FeedContext'
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

const options = ['likes', 'date', 'my post','saved posts','comments'];
export default function Feed() {
  const {posts, loading}  = useFeedContext();
  const {currentUser} = useAuth();
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [selectedIndex, setSelectedIndex] = React.useState(1);

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