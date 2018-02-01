import React from 'react';
import { connect } from 'dva';
import DetailsFilter from '../../components/Inventory/OrderLib/details/filter';
// import DetailListCreate from '../../components/Inventory/OrderLib/details/listCreate';
import DetailListView from '../../components/Inventory/OrderLib/details/listView';

const OrderLibDetails = ({ orderLibDetailsModule, dispatch }) => {
  const { storeId, loadingList, opType, user, bussDate, detailList, pageInfo, pageDetail, editableMem, goodsList, pageStatus, currentId, filterNo, prosessingStatus, billStatus, billInfo, processData, processStatus } = orderLibDetailsModule;
  const SearchData = {
    opType,
    user,
    bussDate,
    currentId,
    pageInfo,
    filterNo,
    billStatus,
    selectedBussDate(date, dateString) {
      dispatch({
        type: 'orderLibDetailsModule/setBussinessDate',
        payload: {
          date,
          dateString,
        },
      });
    },
  };
  const ListData = {
    opType,
    pageInfo,
    pageStatus,
    detailList,
    pageDetail,
    editableMem,
    goodsList,
    billInfo,
    loadingList,
    prosessingStatus,
    processData,
    processStatus,
    findBillNoInfo: ((id, directionType) => {
      dispatch({
        type: 'orderLibDetailsModule/findBillNoInfo',
        payload: {
          id,
          directionType
        },
      });
    }),
    switchType: ((type) => {
      dispatch({
        type: 'orderLibDetailsModule/startWithType',
        payload: {
          opType: type,
        },
      });
    }),
    confirmProcess: (() => {
      dispatch({
        type: 'orderLibDetailsModule/confirmProcessData',
      });
    }),
    hideModal: (() => {
      dispatch({
        type: 'orderLibDetailsModule/confirmProcessData',
      });
    }),
    resyncDataSource: ((listData) => {
      dispatch({
        type: 'orderLibDetailsModule/resyncListData',
        payload: {
          listData,
        },
      });
    }),
    syncMem: ((fieldName) => {
      dispatch({
        type: 'orderLibDetailsModule/syncMemFields',
        payload: {
          fieldName,
        },
      });
    }),
    getGoodsListByTyping: ((queryString) => {
      dispatch({
        type: 'orderLibDetailsModule/queryGoodsCoding',
        payload: { limit: 20, status: 1, storeId, queryString },
      });
    }),
    syncSeletedItemIntoRow: ((selectedObj, index) => {
      dispatch({
        type: 'orderLibDetailsModule/syncSeletedItemIntoList',
        payload: { selectedObj, index },
      });
    }),
    insertNewRowAfterIndex: ((index) => {
      dispatch({
        type: 'orderLibDetailsModule/insertNewListItemAfterIndex',
        payload: { index },
      });
    }),
    removeRowAtIndex: ((index) => {
      dispatch({
        type: 'orderLibDetailsModule/removeListItemAtIndex',
        payload: { index },
      });
    }),
    doProgress: ((status) => {
      dispatch({
        type: 'orderLibDetailsModule/progressOrderLibDetails',
        payload: { status },
      });
    }),
    cancelDetailPage: (() => {
      dispatch({
        type: 'orderLibDetailsModule/cancelDetailData',
        payload: {},
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

function mapStateToProps({ orderLibDetailsModule }) {
  return { orderLibDetailsModule };
}
export default connect(mapStateToProps)(OrderLibDetails);
