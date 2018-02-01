import React, { PropTypes } from 'react'
import { connect } from 'dva';
import ScrapList from '../../components/Inventory/Scrap/list'
import ScrapSearch from '../../components/Inventory/Scrap/search'
import ScrapModal from '../../components/Inventory/Scrap/modal'

function Scrap({location, dispatch, scrap}) {
  const {
    loading, list, pagination,
    currentItem, modalVisible, modalType,modalError, modalErrorValue, searchWord, modalKey,
  } = scrap.scrap


  const { queryString } = location.query

  const scrapListProps = {
    dataSource: list,
    loading,
    pagination:pagination,
    onPageChange(page) {
      dispatch({
        type: 'scrap/query',
        payload: {
          page: page.current,
          rows:page.pageSize,
          queryString: searchWord,
        },
      })
    },
    onPageSizeChange(current, pageSize){
      dispatch({
        type: 'scrap/query',
        payload: {
          page: 1,
          rows:pageSize,
          queryString: searchWord,
        },
      })
    },
    onDeleteItem(id) {
      dispatch({
        type: 'scrap/delete',
        payload: id,
      })
    },
    onEditItem(item) {
      dispatch({
        type: 'scrap/showModal',
        payload: {
          modalType: 'update',
          currentItem: item,
        },
      })
    },
  }

  const scrapSearchProps = {
    queryString,
    onSearch(fieldsValue) {
      dispatch({
        type: 'scrap/query',
        payload: fieldsValue,
      });
      dispatch({
        type: 'scrap/querySuccess',
        payload:{
          searchWord: fieldsValue.queryString,
        },
      });
    },
    onAdd() {
      dispatch({
        type: 'scrap/showModal',
        payload: {
          modalType: 'create',
        },
      })
    },
  }

  const scrapModalProps = {
    loading,
    item: modalType === 'create' ? {} : currentItem,
    type: modalType,
    title:modalType === 'create' ? '新增报废原因' : '编辑报废原因',
    visible: modalVisible,
    modalErr: modalError,
    modalErrValue: modalErrorValue,
    key: modalKey,
    onOk(data) {
      dispatch({
        type: `scrap/${modalType}`,
        payload: data,
      })
    },
    onCancel() {
      dispatch({
        type: 'scrap/hideModal',
      });
      dispatch({
        type: 'scrap/querySuccess',
        payload: {
          modalError: false,
          modalErrorValue: null,
        },
      })
    },
  }


  const ScrapModalGen = () =>
    <ScrapModal {...scrapModalProps}/>

  return (
    <div className="routes">
      <ScrapSearch {...scrapSearchProps} />
      <ScrapList {...scrapListProps} />
      <ScrapModal {...scrapModalProps}/>
    </div>
  );
}

Scrap.propTypes = {
  scrap: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}

function mapStateToProps(scrap) {
  return {scrap};
}

export default connect(mapStateToProps)(Scrap);
