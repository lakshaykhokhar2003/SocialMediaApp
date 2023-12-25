import {createSlice} from "@reduxjs/toolkit";

const bookmarkSlice = createSlice({
    name: 'bookmark', initialState: {
        bookmarks: JSON.parse(localStorage.getItem('bookmarks')) || [],
    }, reducers: {
        addBookmark(state, action) {
            state.bookmarks.push(action.payload);
            localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
        }, removeBookmark(state, action) {
            state.bookmarks = state.bookmarks.filter((bookmark) => bookmark !== action.payload);
            localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
        }, removeAllBookmarks(state) {
            state.bookmarks = [];
            localStorage.removeItem('bookmarks');
        }
    },
});
export const bookmarkActions = bookmarkSlice.actions;

export default bookmarkSlice.reducer;