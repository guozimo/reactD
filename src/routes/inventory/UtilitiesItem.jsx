import React, { PropTypes } from 'react'
import { connect } from 'dva';
import UtilitiesItemList from '../../components/Inventory/UtilitiesItem/list'
import UtilitiesItemSearch from '../../components/Inventory/UtilitiesItem/search'
import UtilitiesItemModal from '../../components/Inventory/UtilitiesItem/modal'

function UtilitiesItem({location, dispatch, utilitiesItem}) {
  const {
    loading, list, pagination,
    currentItem, modalVisible, modalType, startDateValue, endDateValue, endDateOpen,
    utilitiesId, storeId, utilitiesName, preCnt, nextDate, startDateOn, modalError, modalErrorValue, modalKey,serverTime,
  } = utilitiesItem.utilitiesItem


  const { queryString } = location.query

  const utilitiesItemListProps = {
    dataSource: list,
    loading,
    pagination:pagination,
    onPageChange(page) {
      dispatch({
        type: 'utilitiesItem/query',
        payload: {
          page: page.current,
          rows:page.pageSize,
          storeId,
          id: utilitiesId,
          startDate: startDateValue,
          endDate: endDateValue,
        },
      })
    },
    onPageSizeChange(current, pageSize){
      dispatch({
        type: 'utilitiesItem/query',
        payload: {
          page: 1,
          rows:pageSize,
          storeId,
          id: utilitiesId,
          startDate: startDateValue,
          endDate: endDateValue,
        },
      })
    },
    onDeleteItem(id) {
      dispatch({
        type: 'utilitiesItem/delete',
        payload: id,
      })
    },
    onEditItem(item) {
      dispatch({
        type: 'utilitiesItem/showModal',
        payload: {
          modalType: 'update',
          currentItem: item,
        },
      })
    },
  }

  const utilitiesItemSearchProps = {
    queryString,
    startDateValue: startDateValue,
    endDateValue: endDateValue,
    endDateOpen: endDateOpen,
    utilId: utilitiesId,
    shopId: storeId,
    utilitiesName: utilitiesName,
    serverTime,
    onSearch(fieldsValue) {
      dispatch({
        type: 'utilitiesItem/query',
        payload: fieldsValue,
      });
      dispatch({
        type: 'utilitiesItem/querySuccess',
        payload: {
          startDateValue: fieldsValue.startDate,
          endDateValue: fieldsValue.endDate,
        },
      });
    },
    onAdd() {
      dispatch({
        type: 'utilitiesItem/queryAdd',
        payload:{
          id: utilitiesId,
          storeId:storeId,
        },
      });
      dispatch({
        type: 'utilitiesItem/showModal',
        payload: {
          modalType: 'create',
        },
      })
    },
    onDataChange(data) {
      dispatch({
        type: 'utilitiesItem/querySuccess',
        payload:data,
      });
    },
    onBack() {
      dispatch({
        type: 'utilitiesItem/back',
        payload:{
          storeId: storeId,
        },
      })
    },
  }


  const utilitiesItemModalProps = {
    loading,
    item: modalType === 'create' ? {startDate: nextDate,endDate: nextDate, preCnt: preCnt} : currentItem,
    type: modalType,
    title:modalType === 'create' ? '新增明细' : '编辑明细',
    visible: modalVisible,
    startDateValue: startDateValue,
    endDateValue: endDateValue,
    endDateOpen: endDateOpen,
    utilId: utilitiesId,
    shopId: storeId,
    dateAble: startDateOn,
    modalErr: modalError,
    modalErrValue: modalErrorValue,
    key: modalKey,
    onOk(data) {
      dispatch({
        type: `utilitiesItem/${modalType}`,
        payload: data,
      })
    },
    onCancel() {
      dispatch({
        type: 'utilitiesItem/hideModal',
      });
      dispatch({
        type: 'utilitiesItem/querySuccess',
        payload: {
          modalError: false,
          modalErrorValue: null,
        },
      })
    },
    onDataChange(data) {
      dispatch({
        type: 'utilitiesItem/querySuccess',
        payload:data,
      });
    },
  }


  const UtilitiesItemModalGen = () =>
    <UtilitiesItemModal {...utilitiesItemModalProps}/>

  return (
    <div className="routes">
      <UtilitiesItemSearch {...utilitiesItemSearchProps} />
      <UtilitiesItemList {...utilitiesItemListProps} />
      <UtilitiesItemModal {...utilitiesItemModalProps}/>
    </div>
  );
}

UtilitiesItem.propTypes = {
  utilitiesItem: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}

function mapStateToProps(utilitiesItem) {
  return {utilitiesItem};
}

export default connect(mapStateToProps)(UtilitiesItem);
