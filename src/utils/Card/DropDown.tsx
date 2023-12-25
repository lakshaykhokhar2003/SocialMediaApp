import { Dropdown, Menu } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { MenuInfo } from 'rc-menu/lib/interface'; // Import MenuInfo type from 'rc-menu' to be used for type declaration
interface DropDownProps {
    onEdit: () => void;
}

const DropDown: React.FC<DropDownProps> = ({ onEdit }) => {
    const handleMenuClick = (e: MenuInfo) => {
        if (e.key === 'edit') {
            onEdit(); // Trigger the onEdit function passed as a prop
        } else if (e.key === 'delete') {
            console.log('Delete');
        }
    };

    const menu = (
        <Menu onClick={handleMenuClick}>
            <Menu.Item key="edit">Edit</Menu.Item>
            <Menu.Item key="delete" danger>
                Delete
            </Menu.Item>
        </Menu>
    );

    return (
        <Dropdown overlay={menu} placement="bottomRight" trigger={['click']}>
            <EllipsisOutlined style={{ fontSize: '24px', cursor: 'pointer' }} />
        </Dropdown>
    );
};

export default DropDown;