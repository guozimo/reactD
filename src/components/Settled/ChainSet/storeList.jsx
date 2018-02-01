import React, { PropTypes } from 'react'
import { Table, Popconfirm, Menu, Row, Col, Tree, Modal, Button } from 'antd'
import StoreViewModal from './storeViewModal';
import StoreEditModal from './storeEditModal';
const TreeNode = Tree.TreeNode;
function list({
  dispatch,
  loading,
  storeList,
  storeSource,
  pagination,
  storeView,
  storeEdit,
  visible,
  storeModal,
  provinceList,
  cityList,
  districtList,
  storeId,
}){
  const onStoreView = (r) => {
    dispatch({
      type: 'chainSet/setStoreModal',
      storeModal: '1',
    });
    dispatch({
      type: 'chainSet/showModal',
    });
    dispatch({
      type: 'chainSet/getStoreInfo',
      id: r.id,
    });
  };
  const onStoreEdit = (r) => {
    dispatch({
      type: 'chainSet/setStoreModal',
      storeModal: '2',
    });
    dispatch({
      type: 'chainSet/showModal',
    });
    dispatch({
      type: 'chainSet/getStoreInfo',
      id: r.id,
    });
  };
  const onCancel = () => {
    dispatch({
      type: 'chainSet/hideModal',
    });
  }
  const columns = [{
    title: '组织结构树',
    dataIndex: 'treeNode',
    key: 'treeNode',
    colSpan: 1,
    width: 150,
    render: (value, row, index) => {
      const children = (<Tree
        showLine
        className="storeTree"
        defaultExpandedKeys = {['00000000-0000-0000-0000-000000000000']}
        defaultSelectedKeys = {[storeId]}
        onSelect={onSelect}
        showIcon = {false}
      >
        {renderTreeNodes(row.treeNode)}
      </Tree>)
      const length = storeSource && storeSource.length;
      const obj = {
        children: children,
        props: {},
      };
      if(index == 0) {
        obj.props.rowSpan = 100;
      } else {
        obj.props.rowSpan = 0;
      }
      return obj;
    },
    }, {
      title: '机构名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    }, {
      title: '隶属机构',
      dataIndex: 'parentName',
      key: 'parentName',
      width: 150,
    }, {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (d, r) => {
        const status = {
          '136': '未激活',
          '137':  '已激活',
          '141': '启动',
          '142': '实施上线',
          '143': '正常营业',
          '144': '暂停营业',
          '145': '即将开业',
          '146': '倒闭',
          '148': '已过期',
          '149': '关闭',
        };
        return (<span>{ status[r.status] }</span>)
      },
    }, {
      title: '通用操作',
      dataIndex: 'operation',
      key: 'operation',
      width: 150,
      render: (d, r) => {
        return (<div><a onClick={ () => onStoreView(r) }>查看</a><a onClick={ () => onStoreEdit(r) } style={{ marginLeft: '10px' }}>编辑</a></div>)
      }
  }];
  const renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode className="childNode" title={item.title} key={item.key} dataRef={item}>
            {renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} dataRef={item}/>;
    });
  };
  const onSelect = (value) => {
    dispatch({
      type: 'chainSet/fetchList',
      id: value[0],
    });
  };
  const onPageChange = (page, filters, sorter) => {
    dispatch({
      type: 'chainSet/setPagination',
      pagination: page,
    });
    dispatch({
      type: 'chainSet/fetchList'
    });
  };
  const storeViewInfo = {
    dispatch,
    storeView,
    visible,
    provinceList,
    cityList,
    districtList,
  };
	return(<div style={{ marginTop: 20 }}>
      <Table
        columns={columns}
        loading = {loading}
        bordered
        dataSource = { storeSource }
        rowKey={r => r.id}
        pagination = {pagination}
        onChange = {onPageChange}
      ></Table>
      { storeModal === '1' &&  <StoreViewModal { ...storeViewInfo } />}
      { storeModal === '2' &&  <StoreEditModal { ...storeViewInfo } />}
	</div>)
}
export default list;
