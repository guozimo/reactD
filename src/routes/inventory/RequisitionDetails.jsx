import React from 'react';
import { connect } from 'dva';
import DetailsFilter from '../../components/Inventory/Requisition/details/filter';
// import DetailListCreate from '../../components/Inventory/Requisition/details/listCreate';
import DetailListView from '../../components/Inventory/Requisition/details/listView';

const RequisitionDetails = ({ requisitionDetailsModule, dispatch }) => {
  const { storeId, opType, user, bussDate, detailList, pageDetail, editableMem, goodsList, pageStatus, savingStatus, goodsPopListModel,
    popupListPagination, dataSourceIndex, billInfo, foundTreeList, popupListLoading, loadingList } = requisitionDetailsModule;
  const SearchData = {
    opType,
    user,
    bussDate,
    billInfo,
    selectedBussDate(date, dateString) {
      dispatch({
        type: 'requisitionDetailsModule/setBussinessDate',
        payload: {
          date,
          dateString,
        },
      });
    },
  };
  // console.log("dataSourceIndex",dataSourceIndex)
  const ListData = {
    opType,
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
    popupListLoading,
    dataSourceIndex,
    loadingList,
    billInfo,
    findBillNoInfo: ((id, directionType) => {
      dispatch({
        type: 'requisitionDetailsModule/findBillNoInfo',
        payload: {
          id,
          directionType
        },
      });
    }),
    switchType: ((type) => {
      dispatch({
        type: 'requisitionDetailsModule/startWithType',
        payload: {
          opType: type,
        },
      });
    }),
    resyncDataSource: ((listData) => {
      dispatch({
        type: 'requisitionDetailsModule/resyncListData',
        payload: {
          listData,
        },
      });
    }),
    syncMem: ((fieldName) => {
      dispatch({
        type: 'requisitionDetailsModule/syncMemFields',
        payload: {
          fieldName,
        },
      });
    }),
    getGoodsListByTyping: ((queryString) => {
      dispatch({
        type: 'requisitionDetailsModule/queryGoodsCoding',
        payload: { limit: 20, status: 1, storeId, queryString },
      });
    }),
    syncSeletedItemIntoRow: ((selectedObjs, index, fieldName, isModal) => {
      dispatch({
        type: 'requisitionDetailsModule/syncSeletedItemIntoList',
        payload: { selectedObjs, index, fieldName, isModal },
      });
      // dispatch({
      //   type: 'requisitionDetailsModule/toNextMemByCurr',
      //   payload: { index, fieldName },
      // });
    }),
    toNextMem: ((rowIndex, fieldName, isShow) => {
      dispatch({
        type: 'requisitionDetailsModule/toNextMemByCurr',
        payload: { rowIndex, fieldName, isShow },
      });
    }),
    toggleMemStatus: ((rowIndex, fieldName) => {
      dispatch({
        type: 'requisitionDetailsModule/toggleMemStatus',
        payload: { rowIndex, fieldName },
      });
    }),
    updateEditableMem(targetField, index) {
      // console.log('targetField in updateEditableMem', targetField,index+1);
      dispatch({
        type: 'requisitionDetailsModule/updateEditableMem',
        payload: { targetField, index },
      });
    },
    insertNewRowAfterIndex: ((index) => {
      dispatch({
        type: 'requisitionDetailsModule/insertNewListItemAfterIndex',
        payload: { index },
      });
    }),
    removeRowAtIndex: ((index) => {
      dispatch({
        type: 'requisitionDetailsModule/removeListItemAtIndex',
        payload: { index },
      });
    }),
    saveDetails: ((status) => {
      dispatch({
        type: 'requisitionDetailsModule/saveRequisitionDetails',
        payload: { status },
      });
    }),
    cancelDetailPage: (() => {
      dispatch({
        type: 'requisitionDetailsModule/cancelDetailData',
        payload: {},
      });
      dispatch({
        type: 'requisitionModule/getList', // getOrderLibByFilter
        payload: {},
      });
      dispatch({
        type: 'requisitionDetailsModule/querySuccess',
        payload: {
          dataSourceIndex: [],
          billInfo: [],
          pageDetail: [],
          bussDate: null,
        },
      });
    }),
    switchEditingStatus: ((rowIndex, fieldName, status) => {
      dispatch({
        type: 'requisitionDetailsModule/changeEditingStatus',
        payload: { rowIndex, fieldName, status },
      });
    }),
    openGoodsModel: ((value) => {
      dispatch({
        type: 'requisitionDetailsModule/openGoodsModel',
        payload: {
          goodsVisible: true,
          modalRowIndex: value,
        },
      });
    }),

    getGoodsListdata: ((value) => {
      dispatch({
        type: 'requisitionDetailsModule/getPopListData',
        payload: {
        },
      });
      dispatch({
        type: 'requisitionDetailsModule/searchTreeList',
        payload: { type: 0 },
      });
      // dispatch({
      //   type: 'requisitionDetailsModule/mapPopListDataToModel',
      //   payload: {
      //   },
      // });
    }),

    onPopupPageChange: ((page) => {
      dispatch({
        type: 'requisitionDetailsModule/getPopListData',
        payload: {
          pageNo: page.current,
          pageSize: page.pageSize,
        },
      });
    }),
    onPopupPageSizeChange:((current, pageSize) => {
      dispatch({
        type: 'requisitionDetailsModule/getPopListData',
        payload: {
          pageNo: 1,
          pageSize,
        },
      });
    }),
    onSelectedTreeItem(selectedKeys) { // 根据类别跳转
      // console.log('selectedKeys',selectedKeys);
      dispatch({
        type: 'requisitionDetailsModule/getPopListData',
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
        type: 'requisitionDetailsModule/saveCateId',
        payload: {
          cateId: selectedKeys[0],
        },
      });
    },
    selectModalSearch: ((value) => {
      dispatch({
        type: 'requisitionDetailsModule/getPopListData',
        payload: {
          pageNo: 1,
          pageSize: 10,
          queryString: value,
        },
      });
    }),
    onCloseModel: (() => {
      dispatch({
        type: 'requisitionDetailsModule/querySuccess',
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
  };

  const DetailsFilterData = {
    ...SearchData,
  };

  const DetailsListData = {
    ...ListData,
  };

  return (
    <div className="routes">
      <DetailsFilter {...DetailsFilterData} />
      {(() => {
        // if (opType === 'create' || opType === 'edit') {
        //   return <DetailListCreate {...DetailsListData} />;
        // }
        // return <DetailListView {...DetailsListData} />;
      })()}
      <DetailListView {...DetailsListData} />
    </div>
  );
};

function mapStateToProps({ requisitionDetailsModule }) {
  return { requisitionDetailsModule };
}
export default connect(mapStateToProps)(RequisitionDetails);
