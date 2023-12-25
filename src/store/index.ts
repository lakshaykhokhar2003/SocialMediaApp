import {configureStore} from "@reduxjs/toolkit";
import authReducer, {AuthState} from "./auth";

const loadState = () => {
    try {
        const serializedState = localStorage.getItem('reduxState');
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return undefined;
    }
};

const saveState = (state: AuthState) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('reduxState', serializedState);
    } catch (err) {
        console.log("Error: ", err)
    }
};
const persistedState = loadState();

const store = configureStore({
    reducer: authReducer, preloadedState: persistedState
});

store.subscribe(() => {
    saveState(store.getState());
});
export default store;


