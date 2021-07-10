import { createSlice } from "@reduxjs/toolkit";
const CachingSlice = createSlice({
    name: 'cache',
    initialState: {
        posts: [],
        netPosts: 0,
        authorData: [],
    },
    reducers: {
        updateCache(state, action) {
            state.posts = [...state.posts, ...(action.payload.posts)]
            state.authorData = [...state.authorData, ...(action.payload.authors)]
        },
        filterChange(state, action) {
            state.posts = action.payload.posts
        },
        postUpdate(state, action) {
            state.posts[action.payload.index].post = action.payload.data
        },
        deletePost(state, action) {
            state.posts.splice(action.payload.index, 1)
        },
        netPostsUpdater(state, action) {
            if (action.payload.type === "newPost")
                state.netPosts += 1
            else if (action.payload.type === "delPost") {
                state.netPosts.all -= 1
                state.netPosts[action.payload.tag] -= 1
            }
            else if (action.payload.type === "updatePost") {
                state.netPosts[action.payload.oldTag] -= 1
                state.netPosts[action.payload.newTag] += 1
            }

            else if (action.payload.type === "firstRun")
                state.netPosts = action.payload.value
        }
    }
})
export default CachingSlice.reducer
export const CachingActions = CachingSlice.actions