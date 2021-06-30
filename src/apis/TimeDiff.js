import firebase from 'firebase'

const months = [
    'Jan','Fab','Mar','Apr','May','June','July','Agu','Sep','Oct','Nov','Dec'
]
export default async function TimeDiff(obj){
    if(obj)  {
        let a = firebase.firestore.Timestamp.now();
        console.log((a.seconds-obj.seconds));
        if((a.seconds-obj.seconds)<60) {
            return 'now'
        }
        else if((a.seconds-obj.seconds)>60&&(a.seconds-obj.seconds)<3600) {
            return `${((a.seconds-obj.seconds)/60).toFixed()}m`
        }
        else if((a.seconds-obj.seconds)>=3600&&(a.seconds-obj.seconds)<86400) {
            return `${((a.seconds-obj.seconds)/3600).toFixed()}h`
        }
        else if ((a.seconds-obj.seconds)/86400>=1&&(a.seconds-obj.seconds)/86400<=7) {
            return `${((a.seconds-obj.seconds)/86400).toFixed()}d`
        }
        else {
            return `${(((a.seconds-obj.seconds)/86400)/7).toFixed()}w`
        }
        // if(obj.getFullYear()<a.getFullYear()){
        //     return `${obj.getFullYear()}`
        // }
        // else if(a.getMonth()>obj.getMonth()){
        //     return `${obj.getDate()} ${months[obj.getMonth()]}`
        // }
        // else if(a.getDate()-obj.getDate()<=28&&a.getDate()-obj.getDate()>=21) {
        //     return `3 w`
        // }
        // else if(a.getDate()-obj.getDate()<=21&&a.getDate()-obj.getDate()>=15) {
        //     return `2 w`
        // }
        // else if(a.getDate()-obj.getDate()<=14&&a.getDate()-obj.getDate()>=8) {
        //     return `1 w`
        // }
        // else if(a.getDate()-obj.getDate()<=7&&a.getDate()-obj.getDate()>=1) {
        //     return `${a.getDate()-obj.getDate()} d`
        // }
        // else if(a.getDate()-1>obj.getDate()){
        //     return `${obj.getDate()} ${months[obj.getMonth()]}`
        // }
        // else if(a.getDate()-1===obj.getDate()){
        //     return `Yesterday`
        // }
        // else if(a.getHours()>obj.getHours()){
        //     return `${a.getHours()-obj.getHours()} h`
        // }
        // else if(a.getMinutes()>obj.getMinutes()){
        //     return `${a.getMinutes()-obj.getMinutes()} min`
        // }
        }
        return '';
    
    
}




