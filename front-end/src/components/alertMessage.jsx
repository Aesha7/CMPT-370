import "./alertMessage.css"

const alertMessage = (message) =>{
    console.log("here")
    return (
        <div className="alertDiv">
            <h1>{message}</h1>
        </div>
    );
} 
export default alertMessage;