import React, {useState} from 'react';
import {PostData} from '../utils/PostData'
import {Card, Button, Avatar, Typography} from 'antd';
import {HeartOutlined, HeartFilled, CommentOutlined, BookTwoTone, BookOutlined} from '@ant-design/icons';
import {capitalizeFirstLetter, giveDate} from '../utils/functions';
import useReduxHook from '../hooks/useReduxHook';
import axios from 'axios';
import styles from './Card.module.css';
import useAuth from "../hooks/authHook";
import PostModal from "../pages/showComments/PostModal";
import AvatarPhoto from "../utils/avatar.jpg"
import PostPhoto from "../utils/post.jpg"

const {Text} = Typography;

const PostsCard: React.FC<{ user: PostData }> = ({user}) => {
    const {likedposts, bookmarks, encodedEmail, usersApi} = useReduxHook();
    const {updateBookmarks, updateLikedPosts} = useAuth();

    const {date, name, description, likes, photo, post, comments, id} = user;
    const [liked, setLiked] = useState<boolean>(likedposts ? likedposts.includes(id) : false);
    const [bookmarked, setBookmarked] = useState<boolean>(bookmarks ? bookmarks.includes(id) : false);
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
        await axios.put(`${usersApi}/${encodedEmail}/likedposts.json`, updatedLikedPosts);
        setLiked(!isLiked);
    };

    const handleBookmarkToggle = async (id: string) => {
        const isBookmarked = bookmarks && bookmarks.includes(id);
        const updatedBookmarks = isBookmarked
            ? bookmarks.filter((bookmarkId: string) => bookmarkId !== id)
            : [...(bookmarks || []), id];

        updateBookmarks(updatedBookmarks);
        await axios.put(`${usersApi}/${encodedEmail}/bookmarks.json`, updatedBookmarks);
        setBookmarked(!isBookmarked);
    };

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
        <Card hoverable className={styles.mainCard}>
            <div style={{display: 'flex', alignItems: 'center', marginBottom: '12px'}}>
                <Avatar
                    src={AvatarPhoto || photo}
                    alt={`${name}'s avatar`}
                />
                <div style={{marginLeft: '12px'}}>
                    <h3>{capitalizeFirstLetter(name)}</h3>
                    <Text type="secondary">{giveDate(date)}</Text>
                </div>
            </div>
            <div>
                <img
                    alt="Post image"
                    src={post}
                    className={styles.postImg}
                    onClick={ViewModal}
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = PostPhoto;
                    }}
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