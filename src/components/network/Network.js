import React,{Component} from 'react'
import './Network.css'
// import {FaPlusSquare} from 'react-icons/fa'
// import {GiThreeFriends} from 'react-icons/gi'
// import Profile from './Profile'
// import {FaInbox} from 'react-icons/fa'
import {Link} from 'react-router-dom'
import Tab from './Tab'

export default class Network extends Component{
  
  constructor(props){
    super(props)
    this.state = {
      isLoading: true,
      profiles : null
    }
  }

  componentDidMount(){
    
  }

  render(){
    return(
      <div className={'network-page'}>
             {/* <div className={'header-menu'}>
               <Link to='/inbox' style={{textDecoration:'none'}}>
                <div className={'create-button'}>
                  <FaInbox style={{alignSelf:'center',paddingRight:'5px'}} size={25} color={'white'}/>
                  <text className={'create-topic-text'}>Inbox</text>
                </div>
               </Link>
             </div>
             <div className={'profiles-section'}>
                
                {this.state.isLoading?
                   <div className={'loading-box'}>
                     <div className={'loader'}></div>    
                    </div>
                    :
                    <div>{this.state.profiles.map((data,id)=>{
                      return(<Profile id={id} data={data}/>);
                      })}
                      </div> 
                      }

             </div> */}
                 <Tab/>
        </div>
    );
  }
}