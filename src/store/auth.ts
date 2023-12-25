import {createSlice} from "@reduxjs/toolkit";
import {Base64} from "js-base64";

export interface AuthState {
    isAuthenticated: boolean;
    name: string | null;
    bookmarks: string[] | null;
    likedposts: string[] | null;
    myposts: string[] | null;
    email: string | null;
    encodedEmail: string | null;
    avatar: string | null;
    myComments: string[] | null;
}


const initialState: AuthState = {
    isAuthenticated: false,
    name: null,
    bookmarks: [],
    likedposts: [],
    myposts: [],
    encodedEmail: null,
    email: null,
    avatar: null,
    myComments: [],
};


const authSlice = createSlice({
    name: 'auth', initialState, reducers: {
        login(state, action) {
            state.isAuthenticated = true;
            state.name = action.payload.name;
            state.email = action.payload.email;
            state.encodedEmail = Base64.encode(action.payload.email);
            state.bookmarks = action.payload.bookmarks ? action.payload.bookmarks : [];
            state.likedposts = action.payload.likedposts ? action.payload.likedposts : [];
            state.myposts = action.payload.myposts ? action.payload.myposts : [];
            state.avatar = action.payload.avatar;
            state.myComments = action.payload.myComments ? action.payload.myComments : [];
        }, logout(state) {
            state.isAuthenticated = false;
            state.name = null;
            state.email = null;
            state.encodedEmail = null;
            state.bookmarks = [];
            state.likedposts = [];
            state.myposts = [];
            state.avatar = null;
            state.myComments = [];
        }, updateBookmarks(state, action) {
            state.bookmarks = action.payload.bookmarks;
        }, updateLikedPosts(state, action) {
            state.likedposts = action.payload.likedposts;
        }, updateMyPosts(state, action) {
            state.myposts = action.payload.myposts;
        }, updateProfile(state, action) {
            state.name = action.payload.name;
            state.avatar = action.payload.avatar ? action.payload.avatar : state.avatar;
        }, updateMyComments(state, action) {
            state.myComments = action.payload.myComments ? action.payload.myComments : [];
        }
    },
});
export const authActions = authSlice.actions;

export default authSlice.reducer;