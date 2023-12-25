import {Table} from "antd";
import usePostHook from "./usePostHook";

const Posts: React.FC = () => {
    const {columns, userData, expandedRowKeysConfig} = usePostHook()

    return <Table columns={columns} dataSource={userData} rowKey="id" {...expandedRowKeysConfig}/>;
};

export default Posts;
