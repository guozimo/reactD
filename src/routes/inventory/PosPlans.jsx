import React, { PropTypes } from 'react'
import { connect } from 'dva';
import PosPlansList from '../../components/Inventory/PosPlans/list'
import PosPlansSearch from '../../components/Inventory/PosPlans/search'
import PosPlansModal from '../../components/Inventory/PosPlans/modal'


function PosPlans({location, dispatch, posPlans}) {
  const {
    loading, list, pagination,depotList, storeId,
    currentItem, modalVisible, modalType,startDateValue, modalError, modalErrorValue, modalKey,serverTime,
  } = posPlans.posPlans;
  const { menuData } = posPlans.merchantApp;
  const { field } = location.query
  const posPlansListProps = {
    dataSource: list,
    loading,
    pagination:pagination,
    shopId: storeId,
    onPageChange(page) {
      dispatch({
        type: 'posPlans/query',
        payload: {
          page: page.current,
          rows:page.pageSize,
          storeId,
          bussDate: startDateValue,
        },
      })
    },
    onPageSizeChange(current, pageSize){
      dispatch({
        type: 'posPlans/query',
        payload: {
          page: 1,
          rows:pageSize,
          storeId,
          bussDate: startDateValue,
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
        type: 'posPlans/querySuccess',
        payload:data,
      })
    },
    editDone(record,type){
      const data  = record;
      data.bussDate = startDateValue;
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
          type: `posPlans/update`,
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
        type: 'posPlans/querySuccess',
        payload:data,
      });
    },
    handleChange (e,data, index, key, text){
      data[key].value=e.target.value;
      dispatch({
        type: 'posPlans/querySuccess',
        payload:data,
      });
    },
  }
  const posPlansSearchProps = {
    menuData,
    field,
    storeList: depotList,
    shopId: storeId,
    startDateValue: startDateValue,
    serverTime,
    onSearch(fieldsValue) {
      dispatch({
        type: 'posPlans/query',
        payload: fieldsValue,
      })
    },
    selectStore(value) {
      dispatch({
        type: 'posPlans/querySuccess',
        payload:{
          storeId: value,
        },
      });
      dispatch({
        type: 'posPlans/query',
        payload: {
          rows: 10,
          storeId: value,
          bussDate: startDateValue,
        },
      });
      dispatch({
        type: 'posPlans/queryChart',
        payload: {
          rows: 7,
          storeId: value,
        },
      });
    },
    onSelectDate(dateTime) {
      dispatch({
        type: 'posPlans/query',
        payload: {
          rows: 10,
          storeId: storeId,
          bussDate: dateTime,
        },
      });
      dispatch({
        type: 'posPlans/querySuccess',
        payload:{
          startDateValue: dateTime,
        },
      });
    },
    onAdd() {
      dispatch({
        type: 'posPlans/showModal',
        payload: {
          modalType: 'create',
        },
      })
    },
    onExportData(date) {
      dispatch({
        type: 'posPlans/exports',
        payload: {
          storeId: storeId,
          bussDate: date,
        },
      })
    },
    onSearch(fieldsValue) {
      dispatch({
        type: 'posPlans/query',
        payload: fieldsValue,
      })
    },
  };

  const posPlansModalProps = {
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
        type: `posPlans/${modalType}`,
        payload: data,
      })
    },
    onCancel() {
      dispatch({
        type: 'posPlans/hideModal',
      });
      dispatch({
        type: 'posPlans/querySuccess',
        payload: {
          modalError: false,
          modalErrorValue: null,
        },
      })
    },
    onDataChange(data) {
      dispatch({
        type: 'posPlans/querySuccess',
        payload:data,
      });
    },
  }
  const PosPlansModalGen = () =>
    <PosPlansModal {...posPlansModalProps}/>

  return (
    <div className="routes">
      <PosPlansSearch {...posPlansSearchProps} />
      <PosPlansList {...posPlansListProps} />
      <PosPlansModal {...posPlansModalProps}/>
    </div>
  );
}

PosPlans.propTypes = {
  posPlans: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}

function mapStateToProps(posPlans) {
  return {posPlans};
}

export default connect(mapStateToProps)(PosPlans);
