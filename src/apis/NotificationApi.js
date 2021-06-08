import firebase from 'firebase'
import {userdb, db} from '../firebase'


export async function UpdateCoins(uid, coins){
    try{
       await userdb.doc(uid).get().then((doc)=>{
           userdb.doc(uid).update({
               coins: coins+doc.data().coins,
           })
       })
    }
    catch{
        console.log('error in updating coins');
        return 'error in updating coins'
    }
}




