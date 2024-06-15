import React, {useEffect, useState} from 'react';
import {Modal, Button, Avatar, Typography, Input, Menu, Dropdown} from 'antd';
import {CommentOutlined, EditTwoTone, DeleteTwoTone, EllipsisOutlined} from '@ant-design/icons';
import styles from './PostModal.module.css';
import {capitalizeFirstLetter, giveDate} from '../../utils/functions';
import {CommentData, PostData} from '../../utils/PostData';
import axios from 'axios';
import useReduxHook from '../../hooks/useReduxHook';
import useAuth from '../../hooks/authHook';
import CommentsAvatar from '../../utils/comments.jpg'
import AvatarPhoto from "../../utils/avatar.jpg"
import PostPhoto from "../../utils/post.jpg";

const {Text} = Typography;

const PostModal: React.FC<{
        user: PostData;
        visible: boolean;
        onClose: () => void;
    }> = ({user, visible, onClose}) => {
        const {username, avatar, email, encodedEmail, myComments, usersApi, postsApi} = useReduxHook();
        const {updateMyComments} = useAuth();

        const {date, name, description, photo, post} = user;
        const [editedCommentId, setEditedCommentId] = useState<string>('');
        const [commentText, setCommentText] = useState<string>('');
        const [showCommentTextArea, setShowCommentTextArea] = useState<boolean>(false);
        const [editedComment, setEditedComment] = useState<string>('');
        const [commentsState, setCommentsState] = useState<Record<string, CommentData>>({});
        const [commentSubmitted, setCommentSubmitted] = useState<boolean>(false);
        const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);

        useEffect(() => {  // Fetch comments on modal open and update comments on comment submission
            setCommentText('');
            if (visible || commentSubmitted) {
                fetchUpdatedComments().then((updatedComments) => {
                    setCommentsState(updatedComments);
                });
            }
            setCommentSubmitted(false);
        }, [visible, commentSubmitted, myComments]);

        const fetchUpdatedComments = async () => {
            const updatedCommentsRes = await axios.get(`${postsApi}/${user.id}/comments.json`);
            return updatedCommentsRes.data || {};
        };

        const handleCommentPost = async () => {
            const newComment = {
                name: username,
                avatar: avatar,
                comment: commentText,
                date: new Date().toISOString(),
                email: email,
            };
            const res = await axios.post(`${postsApi}/${user.id}/comments.json`, newComment);
            const commentId = `posts/${user.id}/comments/${res.data.name}`;
            const myCommentsArray = [...(myComments || []), commentId];
            await axios.patch(`${usersApi}/${encodedEmail}.json`, {myComments: myCommentsArray,});
            updateMyComments(myCommentsArray);
            setCommentText('');
            const updatedComments = await fetchUpdatedComments();
            setCommentsState(updatedComments);
            setCommentSubmitted(true);
            setButtonDisabled(true)
        };

        const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setCommentText(e.target.value);
            setButtonDisabled(e.target.value.trim() === '' || e.target.value.trim().length >= 200);
            return
        };

        const handleEditComment = (commentId: string, comment: string) => {
            setEditedCommentId(commentId);
            setShowCommentTextArea(true);
            setEditedComment(comment);

        };

        const submitEditedComment = async () => {
            await axios.patch(`${postsApi}/${user.id}/comments/${editedCommentId}.json`, {
                comment: editedComment,
                date: new Date().toISOString(),
            });
            setShowCommentTextArea(false);
            setEditedComment('');
            const updatedComments = await fetchUpdatedComments();
            setCommentsState(updatedComments);
            setCommentSubmitted(true);
        };

        const handleCommentDelete = async (commentId: string) => {
            await axios.delete(`${postsApi}/${user.id}/comments/${commentId}.json`);
            const myCommentsArray = myComments.filter((comment: string) => comment !== `posts/${user.id}/comments/${commentId}`);
            await axios.patch(`${usersApi}/${encodedEmail}.json`, {
                myComments: myCommentsArray,
            });
            updateMyComments(myCommentsArray);


        };

        const menu = (commentId: string, comment: string) => (
            <Menu>
                <Menu.Item key="edit">
                    <div className={styles.menuItem}>
                        <span onClick={() => handleEditComment(commentId, comment)} className={styles.spanEdit}>
                            <EditTwoTone className={styles.icon}/>Edit
                        </span>
                    </div>
                </Menu.Item>
                <Menu.Item key="delete">
                    <div className={styles.menuItem}>
                        <span onClick={() => {
                            handleCommentDelete(commentId)
                            setShowCommentTextArea(false)
                            setButtonDisabled(true)
                        }} className={styles.spanDelete}>
                            <DeleteTwoTone twoToneColor="#f83b3f" className={styles.icon}/>Delete
                        </span>
                    </div>
                </Menu.Item>
            </Menu>
        );


        return (
            <Modal
                centered={true}
                open={visible}
                footer={null}
                onCancel={onClose}
                width={1000}
            >
                <div className={styles.overlay}>
                    <div className={styles.img}>
                        <img alt="user-post" src={post} onError={(e) => {
                            (e.target as HTMLImageElement).src = PostPhoto;
                        }}/>
                    </div>
                    <div className={styles.detailsContainer}>
                        <div className={styles.author}>
                            <Avatar src={AvatarPhoto || photo}/>
                            <div style={{marginLeft: '12px'}}>
                                <h3>{capitalizeFirstLetter(name)}</h3>
                                <Text type="secondary">{giveDate(date)}</Text>
                            </div>
                        </div>
                        <p>{description}</p>
                        <div className={styles.commentsContainer}>
                            {commentsState &&
                                Object.keys(commentsState).map((commentId) => {
                                    const comment = commentsState[commentId];
                                    return (
                                        <div key={commentId} className={styles.commentDiv}>
                                            <div className={styles.commentDetails}>
                                                <div>
                                                    <>
                                                        <Avatar src={CommentsAvatar || comment.avatar}/>
                                                        <Text className={styles.commentName} strong>
                                                            {comment.name}
                                                        </Text>
                                                    </>
                                                </div>
                                                <Text type="secondary">{giveDate(comment.date)}</Text>
                                                {email === comment.email && (
                                                    <Dropdown overlay={menu(commentId, comment.comment)}
                                                              placement="bottomLeft">
                                                        <Button type="text" icon={<EllipsisOutlined/>}/>
                                                    </Dropdown>
                                                )}
                                            </div>
                                            <p className={styles.comment}>{comment.comment}</p>
                                        </div>
                                    );
                                })}
                        </div>
                        {showCommentTextArea ? (
                            <div className={styles.commentInput}>
                                <Input.TextArea value={editedComment} onChange={(e) => {
                                    setEditedComment(e.target.value)
                                    if (e.target.value.length >= 200 || e.target.value.trim() === '') {
                                        setButtonDisabled(true);
                                    } else {
                                        setButtonDisabled(false);
                                    }
                                }} placeholder="Can't be empty" rows={2}/>
                                <Button onClick={submitEditedComment} icon={<CommentOutlined/>} type="primary"
                                        disabled={buttonDisabled}>
                                    Submit
                                </Button>
                                <Button onClick={() => {
                                    setShowCommentTextArea(false)
                                    setButtonDisabled(true)
                                }}>Cancel</Button>
                            </div>
                        ) : (
                            <div className={styles.commentInput}>
                                <Input.TextArea value={commentText} onChange={handleInputChange}
                                                placeholder="Max 200 Characters" rows={2}/>
                                <Button onClick={handleCommentPost} icon={<CommentOutlined/>} type="primary"
                                        disabled={buttonDisabled}>
                                    Post Comment
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </Modal>
        );
    }
;

export default PostModal;
