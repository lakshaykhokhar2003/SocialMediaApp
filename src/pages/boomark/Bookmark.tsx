import {useEffect, useState} from "react";
import axios, {AxiosResponse} from "axios";
import {PostData} from "../PostData";
import PostsCard from "../../utils/Card/Card";
import useReduxHook from "../../hooks/useReduxHook";

const Bookmark: React.FC = () => {
    const {bookmarks} = useReduxHook();

    const [bookmarksData, setBookmarksData] = useState<PostData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchBookmarkPost = async (bookmarks: string[]): Promise<PostData[]> => {
        const requests = bookmarks.map(async (postId) => {
            const bookmark: AxiosResponse<PostData> = await axios.get(
                `https://algo-bullls-default-rtdb.asia-southeast1.firebasedatabase.app/posts/${postId}.json`
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
                <div>No Bookmarks</div>
            )}
        </>
    );
};

export default Bookmark;
