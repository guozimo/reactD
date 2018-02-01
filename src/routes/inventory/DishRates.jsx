import React, { PropTypes } from 'react'
import { connect } from 'dva';
import DishRatesList from '../../components/Inventory/DishRates/list'
import DishRatesSearch from '../../components/Inventory/DishRates/search'
import DishRatesModal from '../../components/Inventory/DishRates/modal'

function DishRates({location, dispatch, dishRates}) {
  const {
    loading, list, pagination,depotList, storeId,
    currentItem, modalVisible, modalType, modalError, modalErrorValue, modalKey,serverTime,
  } = dishRates.dishRates
  const { menuData } = dishRates.merchantApp;
  const { field } = location.query
  const dishRatesListProps = {
    menuData,
    dataSource: list,
    loading,
    pagination:pagination,
    shopId: storeId,
    onPageChange(page) {
      dispatch({
        type: 'dishRates/query',
        payload: {
          page: page.current,
          rows:page.pageSize,
          storeId,
        },
      })
    },
    onPageSizeChange(current, pageSize){
      dispatch({
        type: 'dishRates/query',
        payload: {
          page: 1,
          rows:pageSize,
          storeId,
        },
      })
    },
    edit(record){
      const data= record;
      Object.keys(data).forEach((item) => {
        if (data[item] && typeof data[item].editable !== 'undefined') {
          data[item].editable = true;
        }
      });
      dispatch({
        type: 'dishRates/querySuccess',
        payload:data,
      })
    },
    editDone(record,type){
      const data  = record;
      //newDishRates.holidaysCnt1 = data.holidaysCnt2.value;
      Object.keys(data).forEach((item) => {
        if (data[item] && typeof data[item].editable !== 'undefined') {
          data[item].editable = false;
        }
      });
      if( type === 'save'){
        Object.keys(data).forEach((item) => {
          if (data[item] && typeof data[item].editable !== 'undefined') {
            delete data[item].oldValue;
          }
        });
        dispatch({
          type: `dishRates/update`,
          payload: data,
        })
      }else if(type === 'cancel'){
        Object.keys(data).forEach((item) => {
          if (data[item] && typeof data[item].editable !== 'undefined') {
            data[item].value = data[item].oldValue;
          }
        });
      }
      dispatch({
        type: 'dishRates/querySuccess',
        payload:data,
      });
    },
    handleChange (e,data, index, key, text){
      data[key].value=e.target.value;
      dispatch({
        type: 'dishRates/querySuccess',
        payload:data,
      });
    },
  }
  const dishRatesSearchProps = {
    menuData,
    field,
    storeList: depotList,
    shopId: storeId,
    onSearch(fieldsValue) {
      dispatch({
        type: 'dishRates/query',
        payload: fieldsValue,
      })
    },
    selectStore(value) {
      dispatch({
        type: 'dishRates/querySuccess',
        payload:{
          storeId: value,
        },
      });
      dispatch({
        type: 'dishRates/query',
        payload: {
          rows: 10,
          storeId: value,
        },
      });
      dispatch({
        type: 'dishRates/queryChart',
        payload: {
          rows: 7,
          storeId: value,
        },
      });
    },
    onSelectDate(dateTime) {
      dispatch({
        type: 'dishRates/query',
        payload: {
          rows: 10,
          storeId: storeId,
          forecastDate: dateTime,
        },
      });
    },
    onAdd() {
      dispatch({
        type: 'dishRates/showModal',
        payload: {
          modalType: 'create',
        },
      })
    },
    onExportData(date) {
      dispatch({
        type: 'dishRates/exports',
        payload: {
          storeId: storeId,
          bussDate: date,
        },
      })
    },
    onSearch(fieldsValue) {
      dispatch({
        type: 'dishRates/query',
        payload: fieldsValue,
      })
    },
  };

  const dishRatesModalProps = {
    menuData,
    loading,
    item: modalType === 'create' ? {} : currentItem,
    type: modalType,
    title:modalType === 'create' ? '计算' : '',
    visible: modalVisible,
    shopId: storeId,
    modalErr: modalError,
    modalErrValue: modalErrorValue,
    key: modalKey,
    serverTime,
    onOk(data) {
      dispatch({
        type: `dishRates/${modalType}`,
        payload: data,
      })
    },
    onCancel() {
      dispatch({
        type: 'dishRates/hideModal',
      });
      dispatch({
        type: 'taxRate/querySuccess',
        payload: {
          modalError: false,
          modalErrorValue: null,
        },
      })
    },
    onDataChange(data) {
      dispatch({
        type: 'dishRates/querySuccess',
        payload:data,
      });
    },
  }
  const DishRatesModalGen = () =>
    <DishRatesModal {...dishRatesModalProps}/>

  return (
    <div className="routes">
      <DishRatesSearch {...dishRatesSearchProps} />
      <DishRatesList {...dishRatesListProps} />
      <DishRatesModal {...dishRatesModalProps}/>
    </div>
  );
}

DishRates.propTypes = {
  dishRates: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}

function mapStateToProps(dishRates) {
  return {dishRates};
}

export default connect(mapStateToProps)(DishRates);
