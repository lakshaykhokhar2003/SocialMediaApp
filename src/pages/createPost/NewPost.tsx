import {useState} from 'react';
import styles from './NewPost.module.css';
import {Card, Input, Button, Form} from 'antd';
import axios, {AxiosResponse} from "axios";
import {useNavigate} from "react-router-dom";
import useReduxHook from "../../hooks/useReduxHook";
import useAuth from "../../hooks/authHook";


const CreatePostCard = () => {
    const {username, avatar, encodedEmail, myposts, usersApi, postsApi} = useReduxHook()
    const {updateMyPosts} = useAuth()

    const [form] = Form.useForm();

    const [postImage, setPostImage] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate()
    const handleSubmit = async () => {
        const newPostData = {
            post: postImage,
            description: description,
            date: new Date(),
            likes: 0,
            name: username,
            photo: avatar,
        };
        const res: AxiosResponse<{ name: string }> = await axios.post(
            `${postsApi}.json`, newPostData);

        const id = res.data.name;
        const updatedPosts = [...(myposts || []), id];
        updateMyPosts(updatedPosts);

        await axios.patch(
            `${usersApi}/${encodedEmail}.json`,
            {myposts: updatedPosts}
        );

        setPostImage('');
        setDescription('');
        navigate('/')
    };

    return (
        <div className={styles.coverDiv}>
            <Card
                hoverable
                cover={<img alt="post-cover"
                            src="https://images.unsplash.com/photo-1702136999448-a9337bb19cbd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTcwMzE0MjE3OQ&ixlib=rb-4.0.3&q=80&w=1080"/>}
                className={`${styles.mainCard}`}
            >
                <Form
                    form={form}
                    onFinish={handleSubmit}
                    initialValues={{postImage: '', description: ''}}
                >
                    <Form.Item
                        name="postImage"
                        rules={[
                            {required: true, message: 'Please enter a valid image URL!'},
                            {
                                type: 'url',
                                message: 'Please enter a valid URL format!',
                            },
                        ]}
                    >
                        <Input
                            placeholder="Post Image URL"
                            value={postImage}
                            onChange={(e) => setPostImage(e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        rules={[
                            {required: true, message: 'Description is required!'},
                            {min: 1, message: 'Description should be greater than 0 characters!'},
                        ]}
                    >
                        <Input.TextArea
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Form.Item>
                    <div>
                        <Button htmlType="submit">Submit</Button>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default CreatePostCard;
