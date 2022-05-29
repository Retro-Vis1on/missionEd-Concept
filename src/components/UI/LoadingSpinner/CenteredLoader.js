import LoadingSpinner from "./LoadingSpinner"
const CenteredLoader = () => {
    const style = {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%,-50%)"
    }
    return <div style={style}>
        <LoadingSpinner />
    </div>
}
export default CenteredLoader