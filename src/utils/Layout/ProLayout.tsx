import React from 'react';
import styles from './ProLayout.module.css';
import {Outlet, useNavigate} from 'react-router-dom';
import {GithubOutlined, PlusOutlined} from '@ant-design/icons';
import authHook from "../../hooks/authHook";
import useMenuItems from "./useMenuItem";
import {Link} from 'react-router-dom';
import {Layout, Menu} from "antd";
import useReduxHook from "../../hooks/useReduxHook";

const {Sider, Content, Footer} = Layout;

const MyLayout: React.FC = () => {
    const navigate = useNavigate()
    const {useAuthEffect} = authHook()
    const {isAuthenticated} = useReduxHook()
    const {renderMenuItems} = useMenuItems();
    useAuthEffect()

    if (!isAuthenticated) {
        return <div>Not Authenticated</div>
    }

    return (
        <Layout className="d-flex flex-row align-items-center justify-content-center ">
            <div className={styles.sider}>
                <Sider className={styles.siderHeight}>
                    <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                        {renderMenuItems()}
                    </Menu>
                </Sider>
            </div>
            <Layout className={` ${styles.layouts} px-5 h-100`}>
                <div className={`bg-white min-vh-90`}>
                    <div className="row">
                        <div className="d-flex flex-column align-items-center">
                            <Content>
                                <Outlet/>
                            </Content>
                        </div>
                    </div>
                </div>
                <Footer className="footer py-3 w-100 mt-auto text-center">
                    <span>Lakshay Khokhar</span>
                    <Link to="https://github.com/lakshaykhokhar2003">
                        <GithubOutlined style={{margin: '0 8px'}}/>
                    </Link>
                    <span>Copyright © 2023</span>
                </Footer>
            </Layout>
            <div className={styles.newPost} onClick={() => navigate('/create-post')}><PlusOutlined/></div>
        </Layout>
    );
};

export default MyLayout;
