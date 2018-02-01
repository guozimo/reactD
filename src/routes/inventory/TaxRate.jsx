import React, { PropTypes } from 'react'
import { connect } from 'dva';
import TaxRateList from '../../components/Inventory/TaxRate/list'
import TaxRateSearch from '../../components/Inventory/TaxRate/search'
import TaxRateModal from '../../components/Inventory/TaxRate/modal'

function TaxRate({location, dispatch, taxRate}) {
  const {
    loading, list, pagination,
    currentItem, modalVisible, modalType, modalError, modalErrorValue, searchWord, modalKey,
  } = taxRate.taxRate
  const { menuData } = taxRate.merchantApp;
  const { queryString } = location.query

  const taxRateListProps = {
    menuData,
    taxRateListProps,
    dataSource: list,
    loading,
    pagination:pagination,
    onPageChange(page) {
      dispatch({
        type: 'taxRate/query',
        payload: {
          page: page.current,
          rows: page.pageSize,
          queryString: searchWord,
        },
      })
    },
    onPageSizeChange(current, pageSize){
      dispatch({
        type: 'taxRate/query',
        payload: {
          page: 1,
          rows: pageSize,
          queryString: searchWord,
        },
      })
    },
    onDeleteItem(id) {
      dispatch({
        type: 'taxRate/delete',
        payload: id,
      })
    },
    onEditItem(item) {
      dispatch({
        type: 'taxRate/prepareEdit',
        payload: {
          modalType: 'update',
          currentItem: item,
        },
      })
    },
  }

  const taxRateSearchProps = {
    menuData,
    queryString,
    onSearch(fieldsValue) {
      dispatch({
        type: 'taxRate/query',
        payload: fieldsValue,
      });
      dispatch({
        type: 'taxRate/querySuccess',
        payload: {
          searchWord: fieldsValue.queryString,
        },
      });
    },
    onAdd() {
      dispatch({
        type: 'taxRate/showModal',
        payload: {
          modalType: 'create',
        },
      })
    },
  }

  const taxRateModalProps = {
    menuData,
    loading,
    item: modalType === 'create' ? {} : currentItem,
    type: modalType,
    title:modalType === 'create' ? '新增税率' : '编辑税率',
    visible: modalVisible,
    modalErr: modalError,
    modalErrValue: modalErrorValue,
    key: modalKey,
    onOk(data) {
      dispatch({
        type: `taxRate/${modalType}`,
        payload: data,
      })
    },
    onCancel() {
      dispatch({
        type: 'taxRate/hideModal',
      });
      dispatch({
        type: 'taxRate/querySuccess',
        payload: {
          modalError: false,
          modalErrorValue: null,
        },
      })
    },
  }


  const TaxRateModalGen = () =>
    <TaxRateModal {...taxRateModalProps}/>

  return (
    <div className="routes">
      <TaxRateSearch {...taxRateSearchProps} />
      <TaxRateList {...taxRateListProps} />
      <TaxRateModal {...taxRateModalProps}/>
    </div>
  );
}

TaxRate.propTypes = {
  taxRate: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}

function mapStateToProps(taxRate) {
  return {taxRate};
}

export default connect(mapStateToProps)(TaxRate);
