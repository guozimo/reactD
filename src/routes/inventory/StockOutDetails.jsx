import React, { PropTypes } from 'react';
import { connect } from 'dva';
import { message } from 'antd';
import StockOutDetailsSearch from '../../components/Inventory/StockOut/details/filter';
import StockOutDetailsList from '../../components/Inventory/StockOut/details/listView';

const StockOutDetails = ({ stockOutDetailsData, dispatch }) => {
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
  } = stockOutDetailsData.stockOutDetailsModule;
  const dateFormat = 'YYYY-MM-DD';
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
    selectBillType(value) {
      dispatch({
        type: 'stockOutDetailsModule/querySuccess',
        payload: {
          billType: value,
        },
      });
    },
    selectedBussDate(date, dateString) {
      dispatch({
        type: 'stockOutDetailsModule/setBussinessDate',
        payload: {
          date,
          dateString,
        },
      });
    },
    setCurrRemarks(value) {
      dispatch({
        type: 'stockOutDetailsModule/saveRemarks',
        payload: {
          remarks: value,
        },
      });
    },
    // onBusiIdSave(param) {
    //   dispatch({
    //     type: 'stockOutDetailsModule/querySuccess',
    //     payload: {
    //       busiId: param,
    //     },
    //   });
    // },
    // onSupplierQuery(keywords) {
    //   const queryString = keywords || '';
    //   dispatch({
    //     type: 'stockOutDetailsModule/querySupplier',
    //     payload: {
    //       status: 1,
    //       queryString,
    //       limit: 1000,
    //       rows: 1000,
    //     },
    //   });
    // },
    selectWareHouse(value) {
      dispatch({
        type: 'stockOutDetailsModule/querySuccess',
        payload: {
          depotId: value,
        },
      });
    },
    onSaveStockOut(flag, param) {
      dispatch({
        type: 'stockOutDetailsModule/saveStockOut',
        payload: {
          flag,
          param,
        },
      });
    },
  };
  const stockOutDetailsListData = {
    storeId,
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
    switchType: ((type) => {
      dispatch({
        type: 'stockOutDetailsModule/startWithType',
        payload: {
          pageType: type,
        },
      });
    }),
    resyncDataSource: ((listData) => {
      dispatch({
        type: 'stockOutDetailsModule/resyncListData',
        payload: {
          listData,
        },
      });
    }),
    syncMem: ((fieldName) => {
      dispatch({
        type: 'stockOutDetailsModule/syncMemFields',
        payload: {
          fieldName,
        },
      });
    }),
    getGoodsListByTyping: ((queryString) => {
      dispatch({
        type: 'stockOutDetailsModule/queryGoodsCoding',
        payload: { limit: 20, status: 1, storeId, busiId, depotId, queryString },
      });
    }),
    syncSeletedItemIntoRow: ((selectedObjs, index, fieldName, isModal) => {
      dispatch({
        type: 'stockOutDetailsModule/syncSeletedItemIntoList',
        payload: { selectedObjs, index, fieldName, isModal },
      });
    }),
    toNextMem: ((rowIndex, fieldName, isShow) => {
      dispatch({
        type: 'stockOutDetailsModule/toNextMemByCurr',
        payload: { rowIndex, fieldName, isShow },
      });
    }),
    toggleMemStatus: ((rowIndex, fieldName) => {
      dispatch({
        type: 'stockOutDetailsModule/toggleMemStatus',
        payload: { rowIndex, fieldName },
      });
    }),
    updateEditableMem(targetField, index) {
      // console.log("targetField in updateEditableMem", targetField,index+1);
      dispatch({
        type: 'stockOutDetailsModule/updateEditableMem',
        payload: { targetField, index },
      });
    },
    insertNewRowAfterIndex: ((index) => {
      dispatch({
        type: 'stockOutDetailsModule/insertNewListItemAfterIndex',
        payload: { index },
      });
    }),
    removeRowAtIndex: ((deltId, index) => {
      dispatch({
        type: 'stockOutDetailsModule/removeListItemAtIndex',
        payload: { deltId, index },
      });
    }),
    saveDetails: ((status) => {
      dispatch({
        type: 'stockOutDetailsModule/saveStockOutDetails',
        payload: { storeId, status },
      });
    }),
    cancelDetailPage: (() => {
      dispatch({
        type: 'stockOutDetailsModule/cancelDetailData',
        payload: {},
      });
      dispatch({
        type: 'stockOutDetailsModule/resetSearchList',
        payload: {
          storeId,
        },
      });
    }),
    switchEditingStatus: ((rowIndex, fieldName, status) => {
      dispatch({
        type: 'stockOutDetailsModule/changeEditingStatus',
        payload: { rowIndex, fieldName, status },
      });
    }),
    openGoodsModel: ((value) => {
      dispatch({
        type: 'stockOutDetailsModule/openGoodsModel',
        payload: {
          goodsVisible: true,
          modalRowIndex: value,
        },
      });
    }),
    getGoodsListdata: ((value) => {
      dispatch({
        type: 'stockOutDetailsModule/getPopListData',
        payload: {
        },
      });
    }),
    onCloseModel: (() => {
      dispatch({
        type: 'stockOutDetailsModule/querySuccess',
        payload: {
          cateId: '',
          queryModalString: '',
          popupListPagination: {
            current: 1,
            pageSize: 10,
          }
        },
      });
    }),

    onPopupPageChange: ((page) => {
      dispatch({
        type: 'stockOutDetailsModule/getPopListData',
        payload: {
          pageNo: page.current,
          pageSize: page.pageSize,
        },
      });
    }),
    onUpdateAdd() { // 验证
      if (!storeId || !depotId) {
        message.error('出库仓库不能为空！');
        return false;
      } else if (!storeId || !billType) {
        message.error('单据类型不能为空！');
        return false;
      }
      return null;
    },
    onPopupPageSizeChange:((current, pageSize) => {
      dispatch({
        type: 'stockOutDetailsModule/getPopListData',
        payload: {
          pageNo: 1,
          pageSize,
        },
      });
    }),
    onSelectedTreeItem(selectedKeys) { // 根据类别跳转
      // console.log('selectedKeys',selectedKeys);
      dispatch({
        type: 'stockOutDetailsModule/getPopListData',
        payload: {
          cateId: selectedKeys[0],
          // storeId,
          // limit: '20',
          //
          pageSize: 10,
          pageNo: 1,
        },
      });
      dispatch({
        type: 'stockOutDetailsModule/saveCateId',
        payload: {
          cateId: selectedKeys[0],
        },
      });
    },
    selectModalSearch: ((value) => {
      dispatch({
        type: 'stockOutDetailsModule/getPopListData',
        payload: {
          pageNo: 1,
          pageSize: 10,
          queryString: value,
        },
      });
      dispatch({
        type: 'stockOutDetailsModule/querySuccess',
        payload: {
          queryModalString: value,
        },
      });
    }),
  };

  const DetailsFilterData = {
    ...stockOutDetailsSearchList,
  };

  const DetailsListData = {
    ...stockOutDetailsListData,
  };
  // console.warn(DetailsListData);
  return (
    <div className="routes">
      <StockOutDetailsSearch {...DetailsFilterData} />
      <StockOutDetailsList {...DetailsListData} />
    </div>
  );
};
StockOutDetails.propTypes = {
  dispatch: PropTypes.func,
};
function mapStateToProps(stockOutDetailsData) {
  return { stockOutDetailsData };
}
export default connect(mapStateToProps)(StockOutDetails);
