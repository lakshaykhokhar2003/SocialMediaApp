import React from 'react';
import {Typography, Form, Input, Button} from 'antd';
import {GoogleOutlined} from '@ant-design/icons';
import authHook from "../../hooks/authHook";
import {Link} from "react-router-dom";
import useReduxHook from "../../hooks/useReduxHook";

const {Title} = Typography;

const SignUp: React.FC = () => {
    const [form] = Form.useForm();
    const {registerHandler} = authHook()
    const {encodedEmail} = useReduxHook()
    const handleSubmit = async (values: any) => {
        try {
            await form.validateFields();
            const username = values.username;
            const email = values.email;
            const password = values.password;
            const avatar = `https://source.unsplash.com/random/?avatar=${Math.floor(Math.random() * 100)}`;
            const data = {
                name: username,
                email: email,
                password: password,
                avatar: avatar,
            }
            await registerHandler(encodedEmail, data)
            console.log('Logged In');
        } catch (error) {
            console.error('Validation failed:', error);
        }
    };

    return (
        <>
            <Title level={1} className='text-center'>Sign Up</Title>
            <Form
                form={form}
                className="validated-form"
                onFinish={handleSubmit}
                initialValues={{username: '', email: '', password: ''}}
                labelCol={{span: 8}}
                wrapperCol={{span: 16}}
            >
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[{required: true, message: 'Please input your username!'}]}
                >
                    <Input/>
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        {required: true, message: 'Please input your email!'},
                        {type: 'email', message: 'Invalid email format!'},
                    ]}
                >
                    <Input placeholder="Email"/>
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{required: true, message: 'Please input your password!'}]}
                >
                    <Input.Password minLength={6} maxLength={14}/>
                </Form.Item>

                <Form.Item wrapperCol={{span: 16, offset: 8}}>
                    <Button type="primary" htmlType="submit">
                        Register
                    </Button>
                </Form.Item>
            </Form>
            <div className="align-self-center"><Link to='/login'>Already have a account?</Link></div>
            <div className="d-flex flex-row align-items-center justify-content-center">
                <GoogleOutlined/>
                <p className="btnText align-self-auto"><b>Sign in with Google</b></p>
            </div>

        </>
    );
};

export default SignUp;
