import React from 'react';
import './App.css';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import SignUp from './pages/Authentication/SignUp';
import Login from './pages/Authentication/Login';
import MyLayout from './utils/Layout/ProLayout';
import Home from './pages/Home';
import {Provider} from 'react-redux';
import store from './store';
import RootDiv from "./utils/RootDiv";
import Bookmark from "./pages/boomark/Bookmark";
import Posts from "./pages/posts/Posts";
import Profile from "./pages/profile/Profile";
import Likes from "./pages/likes/Likes";
import NewPost from "./pages/createNewPost/NewPost";

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
                path: '/my-posts',
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
        </Provider>
    );
}

export default App;
