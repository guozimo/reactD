import React, { PropTypes } from 'react'
import { connect } from 'dva';
import SupplierTypeList from '../../components/Inventory/SupplierType/list'
import SupplierTypeSearch from '../../components/Inventory/SupplierType/search'
import SupplierTypeModal from '../../components/Inventory/SupplierType/modal'

function SupplierType({location, dispatch, supplierType}) {
  const {
    loading, list, pagination,
    currentItem, modalVisible, modalType, modalError, modalErrorValue, searchWord, modalKey,
  } = supplierType.supplierType


  const { queryString } = location.query

  const supplierTypeListProps = {
    dataSource: list,
    loading,
    pagination:pagination,
    onPageChange(page) {
      dispatch({
        type: 'supplierType/query',
        payload: {
          page: page.current,
          rows: page.pageSize,
          queryString: searchWord,
        },
      })
    },
    onPageSizeChange(current, pageSize){
      dispatch({
        type: 'supplierType/query',
        payload: {
          page: 1,
          rows: pageSize,
          queryString: searchWord,
        },
      })
    },
    onDeleteItem(id) {
      dispatch({
        type: 'supplierType/delete',
        payload: id,
      })
    },
    onEditItem(item) {
      dispatch({
        type: 'supplierType/showModal',
        payload: {
          modalType: 'update',
          currentItem: item,
        },
      })
    },
  }

  const supplierTypeSearchProps = {
    queryString,
    onSearch(fieldsValue) {
      dispatch({
        type: 'supplierType/query',
        payload: fieldsValue,
      });
      dispatch({
        type: 'supplierType/querySuccess',
        payload: {
          searchWord: fieldsValue.queryString,
        },
      });
    },
    onAdd() {
      dispatch({
        type: 'supplierType/showModal',
        payload: {
          modalType: 'create',
        },
      })
    },
  }

  const supplierTypeModalProps = {
    loading,
    item: modalType === 'create' ? {} : currentItem,
    type: modalType,
    title:modalType === 'create' ? '新增供应商类型' : '编辑供应商类型',
    visible: modalVisible,
    modalErr: modalError,
    modalErrValue: modalErrorValue,
    key: modalKey,
    onOk(data) {
      dispatch({
        type: `supplierType/${modalType}`,
        payload: data,
      })
    },
    onCancel() {
      dispatch({
        type: 'supplierType/hideModal',
      });
      dispatch({
        type: 'supplierType/querySuccess',
        payload: {
          modalError: false,
          modalErrorValue: null,
        },
      })
    },
  }


  const SupplierTypeModalGen = () =>
    <SupplierTypeModal {...supplierTypeModalProps}/>

  return (
    <div className="routes">
      <SupplierTypeSearch {...supplierTypeSearchProps} />
      <SupplierTypeList {...supplierTypeListProps} />
      <SupplierTypeModal {...supplierTypeModalProps}/>
    </div>
  );
}

SupplierType.propTypes = {
  supplierType: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}

function mapStateToProps(supplierType) {
  return {supplierType};
}

export default connect(mapStateToProps)(SupplierType);
