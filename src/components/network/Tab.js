import React,{useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Profile from './Profile'
import {userdb} from './../../firebase'
import {useAuth} from './../../contexts/AuthContext'
import { Link } from 'react-router-dom';
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: '100%',
    borderRadius:'10px',
  },
}));

export default function FullWidthTabs() {
  const classes = useStyles();
  const theme = useTheme();
  const{currentUser}  = useAuth();
  const [value, setValue] = React.useState(0);
  const[allFollowing, setAllFollowing] = useState([]);
  const[allFollower, setAllFollwer] = useState([]);
  useEffect(()=>{
     GetFollower();
     GetAllFollowing();
  },[])

  async function GetFollower(){
    try{
      await userdb.where('following','array-contains-any',[currentUser.uid]).onSnapshot(snap=>{
         setAllFollwer(snap.docs.map(data=>{return data.id}));
        })
    } catch{
      console.log('something went wrong')
    }
  }
  async function GetAllFollowing(){
    try{
      userdb.doc(currentUser.uid).onSnapshot(snap=>{
        setAllFollowing(snap.data().following)
      })
    } catch{
      console.log('something went wrong!')
    }
  }
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label={`Followers (${allFollower.length})`}  {...a11yProps(0)} />
          <Tab label={`Following (${allFollowing.length})`}  {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
           {!allFollower ?
              <div></div>
              :
              <div>
                {allFollower.map(data=>{
                  return(
                    <Link to={`/user/${data}`}>
                    <Profile data={data}/>
                    </Link>
                  ) 
                })}
              </div>
           }
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
           <div>
              {!allFollowing ?
                      <div className='loading-box'>
                        <div className='loader'></div>
                       </div>
                :
                <div>
                  {allFollowing.map(data=>{
                    return(
                      <Link to={`/user/${data}`}>
                      <Profile data={data}/>
                      </Link>
                    ) 
                  })}
                </div> 
              }
           </div>
        </TabPanel>
      </SwipeableViews>
    </div>
  );
}
