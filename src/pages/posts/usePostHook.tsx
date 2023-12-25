import React, {useEffect, useState} from "react";
import {PostData} from "../PostData";
import axios, {AxiosResponse} from "axios";
import {Button, Input, Space, Typography} from "antd";
import useReduxHook from "../../hooks/useReduxHook";
import useAuth from "../../hooks/authHook";
import ReusableModal from "./ReusableModal";
import styles from "../../utils/Card/PostModal.module.css";
import {giveDate} from "../../utils/Card/giveDate";

const {Text} = Typography;

const usePostHook = () => {
    const {myposts, encodedEmail} = useReduxHook()
    const {updateMyPosts} = useAuth()

    const [userPosts, setUserPosts] = useState<PostData[]>([]);
    const [editId, setEditId] = useState<string | null>(null);
    const [editedField, setEditedField] = useState<keyof PostData | null>(null);
    const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
    const [deletePostModalVisible, setDeletePostModalVisible] = useState<boolean>(false);
    const [deleteCommentModalVisible, setDeleteCommentModalVisible] = useState<boolean>(false);

    const handleDeletePostModalCancel = () => {
        setDeletePostModalVisible(false);
    };

    const handleDeleteCommentModalCancel = () => {
        setDeleteCommentModalVisible(false);
    };

    const handleExpand = (expanded: boolean, record: PostData) => {
        const keys = expanded
            ? [...expandedRowKeys, record.id || '']
            : expandedRowKeys.filter((key) => key !== record.id);
        setExpandedRowKeys(keys);
    };

    const handleCancelEdit = () => {
        setEditId(null);
        setEditedField(null);
    };

    const expandedRowKeysConfig = {
        expandedRowKeys,
        onExpand: handleExpand,
        expandedRowRender: (record: PostData) => {
            const handleCommentDelete = async (commentId: string) => {
                const updatedComments = {...record.comments};
                delete updatedComments[commentId];
                const updatedRecord = {...record, comments: updatedComments};

                try {
                    await axios.put(
                        `https://algo-bullls-default-rtdb.asia-southeast1.firebasedatabase.app/posts/${record.id}.json`,
                        updatedRecord
                    );
                    console.log(`Comment deleted for ID: ${record.id}`);
                } catch (error) {
                    console.error('Error deleting comment:', error);
                }
            };


            const commentsArray = Object.keys(record.comments).map((commentId) => ({
                id: commentId,
                ...(record.comments || {})[commentId],
            }));

            if (!commentsArray || commentsArray.length === 0) return <p>No comments</p>;

            return (
                <ul>
                    {commentsArray.map((comment, index) => (
                        <li key={index}>
                            <div>
                                <p className={styles.comment}>{comment.comment}</p> ~
                                <Text className={styles.commentName} strong>{comment.name}</Text>
                                <Text type="secondary" className="m-lg-2">{giveDate(comment.date)}</Text>

                            </div>
                            {editId === record.id && (
                                <>
                                    <Button danger onClick={() => setDeleteCommentModalVisible(true)}>
                                        Delete
                                    </Button>
                                    <ReusableModal
                                        title="Delete Comment"
                                        visible={deleteCommentModalVisible}
                                        onOk={() => {
                                            handleCommentDelete(comment.id);
                                            setDeletePostModalVisible(false);
                                        }}
                                        onCancel={handleDeleteCommentModalCancel}
                                    >
                                        <p>Are you sure you want to delete this comment?</p>
                                    </ReusableModal>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            );
        },
    };


    const handleDeletePosts = async (id: string) => {
        try {
            await axios.delete(`https://algo-bullls-default-rtdb.asia-southeast1.firebasedatabase.app/posts/${id}.json`);
            const filteredData = myposts.filter((postId: string) => postId !== id);
            updateMyPosts(filteredData);
            myposts && myposts.includes(id) && await axios.patch(`https://algo-bullls-default-rtdb.asia-southeast1.firebasedatabase.app/user/-Nm7je81ns7AhjF2E0o3/${encodedEmail}.json`, {myposts: filteredData});
            console.log(`Post with ID ${id} deleted`);
        } catch (error) {
            console.error(`Error deleting post with ID ${id}:`, error);
        }
    };


    const handleInputChange = (value: string, field: keyof PostData, id: string) => {

        setUserPosts((prevState) =>
            prevState.map((item) =>
                item.id === id ? {...item, [field]: value} : item
            )
        );

        setEditedField(field);
    };

    const handleEditPosts = async (id: string) => {
        const currentItem = userPosts.find((item) => item.id === id);
        if (!currentItem) return;

        try {
            const currentDate = new Date().toISOString();
            await axios.put(
                `https://algo-bullls-default-rtdb.asia-southeast1.firebasedatabase.app/posts/${id}.json`,
                {
                    ...currentItem,
                    date: currentDate,
                }
            );
            console.log(`Data updated for ID: ${id}`);
        } catch (error) {
            console.error('Error updating data:', error);
        }
        setEditId(null);
    };


    useEffect(() => {

        const fetchMyPosts = async () => {
            try {
                const postsData: PostData[] = await Promise.all(
                    myposts.map(async (postId: string) => {
                        const res: AxiosResponse<PostData> = await axios.get(
                            `https://algo-bullls-default-rtdb.asia-southeast1.firebasedatabase.app/posts/${postId}.json`
                        );
                        const commentsResponse: AxiosResponse<any> = await axios.get(
                            `https://algo-bullls-default-rtdb.asia-southeast1.firebasedatabase.app/posts/${postId}/comments.json`
                        );
                        const postWithComments: PostData = {
                            ...res.data,
                            id: postId,
                            comments: commentsResponse.data || {}
                        };
                        return postWithComments;

                    })
                );
                setUserPosts(postsData.filter((post) => post !== null));
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchMyPosts();
    }, [myposts, encodedEmail]);

    return {
        userData: userPosts,
        columns: [
            {
                title: "Id",
                dataIndex: "id",
                key: "id",
            },
            {
                title: "Description",
                dataIndex: "description",
                key: "description",
                render: (text: string, record: PostData) =>
                    editId === record.id ? (
                        <Input.TextArea
                            value={text}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange(e.target.value, "description", record.id || "")}
                            style={{width: 200}}
                        />
                    ) : (
                        text
                    ),
            },
            {
                title: "Post",
                dataIndex: "post",
                key: "post",
                render: (text: string, record: PostData) =>
                    editId === record.id ? (
                        <Input.TextArea
                            value={text}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange(e.target.value, "post", record.id || "")}
                            style={{width: 200}}
                        />
                    ) : (
                        text
                    ),
            }, {
                title: 'Comments',
                dataIndex: 'comments',
                key: 'comments',
                render: (_: any, record: PostData) => (
                    <Button onClick={() => handleExpand(!expandedRowKeys.includes(record.id || ''), record)}>
                        {expandedRowKeys.includes(record.id || '') ? 'Hide Comments' : 'Show Comments'}
                    </Button>
                ),
            },
            {
                title: "Date",
                dataIndex: "date",
                key: "date",
                render: (text: string) => new Date(text).toLocaleDateString(),


            },
            {
                title: "Actions",
                key: "action",
                render: (text: any, record: PostData) => (
                    <Space size="middle">
                        {editId === record.id ? (
                            <>
                                <Button onClick={() => handleEditPosts(record.id || "")}>
                                    Save
                                </Button>
                                <Button onClick={handleCancelEdit}>Cancel</Button>
                            </>
                        ) : (
                            <Button onClick={() => setEditId(record.id || "")}>Edit</Button>
                        )}
                        <Button danger onClick={() => setDeletePostModalVisible(true)}>Delete</Button>
                        <ReusableModal
                            title="Delete Post"
                            visible={deletePostModalVisible}
                            onOk={() => {
                                handleDeletePosts(record.id || "");
                                setDeletePostModalVisible(false);
                            }}
                            onCancel={handleDeletePostModalCancel}
                        >
                            <p>Are you sure you want to delete this post?</p>
                        </ReusableModal>
                    </Space>
                ),
            },
        ],
        expandedRowKeysConfig,

    };
}

export default usePostHook


