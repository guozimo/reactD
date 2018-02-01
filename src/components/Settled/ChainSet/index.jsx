import React from 'react';
import { connect } from 'dva';
import { Table, Button, Modal, Col, Row, Input, Popconfirm, Form, Tree, Menu } from 'antd';
import { routerRedux } from 'dva/router';
import { getUserInfo } from '../../../utils/';
import StoreList from './storeList';
import DcList from './dc';
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
function ChainSetTable({
  dispatch,
  menuId,
  loading,
  storeList,
  storeSource,
  pagination,
  storeView,
  storeEdit,
  dcView,
  dcEdit,
  dcStoreChoose,
  visible,
  storeModal,
  provinceList,
  cityList,
  districtList,
  paginationDc,
  searchDcData,
  dcList,
  dcSource,
  dcModal,
  modalTable,
  modalLoading,
  tenName,
  paginationModal,
  contactStore,
  distribId,
  assignList,
  cancelList,
  dcId,
  selectModalList,
  storeId,
}) {
  const columns = [{
    title: '岗位名称',
      dataIndex: 'postName',
      key: 'postName',
    }, {
      title: '岗位现有人数',
      dataIndex: 'perCount',
      key: 'perCount',
    }];
  const onSearch = (value) => {
    dispatch({
      type: 'chainSet/setSearchData',
      searchData: value
    });
    dispatch({
      type: 'chainSet/fetchList',
    })
  };
  const onDcSearch = (value) => {
    dispatch({
      type: 'chainSet/setSearchDataDc',
      searchData: value
    });
    dispatch({
      type: 'chainSet/fetchDcList',
    })
  };
  const handleClick = () => {
    dispatch(routerRedux.push('/merchants/restaurantSet'));
  };
  const handleClickDc = () => {
    dispatch(routerRedux.push('/merchants/deliverySet'));
  }
  const onMenuClick = (value) => {
    dispatch({
      type: 'chainSet/setMenuId',
      menuId: value.key,
    });
    if(value.key === '2') {
      dispatch({
        type: 'chainSet/getDcStoreListSecond',
      });
    } else {
      dispatch({
        type: 'chainSet/getAclStoreListSecond',
      });
    }
  };
  const storeInfo = {
    dispatch,
    storeList,
    loading,
    pagination,
    storeSource,
    storeView,
    storeEdit,
    visible,
    storeModal,
    provinceList,
    cityList,
    districtList,
    storeId,
  };
  const dcInfo = {
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
    tenName,
    paginationModal,
    contactStore,
    distribId,
    assignList,
    cancelList,
    selectModalList,
    dcId,
  }
  return (
    <div className="chainSetContainer">
      <Row style={{ marginTop: '35px', paddingBottom: '20px' }}>
        <Menu
          mode="horizontal"
          selectedKeys={[menuId]}
          onClick={onMenuClick}
        >
          <Menu.Item key='1' style={{ fontSize: '14px' }}>
            门店
          </Menu.Item>
          <Menu.Item key='2' style={{ fontSize: '14px' }}>
            配送中心
          </Menu.Item>
        </Menu>
      </Row>
      <Row>
        { menuId === '1' && <div className='storeList'>
          <Row>
            <Col span={4}>
              <Button type="primary" onClick={ handleClick } style={{ padding: '0 30px', fontSize: 14 }}>新增餐厅</Button>
            </Col>
            <Col style={{ float: 'right', marginTop: 4 }}>
              <Search
                style={{ width: 230 }}
                placeholder="请输入机构名称"
                onSearch={onSearch}
                maxLength={'30'}
              />
            </Col>
          </Row>
          <StoreList { ...storeInfo } />
        </div> }
        { menuId === '2' && <div className="dcList">
          <Row>
            <Col span={4}>
              <Button type="primary" onClick={ handleClickDc } style={{ padding: '0 30px', fontSize: 14 }}>新增配送中心</Button>
            </Col>
            <Col style={{ float: 'right', marginTop: 4 }}>
              <Search
                style={{ width: 230 }}
                placeholder="请输入机构名称"
                onSearch={onDcSearch}
                maxLength={'30'}
              />
            </Col>
          </Row>
          <DcList { ...dcInfo } />
        </div> }
      </Row>
    </div>
  );
}
function mapStateToProps(state) {
  const { 
    loading, 
    menuId, 
    storeList, 
    pagination, 
    storeSource,
    storeView,
    storeEdit,
    visible,
    storeModal,
    provinceList,
    cityList,
    districtList,
    paginationDc,
    searchDcData,
    dcList,
    dcSource,
    dcView,
    dcEdit,
    dcStoreChoose,
    dcModal,
    modalLoading,
    modalTable,
    paginationModal,
    tenName,
    contactStore,
    distribId,
    assignList,
    cancelList,
    selectModalList,
    dcId,
    storeId,
  } = state.chainSet;
  return {
    loading,
    menuId,
    storeList,
    pagination,
    storeSource,
    storeView,
    storeEdit,
    dcView,
    dcEdit,
    dcStoreChoose,
    visible,
    storeModal,
    provinceList,
    cityList,
    districtList,
    paginationDc,
    searchDcData,
    dcList,
    dcSource,
    dcView,
    dcEdit,
    dcStoreChoose,
    dcModal,
    modalTable,
    modalLoading,
    modalTable,
    paginationModal,
    tenName,
    contactStore,
    distribId,
    assignList,
    cancelList,
    selectModalList,
    dcId,
    storeId,
  };
}

export default connect(mapStateToProps)(ChainSetTable);
