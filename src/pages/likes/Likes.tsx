import PostsCard from '../../utils/Card/Card';
import {useEffect, useState} from "react";
import axios, {AxiosResponse} from "axios";
import {PostData} from "../PostData";
import useReduxHook from "../../hooks/useReduxHook";

const Likes: React.FC = () => {
    const {likedposts} = useReduxHook()
    const [likedData, setLikedData] = useState<PostData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchLikedPosts = async (likedposts: string[]): Promise<PostData[]> => {
        const requests = likedposts.map(async (postId) => {
            const likedpost: AxiosResponse<PostData> = await axios.get(
                `https://algo-bullls-default-rtdb.asia-southeast1.firebasedatabase.app/posts/${postId}.json`
            );
            return {
                ...likedpost.data,
                id: postId,
            };
        });

        return await Promise.all(requests);
    };
    useEffect(() => {
        const fetchLikes = async () => {
            try {
                if (likedposts && likedposts.length > 0) {
                    const likes = await fetchLikedPosts(likedposts);

                    setLikedData(likes);
                } else {
                    setLikedData([]);
                }
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
            }

        }
        fetchLikes();
    }, [likedposts]);

    if (isLoading) {
        return <div>Loading...</div>;
    }
    return (
        <>
            {likedData.length > 0 ? (
                likedData.map((user) => (
                    <PostsCard key={user.id} user={user}/>
                ))
            ) : (
                <div>No Likes</div>
            )}
        </>
    )
}

export default Likes;