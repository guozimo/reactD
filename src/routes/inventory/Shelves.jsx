import React, { PropTypes } from 'react'
import { connect } from 'dva';
import ShelvesList from '../../components/Inventory/Shelves/list'
import ShelvesSearch from '../../components/Inventory/Shelves/search'
import ShelvesModal from '../../components/Inventory/Shelves/modal'

function Shelves({location, dispatch, shelves}) {
  const {
    loading, list, pagination,
    currentItem, modalVisible, modalType, modalError, modalErrorValue, searchWord, modalKey,
  } = shelves.shelves


  const { queryString } = location.query

  const shelvesListProps = {
    dataSource: list,
    loading,
    pagination:pagination,
    onPageChange(page) {
      dispatch({
        type: 'shelves/query',
        payload: {
          page: page.current,
          rows:page.pageSize,
          queryString: searchWord,
        },
      })
    },
    onPageSizeChange(current, pageSize){
      dispatch({
        type: 'shelves/query',
        payload: {
          page: 1,
          rows:pageSize,
          queryString: searchWord,
        },
      })
    },
    onDeleteItem(id) {
      dispatch({
        type: 'shelves/delete',
        payload: id,
      })
    },
    onEditItem(item) {
      dispatch({
        type: 'shelves/showModal',
        payload: {
          modalType: 'update',
          currentItem: item,
        },
      })
    },
  }

  const shelvesSearchProps = {
    queryString,
    onSearch(fieldsValue) {
      dispatch({
        type: 'shelves/query',
        payload: fieldsValue,
      });
      dispatch({
        type: 'shelves/querySuccess',
        payload:{
          searchWord: fieldsValue.queryString,
        },
      });
    },
    onAdd() {
      dispatch({
        type: 'shelves/showModal',
        payload: {
          modalType: 'create',
        },
      })
    },
  }

  const shelvesModalProps = {
    loading,
    item: modalType === 'create' ? {} : currentItem,
    type: modalType,
    title:modalType === 'create' ? '新增货架' : '编辑货架',
    visible: modalVisible,
    modalErr: modalError,
    modalErrValue: modalErrorValue,
    key: modalKey,
    onOk(data) {
      dispatch({
        type: `shelves/${modalType}`,
        payload: data,
      })
    },
    onCancel() {
      dispatch({
        type: 'shelves/hideModal',
      });
      dispatch({
        type: 'shelves/querySuccess',
        payload: {
          modalError: false,
          modalErrorValue: null,
        },
      })
    },
  }


  const ShelvesModalGen = () =>
    <ShelvesModal {...shelvesModalProps}/>

  return (
    <div className="routes">
      <ShelvesSearch {...shelvesSearchProps} />
      <ShelvesList {...shelvesListProps} />
      <ShelvesModal {...shelvesModalProps}/>
    </div>
  );
}

Shelves.propTypes = {
  shelves: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}

function mapStateToProps(shelves) {
  return {shelves};
}

export default connect(mapStateToProps)(Shelves);
