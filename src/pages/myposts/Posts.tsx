import styles from '../emptydata.module.css'
import {Table, Typography} from "antd";
import usePostHook from "./usePostHook";

const {Title} = Typography;

const Posts: React.FC = () => {
    const {columns, userData, expandedRowKeysConfig} = usePostHook()
    return (
        userData.length > 0 ? <Table columns={columns} dataSource={userData} rowKey="id" {...expandedRowKeysConfig}/> :
            <div className={styles.topDiv}>
                <div className={styles.img}></div>
                <Title level={2}>No Posts</Title>
            </div>
    )
};

export default Posts;
