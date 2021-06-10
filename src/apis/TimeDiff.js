import firebase from 'firebase'

const months = [
    'Jan','Fab','Mar','Apr','May','June','July','Agu','Sep','Oct','Nov','Dec'
]
export default async function TimeDiff(obj){
    let a = firebase.firestore.Timestamp.now().toDate();
    if(obj.getFullYear()<a.getFullYear()){
        return `${obj.getFullYear()}`
    }
    else if(a.getMonth()>obj.getMonth()){
        return `${obj.getDate()} ${months[obj.getMonth()]}`
    }
    else if(a.getDate()-1>obj.getDate()){
        return `${obj.getDate()} ${months[obj.getMonth()]}`
    }
    else if(a.getDate()-1===obj.getDate()){
        return `Yesterday`
    }
    else if(a.getHours()>obj.getHours()){
        return `${a.getHours-obj.getHours()} hours ago`
    }
    else if(a.getMinutes()>obj.getMinutes()){
        return `${a.getMinutes()-obj.getMinutes()} min ago`
    }
    return `Now`;
}




