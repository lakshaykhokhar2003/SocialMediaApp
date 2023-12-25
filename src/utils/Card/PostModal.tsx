import React, {useState} from 'react';
import {Modal, Button, Avatar, Typography, Input} from 'antd';
import {CommentOutlined} from '@ant-design/icons';
import styles from './PostModal.module.css'
import {giveDate} from './giveDate';
import {PostData} from "../../pages/PostData";
import axios from "axios";
import useReduxHook from "../../hooks/useReduxHook";
import useAuth from "../../hooks/authHook";

const {Text} = Typography;

const PostModal: React.FC<{
    user: PostData;
    visible: boolean;
    onClose: () => void;

}> = ({user, visible, onClose}) => {
    const {username, avatar, encodedEmail, myComments} = useReduxHook();
    const {updateMyComments} = useAuth();

    const {date, name, description, photo, post, comments} = user;
    const [editedCommentId, setEditedCommentId] = useState<string>("")
    const [commentText, setCommentText] = useState<string>('');
    const [showCommentTextArea, setShowCommentTextArea] = useState<boolean>(false);
    const [editedComment, setEditedComment] = useState<string>("");
    const handleCommentPost = async () => {

        const newComment = {
            name: username,
            avatar: avatar,
            comment: commentText,
            date: new Date().toISOString(),
        };
        const res = await axios.post(`https://algo-bullls-default-rtdb.asia-southeast1.firebasedatabase.app/posts/${user.id}/comments.json`, newComment);
        const commentId = `posts/${user.id}/comments/${res.data.name}`;
        const myCommentsArray = [...(myComments || []), commentId];
        await axios.patch(`https://algo-bullls-default-rtdb.asia-southeast1.firebasedatabase.app/user/-Nm7je81ns7AhjF2E0o3/${encodedEmail}.json`, {myComments: myCommentsArray});
        updateMyComments(myCommentsArray);

        setCommentText('');
    };
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCommentText(e.target.value);
    };

    const handleEditComment = (commentId: string, comment: string) => {
        setShowCommentTextArea(true);
        setEditedComment(comment);
        setEditedCommentId(commentId);
    };

    const handleCommentSubmit = async () => {
        await axios.patch(`https://algo-bullls-default-rtdb.asia-southeast1.firebasedatabase.app/posts/${user.id}/comments/${editedCommentId}.json`, {
            comment: editedComment,
        });
        setShowCommentTextArea(false);
        setEditedComment("");
        setEditedCommentId("");
    };

    const handleCommentDelete = async (commentId: string) => {
        await axios.delete(`https://algo-bullls-default-rtdb.asia-southeast1.firebasedatabase.app/posts/${user.id}/comments/${commentId}.json`);
        const myCommentsArray = myComments.filter((comment: string) => comment !== `posts/${user.id}/comments/${commentId}`);
        await axios.patch(`https://algo-bullls-default-rtdb.asia-southeast1.firebasedatabase.app/user/-Nm7je81ns7AhjF2E0o3/${encodedEmail}.json`, {myComments: myCommentsArray});
        updateMyComments(myCommentsArray);
    }

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
                    <img alt="user-post" src={post}/>
                </div>
                <div className={styles.detailsContainer}>
                    <div className={styles.author}>
                        <Avatar src={photo}/>
                        <div style={{marginLeft: '12px'}}>
                            <h3>{name.charAt(0).toUpperCase() + name.slice(1)}</h3>
                            <Text type="secondary">{giveDate(date)}</Text>
                        </div>
                    </div>
                    <p>{description}</p>
                    <div className={styles.commentsContainer}>
                        {comments &&
                            Object.keys(comments).map((commentId) => {
                                const comment = comments[commentId];
                                return (
                                    <div key={commentId} className={styles.commentDiv}>
                                        <div className={styles.commentDetails}>
                                            <div>
                                                <Avatar src={comment.avatar}/>
                                                <Text className={styles.commentName} strong>
                                                    {comment.name}
                                                </Text>
                                            </div>
                                            <Text type="secondary">{giveDate(comment.date)}</Text>
                                            {username === comment.name && (
                                                <div>
                                                    <Button type="link"
                                                            onClick={() => handleEditComment(commentId, comment.comment)}>Edit</Button>
                                                    <Button type="link" danger
                                                            onClick={() => handleCommentDelete(commentId)}>
                                                        Delete
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                        <p className={styles.comment}>{comment.comment}</p>
                                    </div>
                                );
                            })
                        }
                    </div>
                    {showCommentTextArea ? (
                        <div className={styles.commentInput}>
                            <Input.TextArea
                                value={editedComment}
                                onChange={(e) => setEditedComment(e.target.value)}
                                rows={2}
                            />
                            <Button onClick={handleCommentSubmit} icon={<CommentOutlined/>} type="primary">
                                Submit
                            </Button>
                            <Button onClick={() => setShowCommentTextArea(false)}>Cancel</Button>
                        </div>
                    ) : (
                        <div className={styles.commentInput}>
                            <Input.TextArea
                                value={commentText}
                                onChange={handleInputChange}
                                rows={2}
                            />
                            <Button onClick={handleCommentPost} icon={<CommentOutlined/>} type="primary">
                                Post Comment
                            </Button>
                        </div>
                    )}

                </div>
            </div>
        </Modal>
    );
};

export default PostModal;
