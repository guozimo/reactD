import React, { PropTypes } from 'react'
import { Table, Popconfirm, Menu, Row, Col, Tree, Modal, Button } from 'antd'
import DcViewModal from './dcViewModal';
import DcEditModal from './dcEditModal';
import DcTableModal from './chooseDcModal';
const TreeNode = Tree.TreeNode;
function dcList({
  dispatch,
  paginationDc,
  searchDcData,
  dcList,
  dcSource,
  dcView,
  dcEdit,
  dcStoreChoose,
  dcModal,
  provinceList,
  cityList,
  districtList,
  visible,
  loading,
  modalTable,
  modalLoading,
  paginationModal,
  tenName,
  contactStore,
  distribId,
  selectModalList,
  dcId,
}){
  const onStoreView = (r) => {
    dispatch({
      type: 'chainSet/setDcModal',
      dcModal: '1',
    });
    dispatch({
      type: 'chainSet/showModal',
    });
    dispatch({
      type: 'chainSet/getDcInfo',
      id: r.id,
    });
  };
  const onStoreEdit = (r) => {
    dispatch({
      type: 'chainSet/setDcModal',
      dcModal: '2',
    });
    dispatch({
      type: 'chainSet/showModal',
    });
    dispatch({
      type: 'chainSet/getDcInfo',
      id: r.id,
    });
  };
  const onCancel = () => {
    dispatch({
      type: 'chainSet/hideModal',
    });
  };
  const chooseDcStore = (value) => {
    dispatch({
      type: 'chainSet/setDcModal',
      dcModal: '3',
    });
    dispatch({
      type: 'chainSet/setDistribId',
      distribId: value.id,
    });
    // dispatch({
    //   type: 'chainSet/showModal',
    // });
    dispatch({
      type: 'chainSet/assignToStore',
    });
  };
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
  const columns = [{
    title: '组织结构树',
    dataIndex: 'treeNode',
    key: 'treeNode',
    colSpan: 1,
    width: 200,
    render: (value, row, index) => {
      const children = (<Tree
        showLine
        className="storeTree"
        defaultExpandedKeys = {['00000000-0000-0000-0000-000000000000']}
        defaultSelectedKeys = {[dcId]}
        onSelect={onSelect}
        showIcon = {false}
      >
        {renderTreeNodes(row.treeNode)}
      </Tree>)
      const length = dcSource && dcSource.length;
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
          '143': '正常营业',
          '148': '已过期',
          '149': '关闭',
        };
        return (<span>{ status[r.status] }</span>)
      },
    }, {
      title: '通用操作',
      width: 150,
      dataIndex: 'operation',
      key: 'operation',
      render: (d, r) => {
        return (<div><a onClick={ () => chooseDcStore(r) }>配送门店</a><a onClick={ () => onStoreView(r) } style={{ marginLeft: '10px' }}>查看</a><a onClick={ () => onStoreEdit(r) } style={{ marginLeft: '10px' }}>编辑</a></div>)
      }
  }];
 
  const onSelect = (value) => {
    dispatch({
      type: 'chainSet/fetchDcList',
      id: value[0]=== '00000000-0000-0000-0000-000000000000' ? '' : value[0],
    });
  };
  const onPageChange = (page, filters, sorter) => {
    dispatch({
      type: 'chainSet/setDcPagination',
      pagination: page,
    });
    dispatch({
      type: 'chainSet/fetchDcList'
    });
  };
  const dcViewInfo = {
    dispatch,
    dcView,
    visible,
    provinceList,
    cityList,
    districtList,
    modalTable,
    modalLoading,
  };
  const dcModalInfo = {
    modalTable,
    modalLoading,
    paginationModal,
    dispatch,
    visible,
    tenName,
    contactStore,
    distribId,
    selectModalList,
  }
	return(<div style={{ marginTop: 20 }}>
      <Table
        key={(new Date()).getTime()}
        columns={columns}
        loading = {loading}
        bordered
        dataSource = { dcSource }
        rowKey={r => r.id}
        pagination = {paginationDc}
        onChange = {onPageChange}
      ></Table>
      { dcModal === '1' && <DcViewModal { ...dcViewInfo } />}
      { dcModal === '2' && <DcEditModal { ...dcViewInfo } /> }
      { dcModal === '3' && <DcTableModal { ...dcModalInfo } /> }
	</div>)
}
export default dcList;