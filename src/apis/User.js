import { db } from "../firebase"

export const getUserData = async (uid) => {
    try {
        const data = (await db.collection('users').doc(uid).get())
        return data.data()
    }
    catch (err) {
        throw err
    }
}