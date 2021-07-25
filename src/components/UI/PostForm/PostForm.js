import JoditEditor from "jodit-react"
import { useEffect, useReducer, useState } from "react"
import ObjCpy from "../../../helpers/ObjCpy"
import Button from "../Button/Button"
import Input from "../Input/Input"
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner"
import CustomModal from "../Modal/Modal"
import Select from "../Select/Select"
import classes from './PostForm.module.css'
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const window = (new JSDOM('')).window;
const DOMPurify = createDOMPurify(window);
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
    placeholder: "Let's talk about this...",
    buttons: ["source", "bold", "italic", "underline", "strikethrough", "superscript", "subscript", "ul", "ol", "image", "video", "table", "link"]
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
    const [isLoading, loadingStateUpdater] = useState(false)
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
            loadingStateUpdater(true)
            dispatch({ type: "submit" })
            for (let field in formData) {
                if (!formData[field].isValid) {
                    clearTimeout(timer)
                    timer = setTimeout(() => dispatch({ type: "resetValid" }), 3000)
                    return loadingStateUpdater(false)
                }
            }
            const data = {
                title: formData.title.value,
                tag: formData.tag.value,
                description: DOMPurify.sanitize(formData.description.value)

            }
            await props.sendRequest(data)
            props.onClose()
        }
        catch (err) {
            loadingStateUpdater(false)
            console.log(err)
        }

    }
    return <CustomModal isOpen={props.isOpen} className={classes.modal} >
        <h2 className={classes.title}>
            {props.post ? "Edit " : "Create New "}<span>Post</span>
        </h2>
        <form onSubmit={submitHandler} className={classes.form}>
            <div className={classes.vanillaInput}>
                <Input name="title" value={formData.title.value} onChange={inputChangeHandler} isValid={formData.title.isSubmitted ? formData.title.isValid : true} placeholder="Title" />
                <Select name="tag" value={formData.tag.value} onChange={inputChangeHandler} isValid={formData.tag.isSubmitted ? formData.tag.isValid : true}>
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
            {isLoading ? <div style={{ textAlign: "center" }}><LoadingSpinner /></div> :
                <div className={classes.formActions}>
                    <Button onClick={props.onClose}>Cancel</Button>
                    <Button type="submit">Save</Button>
                </div>
            }
        </form>

    </CustomModal>
}
export default PostForm