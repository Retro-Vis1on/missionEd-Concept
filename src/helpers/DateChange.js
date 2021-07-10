const timeDifference = (time) => {
    time = (new Date(time)).getTime()
    let cur = new Date().getTime();
    let msPerMinute = 60 * 1000;
    let msPerHour = msPerMinute * 60;
    let msPerDay = msPerHour * 24;
    let elapsed = cur - time;
    if (elapsed < msPerMinute) {
        return "Just now";
    } else if (elapsed < msPerHour) {
        let val = Math.round(elapsed / msPerMinute);
        return val + (val > 1 ? " mins ago" : " min ago");
    } else if (elapsed < msPerDay - msPerHour / 2) {
        let val = Math.round(elapsed / msPerHour);
        return val + (val > 1 ? " hrs ago" : " hr ago");
    } else {

        let date = (new Date(time)).toLocaleDateString('en-IN', { year: '2-digit', month: 'short', day: '2-digit' })
        return date
    }

}
export default timeDifference
