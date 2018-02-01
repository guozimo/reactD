import React, { PropTypes } from 'react'
import { connect } from 'dva';
import { message } from 'antd';
import CutList from '../../components/Inventory/Cut/list'
import CutSearch from '../../components/Inventory/Cut/search'
import CutModal from '../../components/Inventory/Cut/modal'

function Cut({location, dispatch, cut}) {
  const {
    loading, list,listGoods, depotList,pagination,paginationGoods,
    modalVisible, searchTree,goodsCode,selectedRowKeys,
    startDateValue,endDateValue,endDateOpen,storeId, goodsCategory, modalKey,serverTime,cateId,
  } = cut.cut
  const { menuData } = cut.merchantApp;
  const { queryString } = location.query

  const cutListProps = {
    menuData,
    dataSource: list,
    loading,
    shopId: storeId,
    pagination:pagination,
    onPageChange(page) {
      dispatch({
        type: 'cut/query',
        payload: {
          page: page.current,
          rows:page.pageSize,
          storeId,
          startDate: startDateValue,
          endDate: endDateValue,
          goodsId: selectedRowKeys,
          goodsCategory,
          type: 0,
        },
      })
    },
    onPageSizeChange(current, pageSize){
      dispatch({
        type: 'cut/query',
        payload: {
          page: 1,
          rows:pageSize,
          storeId,
          startDate: startDateValue,
          endDate: endDateValue,
          goodsId: selectedRowKeys,
          goodsCategory,
          type: 0,
        },
      })
    },
    onDeleteItem(id) {
      dispatch({
        type: 'cut/delete',
        payload: id,
      })
    },
    onEditItem(item) {
      dispatch({
        type: 'cut/showModal',
        payload: {
          modalType: 'update',
          currentItem: item,
        },
      })
    },
  }

  const cutSearchProps = {
    menuData,
    queryString,
    storeList: depotList,
    shopId: storeId,
    searchMenu:searchTree,
    queryGoodsCode:goodsCode,
    queryGoodsId:selectedRowKeys,
    startDateValue: startDateValue,
    endDateValue: endDateValue,
    endDateOpen: endDateOpen,
    serverTime,
    onSearch(fieldsValue) {
      const goodsCategoryArray = fieldsValue.goodsCategory ? fieldsValue.goodsCategory : [];
      dispatch({
        type: 'cut/query',
        payload: fieldsValue,
      });
      dispatch({
        type: 'cut/querySuccess',
        payload:{
          goodsCategory: goodsCategoryArray,
          startDateValue: fieldsValue.startDate,
          endDateValue: fieldsValue.endDate,
        },
      });
    },
    selectStore(value) {
      dispatch({
        type: 'cut/querySuccess',
        payload:{
          storeId: value,
        },
      });
      dispatch({
        type: 'cut/query',
        payload: {
          rows: 10,
          storeId: value,
          startDate: startDateValue,
          endDate: endDateValue,
          goodsId: selectedRowKeys,
          goodsCategory,
          type: 0,
        },
      });
    },
    onAdd() {
      dispatch({
        type: 'cut/showModal',
        payload: {
          modalType: 'create',
        },
      })
    },
    onChoosePop() {
      dispatch({
        type: 'cut/showModal',
      });
      dispatch({
        type: 'cut/queryGoods',
        payload: { rows: 10 },
      });
    },
    onClearCode() {
      dispatch({
        type: 'cut/querySuccess',
        payload:{
          goodsCode:"",
          selectedRowKeys: ""
        },
      });
    },
    onDataChange(data) {
      dispatch({
        type: 'cut/querySuccess',
        payload:data,
      });
    },
    onExportData(data) {
      dispatch({
        type: 'cut/exports',
        payload: {
          startDate: data.startDate,
          endDate: data.endDate,
          page: pagination.current,
          rows: pagination.size,
          storeId: storeId,
        },
      })
    },
  }

  const cutModalProps = {
    menuData,
    loading,
    title: '选择物资编码',
    visible: modalVisible,
    dataTree:searchTree,
    dataSource: listGoods,
    queryRowId:selectedRowKeys,
    paginationGoods,
    key: modalKey,
    cateId,
    onOk(data) {
      dispatch({
        type: 'cut/querySuccess',
        payload:data,
      });
      dispatch({
        type: 'cut/hideModal',
      })
    },
    onCancel() {
      dispatch({
        type: 'cut/hideModal',
      });
      message.destroy();
    },
    onPageChange(page) {
      dispatch({
        type: 'cut/queryGoods',
        payload: {
          page: page.current,
          rows:page.pageSize,
          cateId,
        },
      })
    },
    onPageSizeChange(current, pageSize){
      dispatch({
        type: 'cut/queryGoods',
        payload: {
          page: 1,
          rows:pageSize,
          cateId,
        },
      })
    },
    onSelectMenu(selectedKeys, info){
      dispatch({
        type: 'cut/queryGoods',
        payload: {
            cateId: selectedKeys[0],
             rows: 10
        },
      });
      dispatch({
        type: 'cut/querySuccess',
        payload:{
          cateId: selectedKeys[0],
        },
      });
    }
  }


  const CutModalGen = () =>
    <CutModal {...cutModalProps}/>

  return (
    <div className="routes">
      <CutSearch {...cutSearchProps} />
      <CutList {...cutListProps} />
      <CutModal {...cutModalProps}/>
    </div>
  );
}

Cut.propTypes = {
  cut: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}

function mapStateToProps(cut) {
  return {cut};
}

export default connect(mapStateToProps)(Cut);
