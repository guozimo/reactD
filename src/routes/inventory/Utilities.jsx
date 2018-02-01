import React, { PropTypes } from 'react'
import { connect } from 'dva';
import UtilitiesList from '../../components/Inventory/Utilities/list'
import UtilitiesSearch from '../../components/Inventory/Utilities/search'
import UtilitiesModal from '../../components/Inventory/Utilities/modal'

function Utilities({location, dispatch, utilities}) {
  const {
    loading, list,listUtilities, pagination,
    currentItem, modalVisible, modalType,storeId, depotList, modalError, modalErrorValue, modalKey, searchWord
  } = utilities.utilities
  const { menuData } = utilities.merchantApp;

  const { queryString } = location.query

  const utilitiesListProps = {
    menuData,
    dataSource: list,
    listUtil: listUtilities,
    loading,
    pagination:pagination,
    shopId: storeId,
    onPageChange(page) {
      dispatch({
        type: 'utilities/query',
        payload: {
          page: page.current,
          rows:page.pageSize,
          storeId,
        },
      })
    },
    onPageSizeChange(current, pageSize){
      dispatch({
        type: 'utilities/query',
        payload: {
          page: 1,
          rows:pageSize,
          storeId,
        },
      })
    },
    onDeleteItem(item) {
      dispatch({
        type: 'utilities/delete',
        payload: item,
      })
    },
    onEditItem(item) {
      dispatch({
        type: 'utilities/showModal',
        payload: {
          modalType: 'update',
          currentItem: item,
        },
      })
    },
    onDetailItem(data) {
      dispatch({
        type: 'utilities/detail',
        payload:{
          id: data.id,
          storeId: data.storeId,
          utilitiesName: data.utilitiesName,
        }
      })
    },
  }

  const utilitiesSearchProps = {
    menuData,
    queryString,
    storeList: depotList,
    shopId: storeId,
    onSearch(fieldsValue) {
      dispatch({
        type: 'utilities/query',
        payload: fieldsValue,
      });
      dispatch({
        type: 'utilities/querySuccess',
        payload:{
          searchWord: fieldsValue.queryString,
        },
      });
    },
    onAdd() {
      dispatch({
        type: 'utilities/showModal',
        payload: {
          modalType: 'create',
        },
      })
    },
    selectStore(value) {
      dispatch({
        type: 'utilities/querySuccess',
        payload:{
          storeId: value,
        },
      });
      dispatch({
        type: 'utilities/query',
        payload: {
          rows: 10,
          storeId: value,
        },
      })
    },
  }

  const utilitiesModalProps = {
    menuData,
    loading,
    item: modalType === 'create' ? {} : currentItem,
    type: modalType,
    title:modalType === 'create' ? '新增项目' : '编辑项目',
    shopId: storeId,
    visible: modalVisible,
    modalErr: modalError,
    modalErrValue: modalErrorValue,
    key: modalKey,
    onOk(data) {
      dispatch({
        type: `utilities/${modalType}`,
        payload: data,
      });
    },
    onCancel() {
      dispatch({
        type: 'utilities/hideModal',
      });
      dispatch({
        type: 'utilities/querySuccess',
        payload: {
          modalError: false,
          modalErrorValue: null,
        },
      })
    },
  }


  const UtilitiesModalGen = () =>
    <UtilitiesModal {...utilitiesModalProps}/>

  return (
    <div className="routes">
      <UtilitiesSearch {...utilitiesSearchProps} />
      <UtilitiesList {...utilitiesListProps} />
      <UtilitiesModal {...utilitiesModalProps}/>
    </div>
  );
}

Utilities.propTypes = {
  utilities: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}

function mapStateToProps(utilities) {
  return {utilities};
}

export default connect(mapStateToProps)(Utilities);
