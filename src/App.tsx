import React from 'react';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import SignUp from './pages/signup/SignUp';
import Login from './pages/signup/Login';
import MyLayout from './Layout/ProLayout';
import Home from './pages/Home';
import {Provider} from 'react-redux';
import store from './store';
import RootDiv from "./utils/RootDiv/RootDiv";
import Bookmark from "./pages/boomark/Bookmark";
import Posts from "./pages/myposts/Posts";
import Profile from "./pages/profile/Profile";
import Likes from "./pages/likes/Likes";
import NewPost from "./pages/createPost/NewPost";
import {Flip, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const routes = [
    {
        path: '/',
        element: <MyLayout/>,
        children: [
            {
                index: true,
                element: <Home/>
            },
            {
                path: '/my-likes',
                element: <Likes/>
            },
            {
                path: '/my-bookmarks',
                element: <Bookmark/>
            },
            {
                path: '/my-myposts',
                element: <Posts/>
            },
            {
                path: '/profile',
                element: <Profile/>
            },
            {
                path: '/create-post',
                element: <NewPost/>
            }
        ]
    },
    {
        path: '/',
        element: <RootDiv/>,
        children: [
            {
                index: true,
                path: 'login',
                element: <Login/>
            },
            {
                path: 'signup',
                element: <SignUp/>
            },
        ]
    }
];

const router = createBrowserRouter(routes);

function App() {
    return (
        <Provider store={store}>
            <RouterProvider router={router}/>
            <ToastContainer transition={Flip} position="top-right" limit={2} theme="light"/>
        </Provider>
    );
}

export default App;
