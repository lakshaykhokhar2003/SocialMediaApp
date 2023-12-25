import React from 'react';
import styles from './Login.module.css';
import {Form, Input} from 'antd';
import authHook from "../../hooks/authHook";
import {Link} from "react-router-dom";
import axios from "axios";
import {Base64} from "js-base64";

const Login: React.FC = () => {
    const [form] = Form.useForm();
    const {loginHandler} = authHook()

    const handleSubmit = async () => {
        try {
            await form.validateFields();
            const {email, password} = form.getFieldsValue();
            const encodedEmail = Base64.encode(email);

            try {
                const res = await axios.get(`https://algo-bullls-default-rtdb.asia-southeast1.firebasedatabase.app/user/-Nm7je81ns7AhjF2E0o3/${encodedEmail}.json`)
                if (res.data.password !== password) {
                    return alert("wrong password");
                }
                console.log("user found")
            } catch (e) {
                console.log("error user not found")
            }
            await loginHandler(encodedEmail)
        } catch (error) {
            console.error('Validation failed:', error);
        }
    };

    return (
        <div className={styles.wrapper}>
            <h1 className={styles.title}>Login</h1>
            <Form
                form={form}
                className="validated-form"
                onFinish={handleSubmit}
                initialValues={{email: '', password: ''}}
                noValidate
            >
                <Form.Item
                    name="email"
                    rules={[
                        {required: true, message: 'Please enter your email!'},
                        {type: 'email', message: 'Please enter a valid email address!'},
                    ]}
                    className={styles.inputBox}
                >
                    <Input placeholder="Email" className={styles.input}/>
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[
                        {required: true, message: 'Please input your password!'},
                        {min: 6, message: 'Password should be greater than 6 characters!'},
                        {max: 14, message: 'Password should be less than 14 characters!'}
                    ]}
                    className={styles.inputBox}
                >
                    <Input.Password minLength={6} maxLength={14} className={styles.input} placeholder="Password"/>
                </Form.Item>

                <button type="submit" className={styles.Button}>
                    Login
                </button>
            </Form>
            <div className={styles.registerLink}>
                <p> {`Don't have an account?`} <Link to='/signup'>Register Here</Link></p>
            </div>
        </div>
    );
};

export default Login;
