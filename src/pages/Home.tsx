import React, {useState, useEffect} from 'react';
import {PostData} from './PostData';
import PostsCard from '../utils/Card/Card';
import axios, {AxiosResponse} from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import useReduxHook from "../hooks/useReduxHook";

const Home: React.FC = () => {
    const {
        username,
        email,
        avatar,
        bookmarks,
        likedposts,
        myposts,
        isAuthenticated,
        encodedEmail,
        myComments
    } = useReduxHook()

    const [userData, setUserData] = useState<PostData[]>([]);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [loadedItems, setLoadedItems] = useState<number>(10);
    const [dataLength, setDataLength] = useState<number>(0);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const res: AxiosResponse<Record<string, PostData>> = await axios.get(
                    'https://algo-bullls-default-rtdb.asia-southeast1.firebasedatabase.app/posts.json'
                );
                const data = Object.entries(res.data).map(([userId, userData]) => ({
                    ...userData,
                    id: userId,
                }));

                setUserData(data.slice(0, loadedItems));
                setDataLength(data.length);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [loadedItems, username, email, avatar, bookmarks, likedposts, myposts, isAuthenticated, encodedEmail, myComments]);

    const fetchMoreData = () => {
        if (userData.length >= dataLength) {
            setHasMore(false);
           
        } else {
            setLoadedItems(loadedItems + 10);
        }
    };

    return (
        <InfiniteScroll
            dataLength={userData.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={<h4>Loading...</h4>}
            endMessage={<p className="text-center py-3">Caught Up For Today (No more posts)</p>}
        >
            {userData.map((user) => (
                <PostsCard key={user.id} user={user}/>
            ))}
        </InfiniteScroll>

    );
};

export default Home;
