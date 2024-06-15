import {useState} from 'react';
import {Form, Input, Button, Avatar, Typography} from 'antd';
import {UserOutlined, EditTwoTone} from '@ant-design/icons';
import useReduxHook from "../../hooks/useReduxHook";
import axios from "axios";
import useAuth from "../../hooks/authHook";
import {ValidateErrorEntity} from 'rc-field-form/es/interface';
import styles from "./Profile.module.css";
import AvatarPhoto from "../../utils/avatar.jpg"

const {Title} = Typography;

const Profile: React.FC = () => {
    const {avatar, username, email, encodedEmail, myposts, myComments, usersApi, postsApi} = useReduxHook();
    const {updateProfile} = useAuth()

    const [form] = Form.useForm();
    const [editMode, setEditMode] = useState<boolean>(false);
    const [profilePhoto, setProfilePhoto] = useState<string>(avatar);
    const onFinish = async () => {
        await form.validateFields();
        const values = form.getFieldsValue();
        const data = {name: values.name, avatar: values.photoUrl}
        await axios.patch(`${usersApi}/${encodedEmail}.json`, data);

        await Promise.all(  // Update all your myPosts with new name
            myposts.map(async (postId: string) => {
                return await axios.patch(
                    `${postsApi}/${postId}.json`,
                    data
                );
            })
        );
        await Promise.all(  // Update all your comments with new name
            myComments.map(async (commentId: string) => {
                return await axios.patch(
                    `https://algo-bullls-default-rtdb.asia-southeast1.firebasedatabase.app/${commentId}.json`,
                    data
                );

            })
        );
        updateProfile(values.name, values.photoUrl)
        setEditMode(!editMode);
        if (values.photoUrl) {
            setProfilePhoto(values.photoUrl);
        }
    };

    const onFinishFailed = (errorInfo: ValidateErrorEntity) => {
        console.log('Failed:', errorInfo);
    };


    const renderInput = (fieldName: string, rules?: object[]) => {
        const disabled = fieldName === 'email';
        return (
            <Form.Item
                label={fieldName === 'name' ? 'Name' : (fieldName === 'email' ? 'Email' : 'Profile Photo (Image URL)')}
                name={fieldName}
                rules={rules}
            >
                <Input
                    prefix={<UserOutlined/>}
                    disabled={disabled || (!editMode && fieldName === 'name')}
                    placeholder={fieldName === 'name' ? 'Enter Name' : 'Enter Image URL'}

                />
            </Form.Item>
        );
    };

    return (
        <div className={styles.topDiv}>
            <Title level={2}>My Profile</Title>
            <Form
                form={form}
                initialValues={{
                    email: email,
                    name: username,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                layout="vertical"
                className="d-flex flex-column align-items-center"
            >
                <Form.Item>
                    <Avatar size={100} src={AvatarPhoto || profilePhoto}/>
                </Form.Item>
                {renderInput('email', [{required: true, message: 'Please input your email!'}])}
                {renderInput('name', [{required: true, message: 'Please input your name!'}])}
                {editMode && renderInput('photoUrl', [{type: 'url', message: 'Please enter a valid URL!'}])}

                <Form.Item>
                    {editMode ? (
                        <>
                            <Button type="primary" onClick={() => form.submit()}>Save Changes</Button>
                            <Button onClick={() => setEditMode(!editMode)}>Cancel</Button>
                        </>
                    ) : (
                        <Button icon={<EditTwoTone/>} onClick={() => setEditMode(!editMode)}>Edit</Button>
                    )}
                </Form.Item>
            </Form>
        </div>
    );
};
export default Profile;
