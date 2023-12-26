import {HomeFilled, HeartFilled, BookFilled, SnippetsFilled, UserOutlined, LogoutOutlined} from '@ant-design/icons';
import {Link} from 'react-router-dom';
import authHook from "../hooks/authHook";
import {Menu} from "antd";

const useMenuItems = () => {
    const {logoutHandler} = authHook()
    const newMenuItems = [
        {
            key: '1',
            icon: <HomeFilled style={{color: '#1890ff'}}/>,
            text: 'Home',
            link: '/',
        },
        {
            key: '2',
            icon: <HeartFilled style={{color: '#ff69b4'}}/>,
            text: 'My Likes',
            link: '/my-likes',
        },
        {
            key: '3',
            icon: <BookFilled style={{color: '#efd81d'}}/>,
            text: 'My Bookmarks',
            link: '/my-bookmarks',
        },
        {
            key: '4',
            icon: <SnippetsFilled style={{color: '#fa8c16'}}/>,
            text: 'My Posts',
            link: '/my-myposts',
        },
        {
            key: '5',
            icon: <UserOutlined style={{color: '#A6A6A6'}}/>,
            text: 'My Profile',
            link: '/profile',
        },
        {
            key: '6',
            icon: <LogoutOutlined/>,
            text: 'Logout',
            onClick: logoutHandler
        },
    ];
    const renderMenuItems = () => {
        return newMenuItems.map((item) => (
            <Menu.Item key={item.key} icon={item.icon}>
                {item.link ? (<Link to={item.link}>{item.text}</Link>) : (
                    <span onClick={item.onClick}>{item.text}</span>)}
            </Menu.Item>
        ));
    };

    return {renderMenuItems};
};

export default useMenuItems;
