import React, { PropTypes } from 'react';
import { connect } from 'dva';
import { message } from 'antd';
import StockOutDetailsSearch from '../../components/Inventory/StockOutDistribution/details/filter';
import StockOutDetailsList from '../../components/Inventory/StockOutDistribution/details/listView';

const StockOutDistributionDetails = ({ stockOutDetailsData, dispatch }) => {
  const {
    loading,
    redFlag,
    sureModal,
    complexModal,
    readyOutDataArray,
    complexDataArray,
    goodsList,
    id,
    storeId,
    depotId,
    depotName,
    busiId,
    busiName,
    pageType,
    baseInfo,
    bussDate,
    billType,
    monthDate,
    pageDetail,
    pageStatus,
    detailList,
    remarks,
    currRemarks,
    editableMem,
    savingStatus,
    goodsPopListModel,
    popupListPagination,
    foundTreeList,
    dataSourceIndex,
    findList,
  } = stockOutDetailsData.stockOutDistributionDetails;
  const stockOutDetailsSearchList = {
    loading,
    goodsList,
    id,
    storeId,
    busiId,
    busiName,
    depotId,
    depotName,
    pageType,
    monthDate,
    baseInfo,
    bussDate,
    remarks,
    currRemarks,
    billType,
    findList,
    selectBillType(value) {
      dispatch({
        type: 'stockOutDistributionDetails/querySuccess',
        payload: {
          billType: value,
        },
      });
    },
    selectedBussDate(date, dateString) {
      dispatch({
        type: 'stockOutDistributionDetails/setBussinessDate',
        payload: {
          date,
          dateString,
        },
      });
    },
    setCurrRemarks(value) {
      dispatch({
        type: 'stockOutDistributionDetails/saveRemarks',
        payload: {
          remarks: value,
        },
      });
    },
    selectWareHouse(value) {
      dispatch({
        type: 'stockOutDistributionDetails/querySuccess',
        payload: {
          depotId: value,
        },
      });
    },
    onSaveStockOut(flag, param) {
      dispatch({
        type: 'stockOutDistributionDetails/saveStockOut',
        payload: {
          flag,
          param,
        },
      });
    },
  };
  const stockOutDetailsListData = {
    loading,
    storeId,
    redFlag,
    sureModal,
    complexModal,
    readyOutDataArray,
    complexDataArray,
    // busiId,
    // busiName,
    dataSourceIndex,
    depotId,
    remarks,
    billType,
    depotName,
    pageType,
    pageStatus,
    detailList,
    pageDetail,
    editableMem,
    goodsList,
    savingStatus,
    bussDate,
    goodsPopListModel,
    popupListPagination,
    foundTreeList,
    findList,
    sureModalHandle: ((type) => {
      dispatch({
        type: 'stockOutDistributionDetails/updateSureModal',
        payload: type,
      });
    }),
    complexModalHandle: ((type) => {
      dispatch({
        type: 'stockOutDistributionDetails/updateComplexModal',
        payload: type,
      });
    }),
    switchType: ((type) => {
      dispatch({
        type: 'stockOutDistributionDetails/startWithType',
        payload: {
          pageType: type,
        },
      });
    }),
    resyncDataSource: ((listData) => {
      dispatch({
        type: 'stockOutDistributionDetails/resyncListData',
        payload: {
          listData,
        },
      });
    }),
    syncMem: ((fieldName) => {
      dispatch({
        type: 'stockOutDistributionDetails/syncMemFields',
        payload: {
          fieldName,
        },
      });
    }),
    getGoodsListByTyping: ((queryString) => {
      dispatch({
        type: 'stockOutDistributionDetails/queryGoodsCoding',
        payload: { limit: 20, status: 1, storeId, busiId, depotId, queryString },
      });
    }),
    syncSeletedItemIntoRow: ((selectedObjs, index, fieldName, isModal) => {
      dispatch({
        type: 'stockOutDistributionDetails/syncSeletedItemIntoList',
        payload: { selectedObjs, index, fieldName, isModal },
      });
    }),
    toNextMem: ((rowIndex, fieldName, isShow) => {
      dispatch({
        type: 'stockOutDistributionDetails/toNextMemByCurr',
        payload: { rowIndex, fieldName, isShow },
      });
    }),
    toggleMemStatus: ((rowIndex, fieldName) => {
      dispatch({
        type: 'stockOutDistributionDetails/toggleMemStatus',
        payload: { rowIndex, fieldName },
      });
    }),
    updateEditableMem(targetField, index) {
      dispatch({
        type: 'stockOutDistributionDetails/updateEditableMem',
        payload: { targetField, index },
      });
    },
    insertNewRowAfterIndex: ((index) => {
      dispatch({
        type: 'stockOutDistributionDetails/insertNewListItemAfterIndex',
        payload: { index },
      });
    }),
    removeRowAtIndex: ((deltId, index) => {
      dispatch({
        type: 'stockOutDistributionDetails/removeListItemAtIndex',
        payload: { deltId, index },
      });
    }),
    saveDetails: ((status) => {
      dispatch({
        type: 'stockOutDistributionDetails/updateSureModal',
        payload: false,
      });
      dispatch({
        type: 'stockOutDistributionDetails/saveStockOutDetails',
        payload: { storeId, status },
      });
    }),
    cancelDetailPage: (() => {
      dispatch({
        type: 'stockOutDistributionDetails/cancelDetailData',
        payload: {},
      });
      dispatch({
        type: 'stockOutDistributionDetails/resetSearchList',
        payload: {
          storeId,
        },
      });
      dispatch({
        type: 'stockOutDistributionDetails/querySuccess',
        payload: {
          pageStatus: 963,
          findList: [],
        },
      });
    }),
    switchEditingStatus: ((rowIndex, fieldName, status) => {
      dispatch({
        type: 'stockOutDistributionDetails/changeEditingStatus',
        payload: { rowIndex, fieldName, status },
      });
    }),
    updateRedFlag: ((redFlag, row, type) => {
      dispatch({
        type: 'stockOutDistributionDetails/updateRedFlag',
        payload: {
          flag: redFlag,
          rowIndex: row,
          types: type,
        },
      });
    }),
    updateReadyOutDataArraynow(value) {
      dispatch({
        type: 'stockOutDistributionDetails/updateReadyOutDataArraynow',
        payload: value,
      });
    },
    updateComplexDataArraynow(value) {
      dispatch({
        type: 'stockOutDistributionDetails/updateComplexDataArraynow',
        payload: value,
      });
    },
    onUpdateAdd() { // 验证
      if (false) {
        message.error('出库仓库不能为空！');
        return false;
      }
      return null;
    },
  };

  const DetailsFilterData = {
    ...stockOutDetailsSearchList,
  };

  const DetailsListData = {
    ...stockOutDetailsListData,
  };
  return (
    <div className="routes">
      <StockOutDetailsSearch {...DetailsFilterData} />
      <StockOutDetailsList {...DetailsListData} />
    </div>
  );
};
StockOutDistributionDetails.propTypes = {
  dispatch: PropTypes.func,
};
function mapStateToProps(stockOutDetailsData) {
  return { stockOutDetailsData };
}
export default connect(mapStateToProps)(StockOutDistributionDetails);
