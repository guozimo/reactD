import React, { PropTypes } from 'react';
import { Table, Modal, Button} from 'antd';

function dcTableModal({
  modalTable,
  modalLoading,
  paginationModal,
  dispatch,
  visible,
  tenName,
  contactStore,
  distribId,
  selectModalList,
}){
  const onCancel = () => {
    dispatch({
      type: 'chainSet/hideModal',
    });
  };
  const onOk = () => {
    dispatch({
      type: 'chainSet/saveModalData',
      distribId,
    });
  };
  const columns = [{
    title: '门店名称',
    dataIndex: 'storeName',
    width: 100,
    }, {
      title: '关联配送中心',
      dataIndex: 'distribName',
      width: 200,
    }, {
      width: 100,
      title: '分配状态',
      dataIndex: 'isCanAssign',
      render: (d, r) => {
        return (<div>{r.isCanAssign ? '可分配' : '不可分配'}</div>)
      },
  }];

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      dispatch({
        type: 'chainSet/setContactStore',
        contactStore: selectedRowKeys,
        selectModalList: selectedRows,
      });
    },
    getCheckboxProps: record => ({
      disabled: !record.isCanAssign,
    }),
    selectedRowKeys: contactStore,
  };
  const onPageChange = (page, filters, sorter) => {
    dispatch({
      type: 'chainSet/setModalPagination',
      pagination: page,
    });
    dispatch({
      type: 'chainSet/assignToStore',
    });
  };
  return(<div style={{ marginTop: 20 }}>
    <Modal
      width={810}
      title={`所属机构:${' '+ tenName}`}
      visible = {visible}
      footer={[
        <Button key="back" size="large" onClick={onCancel}>取消</Button>,
        <Button key="save" size="large" type="primary" onClick={onOk}>保存</Button>,
      ]}
      onCancel={onCancel}
      maskClosable={false}
    >
      <Table
        loading = {modalLoading}
        columns={columns}
        rowSelection = {rowSelection}
        pagination = {paginationModal}
        dataSource = { modalTable }
        rowKey={r => r.storeId}
        bordered
        onChange = {onPageChange}
      />
    </Modal>
  </div>)
}
export default dcTableModal;