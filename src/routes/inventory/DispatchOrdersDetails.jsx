import React, { PropTypes } from 'react';
import { connect } from 'dva';
import DispatchOrdersDetailsSearch from '../../components/Inventory/DispatchOrders/details/filter';
import DispatchOrdersListView from '../../components/Inventory/DispatchOrders/details/listView';

const DispatchOrdersDetails = ({ dispatchOrdersDetailsData, dispatch }) => {
  const {
    loading,
    goodsList,
    id,
    storeId,
    depotId,
    depotName,
    busiId,
    busiName,
    pageType,
    billNo,
    distribName,
    storeName,
    bussDate,
    updateUserName,
    updateTime,
    createUserName,
    createTime,
    status,
    billType,
    monthDate,
    pageDetail,
    pageStatus,
    detailList,
    remarks,
    currRemarks,
    editableMem,
    savingStatus,
    dataSourceIndex,
  } = dispatchOrdersDetailsData.dispatchOrdersDetailsModule;
  const dateFormat = 'YYYY-MM-DD';
  const DispatchOrdersDetailsSearchData = {
    loading,
    goodsList,
    id,
    storeId,
    busiId,
    busiName,
    depotId,
    depotName,
    pageType,
    billNo,
    distribName,
    storeName,
    bussDate,
    updateUserName,
    updateTime,
    createUserName,
    createTime,
    status,
    monthDate,
    remarks,
    currRemarks,
    billType,
    setCurrRemarks(value) {
      dispatch({
        type: 'dispatchOrdersDetailsModule/saveRemarks',
        payload: {
          remarks: value,
        },
      });
    },
    onSaveStockOut(flag, param) {
      dispatch({
        type: 'dispatchOrdersDetailsModule/saveStockOut',
        payload: {
          flag,
          param,
        },
      });
    },
  };
  const DispatchOrdersDetailsListData = {
    storeId,
    // busiId,
    // busiName,
    dataSourceIndex,
    depotId,
    billType,
    depotName,
    pageType,
    status,
    pageStatus,
    detailList,
    pageDetail,
    editableMem,
    goodsList,
    savingStatus,
    bussDate,
    switchType: ((type) => {
      dispatch({
        type: 'dispatchOrdersDetailsModule/startWithType',
        payload: {
          pageType: type,
        },
      });
    }),
    resyncDataSource: ((listData) => {
      dispatch({
        type: 'dispatchOrdersDetailsModule/resyncListData',
        payload: {
          listData,
        },
      });
    }),
    toNextMem: ((rowIndex, fieldName, isShow) => {
      dispatch({
        type: 'dispatchOrdersDetailsModule/toNextMemByCurr',
        payload: { rowIndex, fieldName, isShow },
      });
    }),
    toggleMemStatus: ((rowIndex, fieldName) => {
      dispatch({
        type: 'dispatchOrdersDetailsModule/toggleMemStatus',
        payload: { rowIndex, fieldName },
      });
    }),
    updateEditableMem(targetField, index) {
      // console.log("targetField in updateEditableMem", targetField,index+1);
      dispatch({
        type: 'dispatchOrdersDetailsModule/updateEditableMem',
        payload: { targetField, index },
      });
    },
    saveDetails: ((status) => {
      dispatch({
        type: 'dispatchOrdersDetailsModule/saveOrdersDetails',
        payload: { storeId, status },
      });
    }),
    cancelDetailPage: (() => {
      dispatch({
        type: 'dispatchOrdersDetailsModule/cancelDetailData',
        payload: {},
      });
    }),
  };

  const DetailsFilterData = {
    ...DispatchOrdersDetailsSearchData,
  };

  const DetailsListData = {
    ...DispatchOrdersDetailsListData,
  };
  return (
    <div className="routes">
      <DispatchOrdersDetailsSearch {...DetailsFilterData} />
      <DispatchOrdersListView {...DetailsListData} />
    </div>
  );
};
DispatchOrdersDetails.propTypes = {
  dispatch: PropTypes.func,
};
function mapStateToProps(dispatchOrdersDetailsData) {
  return { dispatchOrdersDetailsData };
}
export default connect(mapStateToProps)(DispatchOrdersDetails);
