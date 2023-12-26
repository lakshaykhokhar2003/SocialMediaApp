import React from 'react';
import {Outlet, useNavigate} from 'react-router-dom';
import {GithubOutlined, PlusOutlined} from '@ant-design/icons';
import authHook from '../hooks/authHook';
import useMenuItems from './useMenuItem';
import {Link} from 'react-router-dom';
import {Layout, Menu} from 'antd';
import 'react-toastify/dist/ReactToastify.css';
import useReduxHook from "../hooks/useReduxHook";
import styles from './ProLayout.module.css';

const {Sider, Content, Footer} = Layout;

const MyLayout: React.FC = () => {
    const {useAuthEffect} = authHook();
    const {isAuthenticated} = useReduxHook();
    const navigate = useNavigate();
    const {renderMenuItems} = useMenuItems();
    useAuthEffect();

    if (!isAuthenticated) {
        return <div>Not Authenticated</div>;
    }

    return (
        <div className={styles.topDiv}>
            <div className={styles.sider}>
                <Sider className={styles.siderHeight}>
                    <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                        {renderMenuItems()}
                    </Menu>
                </Sider>
            </div>
            <div className={styles.TopLayoutDiv}>
                <Layout className={styles.Layout}>
                    <div className={styles.LayoutContent}>
                        <Content>
                            <Outlet/>
                        </Content>
                    </div>
                    <Footer className={styles.footer}>
                        <span>Lakshay Khokhar</span>
                        <Link to="https://github.com/lakshaykhokhar2003">
                            <GithubOutlined/>
                        </Link>
                        <span>Copyright © 2023</span>
                    </Footer>
                </Layout>
                <div className={styles.newPost}
                     onClick={() => navigate('/create-post')}
                >
                    <PlusOutlined/>
                </div>
            </div>
        </div>
    );
};

export default MyLayout;
