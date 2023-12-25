import React from 'react';
import {Modal} from 'antd';

interface ReusableModalProps {
    title: string;
    visible: boolean;
    onOk: () => void;
    onCancel: () => void;
    children: React.ReactNode;
}

const ReusableModal: React.FC<ReusableModalProps> = ({title, visible, onOk, onCancel, children}) => {
    return (
        <Modal title={title} open={visible} onOk={onOk} onCancel={onCancel}>
            {children}
        </Modal>
    );
};

export default ReusableModal;