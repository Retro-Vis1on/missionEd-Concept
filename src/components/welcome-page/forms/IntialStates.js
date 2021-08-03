import emailValidator from "../../../helpers/emailValidator"
import ObjCpy from "../../../helpers/ObjCpy"

export const signUpState = {
    name: {
        value: "",
        isValid: false,
        isSubmitted: false
    },
    username: {
        value: "",
        isValid: false,
        isSubmitted: false
    },
    email: {
        value: "",
        isValid: false,
        isSubmitted: false
    },
    password: {
        value: "",
        isValid: false,
        isSubmitted: false
    },
    confirmPassword: {
        value: "",
        isValid: false,
        isSubmitted: false
    },
}
export const signInState = {
    email: {
        value: "",
        isValid: false,
        isSubmitted: false
    },
    password: {
        value: "",
        isValid: false,
        isSubmitted: false
    }
}
export const completeSignUpState = {
    name: {
        value: "",
        isValid: false,
        isSubmitted: false
    },
    username: {
        value: "",
        isValid: false,
        isSubmitted: false
    }
}

export const reducer = (state, action) => {
    const updatedState = ObjCpy(state)
    if (action.type === "update") {
        updatedState[action.field].value = action.value
        updatedState[action.field].isValid = action.field === "email" ? emailValidator(action.value) : action.value.trim().length > 0
        if (action.field === "confirmPassword")
            updatedState[action.field].isValid = action.value.trim().length > 0 && action.value === updatedState.password.value
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