import React from 'react';
import {Form, Input} from 'antd';
import authHook from "../../hooks/authHook";
import {Link} from "react-router-dom";
import styles from './commonStyles.module.css'
import {Base64} from "js-base64";


const SignUp: React.FC = () => {
    const {registerHandler} = authHook()
    const [form] = Form.useForm();

    const handleSubmit = async () => {
        try {
            await form.validateFields();
            const {username, email, password} = form.getFieldsValue();
            const encodedEmail = Base64.encode(email)
            const avatar = `https://source.unsplash.com/random/?avatar=${Math.floor(Math.random() * 100)}`;
            const data = {
                name: username,
                email: email,
                password: password,
                avatar: avatar,
            }
            console.log()
            await registerHandler(encodedEmail, data)
            console.log('Logged In');
        } catch (error) {
            console.error('Validation failed:', error);
        }
    };

    return (
        <div className={styles.wrapper}>
            <h1 className={styles.title}>SignUp</h1>
            <Form
                form={form}
                className="validated-form"
                onFinish={handleSubmit}
                initialValues={{username: '', email: '', password: ''}}
            >
                <Form.Item
                    name="username"
                    rules={[{required: true, message: 'Please input your username!'}]}
                    className={styles.inputBox}
                >
                    <Input className={styles.input} placeholder="Username"/>
                </Form.Item>

                <Form.Item
                    name="email"
                    rules={[
                        {required: true, message: 'Please input your email!'},
                        {type: 'email', message: 'Invalid email format!'},
                    ]}
                    className={styles.inputBox}
                >
                    <Input className={styles.input} placeholder="Email"/>
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[{required: true, message: 'Please input your password!'}]}
                    className={styles.inputBox}
                >
                    <Input.Password minLength={6} maxLength={14} className={styles.input} placeholder="Password"/>
                </Form.Item>


                <button onSubmit={handleSubmit} className={styles.Button}>
                    Register
                </button>
            </Form>
            <div className={styles.registerLink}><p>Already have a account? <Link to='/login'>Login Here</Link></p>
            </div>


        </div>
    );
};

export default SignUp;
