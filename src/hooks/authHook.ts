import {authActions} from "../store/auth";
import {useDispatch} from "react-redux";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import useReduxHook from "./useReduxHook";


const useAuth = () => {
    const {isAuthenticated} = useReduxHook()
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const loginHandler = async (email: string) => {
        try {
            const res = await axios.get(`https://algo-bullls-default-rtdb.asia-southeast1.firebasedatabase.app/user/-Nm7je81ns7AhjF2E0o3/${email}.json`)
            dispatch(authActions.login(res.data))
            navigate('/')
        } catch (e) {
            console.log(e, "no user")
        }

    }

    const registerHandler = async (email: string, data: object) => {
        try {
            const res = await axios.put(`https://algo-bullls-default-rtdb.asia-southeast1.firebasedatabase.app/user/-Nm7je81ns7AhjF2E0o3/${email}.json`, data)
            dispatch(authActions.login(res.data))
            navigate('/')

        } catch (e) {
            console.log(e, "no user")
        }
        navigate('/')
    }

    const logoutHandler = () => {
        dispatch(authActions.logout())
    }

    const updateBookmarks = (bookmarks: string[]) => {
        dispatch(authActions.updateBookmarks({bookmarks: bookmarks}));
    }

    const updateLikedPosts = (likedposts: string[]) => {
        dispatch(authActions.updateLikedPosts({likedposts: likedposts}));
    }

    const updateMyPosts = (myposts: string[]) => {
        dispatch(authActions.updateMyPosts({myposts: myposts}));
    }

    const updateProfile = (name: string, avatar: string) => {
        dispatch(authActions.updateProfile({name: name, avatar: avatar}));
    }

    const updateMyComments = (myComments: string[]) => {
        dispatch(authActions.updateMyComments({myComments: myComments}));
    }

    const useAuthEffect = () => {
        useEffect(() => {
            if (!isAuthenticated) {
                navigate('/login')
            }
        });
    }

    return {
        loginHandler,
        registerHandler,
        logoutHandler,
        updateBookmarks,
        updateLikedPosts,
        updateMyPosts,
        updateProfile,
        updateMyComments,
        useAuthEffect
    }
}

export default useAuth;