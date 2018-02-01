import React from 'react';
import { Table, Button, Modal, Col, Row, Input, Popconfirm, Form, Tree } from 'antd';
import PosModal from './modal';
import { getUserInfo } from '../../../utils/';
const confirm = Modal.confirm;
const Search = Input.Search;
const FormItem = Form.Item;
const TreeNode = Tree.TreeNode;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};
function AuthTable({ dispatch, dataSource, checked, halfChecked, editId, searchData, loading, pagination, visible, isNew, expandedKeys, scmList, autoExpandParent, selectValue, postName }) {
  const columns = [{
    title: '岗位名称',
      dataIndex: 'postName',
      key: 'postName',
    }, {
      title: '岗位现有人数',
      dataIndex: 'perCount',
      key: 'perCount',
    }, {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: (d, r) => (
        <p>
          <a onClick={() => onEditItem(r)} className="authStatus">{ r.status ? <span style={{ color: 'red' }}>停用</span> : <span>启用</span>}</a>
          <a style={{ marginLeft: 10 }} onClick={() => editAuthority(r)}>编辑</a>
          { !r.isSystem && 
            <Popconfirm placement="top" title={"确定要删除吗？"} onConfirm={ () =>  delAuth(r)} okText="确定" cancelText="取消">
            <a style={{ color: 'red', marginLeft: 10 }}>删除</a> 
            </Popconfirm>
          }
        </p>
      ) 
  }];
  const delAuth = (r) => {
    dispatch({
      type: 'postAuthority/deleteAuthority',
      id: r.id,
    });
    dispatch({
      type: 'postAuthority/fetchList',
    });
  }
  const onSearch = (value) => {
    dispatch({
      type: 'postAuthority/setSearchData',
      searchData: value
    });
    dispatch({
      type: 'postAuthority/fetchList',
    })
  };
  const onEditItem = (r) => {
    dispatch({
      type: 'postAuthority/updateAuthStatus',
      payload: {
        id: r.id,
        status: r.status ? 0 : 1,
      }
    })
  };
  const onPageChange = (page, filters, sorter) => {
    dispatch({
      type: 'postAuthority/setPagination',
      pagination: page,
    });
    dispatch({
      type: 'postAuthority/fetchList'
    })
  };
  const addAuthority = () => {
    dispatch({
      type: 'postAuthority/showModal',
      isNew: true,
    });
  };
  const editAuthority = (r) => {
    dispatch({
      type: 'postAuthority/showModal',
      isNew: false,
    });
    dispatch({
      type: 'postAuthority/editBasPost',
      id: r.id,
    })
  }
  const params = {
    visible,
    isNew,
    dispatch,
    expandedKeys,
    scmList,
    autoExpandParent,
    selectValue,
    postName,
    editId,
    checked,
    halfChecked,
  };
  return (
    <div>
      <Row style={{ marginTop: '50px', paddingBottom: '20px' }}>
        <Col span={3}>
          <Button style={{ padding: '0 30px' }} type="primary" size="large" onClick={addAuthority}>新增岗位权限</Button>
        </Col>
        <Col style={{ float: 'right', marginTop: 4 }}>
          <Search
            style={{ width: 230 }}
            placeholder="请输入岗位名称"
            onSearch={onSearch}
            maxLength ={"10"}
          />
        </Col>
      </Row>
      <Table 
        dataSource = {dataSource} 
        columns = {columns}
        bordered
        loading = {loading}
        pagination = {pagination}
        onChange = {onPageChange}
        rowKey={ r => r.id }
      />
      <PosModal { ...params }/>
    </div>
  );
}

export default AuthTable;
