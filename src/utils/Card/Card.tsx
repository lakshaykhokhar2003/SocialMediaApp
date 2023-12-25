import React, {useState, useEffect} from 'react';
import {PostData} from '../../pages/PostData'
import {Card, Button, Avatar, Typography} from 'antd';
import {HeartOutlined, HeartFilled, CommentOutlined, BookTwoTone, BookOutlined} from '@ant-design/icons';
import {giveDate} from './giveDate';
import useReduxHook from '../../hooks/useReduxHook';
import axios from 'axios';
import styles from './Card.module.css';
import useAuth from "../../hooks/authHook";
import PostModal from "./PostModal";

const {Text} = Typography;

const PostsCard: React.FC<{ user: PostData }> = ({user}) => {
    const {likedposts, bookmarks, encodedEmail} = useReduxHook();
    const {updateBookmarks, updateLikedPosts} = useAuth();

    const {date, name, description, likes, photo, post, comments, id} = user;
    const [liked, setLiked] = useState<boolean>(likedposts ? likedposts.includes(id) : false);
    const [bookmarked, setBookmarked] = useState<boolean>(bookmarks ? bookmarks.includes(id) : false);
    const [loading, setLoading] = useState<boolean>(true);
    const [modalVisible, setModalVisible] = useState(false);

    const ViewModal = () => {
        setModalVisible(true);
    };
    const handleLikeToggle = async (id: string) => {
        const isLiked = likedposts && likedposts.includes(id);
        const updatedLikedPosts = isLiked
            ? likedposts.filter((likedId: string) => likedId !== id)
            : [...(likedposts || []), id];
        updateLikedPosts(updatedLikedPosts);
        await axios.put(`https://algo-bullls-default-rtdb.asia-southeast1.firebasedatabase.app/user/-Nm7je81ns7AhjF2E0o3/${encodedEmail}/likedposts.json`, updatedLikedPosts);
        setLiked(!isLiked);
    };

    const handleBookmarkToggle = async (id: string) => {
        const isBookmarked = bookmarks && bookmarks.includes(id);
        const updatedBookmarks = isBookmarked
            ? bookmarks.filter((bookmarkId: string) => bookmarkId !== id)
            : [...(bookmarks || []), id];

        updateBookmarks(updatedBookmarks);
        await axios.put(`https://algo-bullls-default-rtdb.asia-southeast1.firebasedatabase.app/user/-Nm7je81ns7AhjF2E0o3/${encodedEmail}/bookmarks.json`, updatedBookmarks);
        setBookmarked(!isBookmarked);
    };

    useEffect(() => {
        setLoading(false);
    }, []);

    const commentCount = comments ? Object.keys(comments).length : 0;

    const commentButton = !comments ? (
        <Button icon={<CommentOutlined/>} onClick={ViewModal}>
            Comment
        </Button>
    ) : (
        <Button icon={<CommentOutlined/>} onClick={ViewModal}>
            {commentCount} Comment{commentCount !== 1 ? 's' : ''}
        </Button>
    );


    return (
        <Card hoverable className={styles.mainCard} loading={loading}>
            <div style={{display: 'flex', alignItems: 'center', marginBottom: '12px'}}>
                <Avatar src={photo}/>
                <div style={{marginLeft: '12px'}}>
                    <h3>{name.charAt(0).toUpperCase() + name.slice(1)}</h3>
                    <Text type="secondary">{giveDate(date)}</Text>
                </div>
            </div>
            <div>
                <img
                    alt="user-post"
                    src={post}
                    className={styles.postImg}
                    onClick={ViewModal}
                />
                <Button
                    icon={bookmarked ? <BookTwoTone twoToneColor="pink"/> : <BookOutlined/>}
                    onClick={() => id && handleBookmarkToggle(id)}
                    className="position-absolute translate-middle"
                />
                <PostModal
                    user={user}
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                />
            </div>
            <div>
                <Button icon={liked ? <HeartFilled/> : <HeartOutlined/>}
                        onClick={() => id && handleLikeToggle(id)}> {liked ? likes + 1 : likes}</Button>
                {commentButton}
                <p>{description}</p>
            </div>
        </Card>
    );
};

export default PostsCard;
