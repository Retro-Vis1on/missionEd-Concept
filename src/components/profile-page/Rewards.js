import {Component} from 'react'
import { TextField } from "@material-ui/core";
import {RiCoinsLine} from 'react-icons/ri'
import {Button} from '@material-ui/core'
export default class Rewards extends Component {
    constructor(props){
      super(props)
      this.state={
        isLoading:false,
        coins:21
      }
    }
   
    

    render(){
      return(<div className={'profile-content'}>
      {this.state.isLoading?
         <div className={'loading-box'}>
             <div className={'loader'}></div>    
         </div>
                   :
        <div className={'reward-content'}>
          
          <div className={'coins-section'}>
                 <text>Your Coins</text>
                 <text className={'coins'}>
                 <RiCoinsLine/>= {this.state.coins}
                 </text>
          </div>
          </div>
        }
          <Button
           variant="contained"
           color="default"
           style={{fontWeight:'600',marginTop : '30px'}}
           disabled={false}
          >
           Reedem
          </Button>
         
        </div>
    );
  }
}