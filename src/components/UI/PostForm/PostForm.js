import JoditEditor from "jodit-react"
import { useEffect, useReducer, useState } from "react"
import ObjCpy from "../../../helpers/ObjCpy"
import Button from "../Button/Button"
import Input from "../Input/Input"
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner"
import CustomModal from "../Modal/Modal"
import Select from "../Select/Select"
import classes from './PostForm.module.css'
import DOMPurify from "dompurify"
const InitialState = {
    title: {
        value: "",
        isValid: false,
        isSubmitted: false
    },
    tag: {
        value: "",
        isValid: false,
        isSubmitted: false
    },
    description: {
        value: "",
        isValid: false,
        isSubmitted: false
    },
}
const config = {
    toolbarAdaptive: false,
    "showCharsCounter": false,
    "showWordsCounter": false,
    "showXPathInStatusbar": false,
    "askBeforePasteHTML": false,
    "askBeforePasteFromWord": false,
    "maxHeight": 300,
    placeholder: "Let's talk about this...",
    buttons: ["source", "bold", "italic", "underline", "strikethrough", "superscript", "subscript", "ul", "ol", "image", "video", "link"]
};
const reducer = (state, action) => {
    const updatedState = ObjCpy(state)
    if (action.type === "update") {
        const { field, value } = action
        updatedState[field].value = value
        updatedState[field].isValid = value.trim().length > 0
    }
    else if (action.type === "mount") {
        for (let field in updatedState) {
            updatedState[field].value = action[field]
            updatedState[field].isValid = true
        }
    }
    else if (action.type === "submit") {
        for (let field in updatedState)
            updatedState[field].isSubmitted = true
    }
    else if (action.type === "resetValid")
        for (let field in updatedState)
            updatedState[field].isSubmitted = false
    return updatedState
}
let timer = null
const PostForm = (props) => {
    const [formData, dispatch] = useReducer(reducer, InitialState)
    const [isSending, sendingStateUpdater] = useState(false)
    const [isSpam, setIsSpam] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const inputChangeHandler = (event) => {
        dispatch({ type: "update", field: event.target.name, value: event.target.value })
    }
    const textAreaHandler = (value) => {
        dispatch({ type: "update", field: "description", value })
    }
    useEffect(() => {
        if (props.post && props.isOpen)
            dispatch({ type: "mount", ...props.post })
    }, [props.post, props.isOpen])
    const submitHandler = async (e) => {
        try {
            e.preventDefault();
            sendingStateUpdater(true)
            var titlespaces = formData.title.value.match(/\S+/g);
            var descspaces = formData.description.value.match(/\S+/g);
            var titleword = (titlespaces?titlespaces.length:0);
            var descword = (descspaces?descspaces.length:0);
            if (titleword<=1 || descword<=1) {
                setIsSpam(true)
            }
            else{
                dispatch({ type: "submit" })
                for (let field in formData) {
                    if (!formData[field].isValid) {
                        clearTimeout(timer)
                        timer = setTimeout(() => dispatch({ type: "resetValid" }), 3000)
                        return sendingStateUpdater(false)
                    }
                }
                const data = {
                    title: formData.title.value,
                    tag: formData.tag.value,
                    description: DOMPurify.sanitize(formData.description.value)
    
                }
                await props.sendRequest(data)
                
                setIsSpam(false)
                setIsSuccess(true)
                props.onClose()
            }
            
        }
        catch (err) {

            console.log(err)
        }
        finally {
            sendingStateUpdater(false)
        }

    }
    return <CustomModal isOpen={props.isOpen} className={classes.modal} >
        
        <h2 className={classes.title}>
            {props.post ? "Edit " : "Create New "}<span>Post</span>
        </h2>
        <form onSubmit={submitHandler} className={classes.form}>
            <div className={classes.vanillaInput}>
                <Input name="title" value={formData.title.value} onChange={inputChangeHandler} isValid={formData.title.isSubmitted ? formData.title.isValid : true} placeholder="Title" disabled={isSending || !props.isOpen}/>
                <Select name="tag" value={formData.tag.value} onChange={inputChangeHandler} isValid={formData.tag.isSubmitted ? formData.tag.isValid : true} disabled={isSending || !props.isOpen}>
                    <option value="">Choose a tag</option>
                    <option>General</option>
                    <option>Internship</option>
                    <option>Question</option>
                    <option>Placement</option>
                    <option>Project</option>
                </Select>
            </div>
            <div className={`${classes.textarea} ${(formData.description.isSubmitted && !formData.description.isValid) ? classes.invalid : ''}`}>
                <JoditEditor
                    onChange={textAreaHandler}
                    tabIndex={1}
                    value={formData.description.value}
                    config={config}
                />
            </div>
            {isSending ? <div style={{ textAlign: "center" }}><LoadingSpinner /></div> :
                <div className={classes.formActions}>
                    <Button disabled={isSending || !props.isOpen} onClick={props.onClose}>Cancel</Button>
                    <Button disabled={isSending || !props.isOpen} type="submit">Save</Button>
                </div>
            }
            {isSpam?<div className={classes.spam} >Don't try to spam post 😡 , Post Valid Data !!</div>:''}
            {isSuccess?<div className={classes.success } >successfully Posted 😊</div>:''}
                
        </form>

    </CustomModal>
}
export default PostForm