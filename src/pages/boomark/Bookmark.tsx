import React, {useEffect, useState} from "react";
import axios, {AxiosResponse} from "axios";
import {PostData} from "../../utils/PostData";
import {Typography} from "antd";
import PostsCard from "../../Card/PostsCard";
import useReduxHook from "../../hooks/useReduxHook";
import styles from "../emptydata.module.css";

const {Title} = Typography;
const Bookmark: React.FC = () => {
    const {bookmarks, postsApi} = useReduxHook();

    const [bookmarksData, setBookmarksData] = useState<PostData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchBookmarkPost = async (bookmarks: string[]): Promise<PostData[]> => {
        const requests = bookmarks.map(async (postId) => {
            const bookmark: AxiosResponse<PostData> = await axios.get(
                `${postsApi}/${postId}.json`
            );
            return {
                ...bookmark.data,
                id: postId,
            };
        });

        return await Promise.all(requests);
    };

    useEffect(() => {
        const fetchAllBookmark = async () => {
            try {
                if (bookmarks && bookmarks.length > 0) {
                    const bookmark = await fetchBookmarkPost(bookmarks);
                    setBookmarksData(bookmark);
                } else {
                    setBookmarksData([]);
                }
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setIsLoading(false);
            }
        };

        fetchAllBookmark();
    }, [bookmarks]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            {bookmarksData.length > 0 ? (
                bookmarksData.map((user) => (
                    <PostsCard key={user.id} user={user}/>
                ))
            ) : (
                <div className={styles.topDiv}>
                    <div className={styles.img}></div>
                    <Title level={2}>No Bookmarks</Title>
                </div>
            )}
        </>
    );
};

export default Bookmark;
