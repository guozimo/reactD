import React from 'react';
import { connect } from 'dva';
import DetailsFilter from '../../components/Inventory/DirectCheck/details/filter';
// import DetailListCreate from '../../components/Inventory/DirectCheck/details/listCreate';
import DetailListView from '../../components/Inventory/DirectCheck/details/listView';

const DirectCheckDetails = ({ directCheckDetailsModule, dispatch }) => {
  const { storeId, depotId, depotList, initialDepotName, billNo, storeName, busiName, status, createUserName, createTime, auditName, auditDate, depotName, remarks,
    opType, user, bussDate, detailList, pageDetail, editableMem, goodsList, pageStatus, savingStatus, arrivalDate } = directCheckDetailsModule;
  const SearchData = {
    opType,
    user,
    bussDate,
    billNo,
    storeName,
    busiName,
    status,
    createUserName,
    createTime,
    auditName,
    auditDate,
    depotName,
    remarks,
    depotId, // 入库仓库id
    depotList, // 入库仓库列表
    initialDepotName, // 入库仓库初始值
    arrivalDate, // 到货时间
    selectedBussDate(date, dateString) {
      dispatch({
        type: 'directCheckDetailsModule/setBussinessDate',
        payload: {
          date,
          dateString,
        },
      });
    },
    changeDepot(value) {
      dispatch({
        type: 'directCheckDetailsModule/changeDepot',
        payload: {
          depotId: value,
        },
      });
    },
  };
  const ListData = {
    opType,
    pageStatus,
    detailList,
    pageDetail,
    editableMem,
    goodsList,
    savingStatus,
    switchType: ((type) => {
      dispatch({
        type: 'directCheckDetailsModule/startWithType',
        payload: {
          opType: type,
        },
      });
    }),
    resyncDataSource: ((listData) => {
      dispatch({
        type: 'directCheckDetailsModule/resyncListData',
        payload: {
          listData,
        },
      });
    }),
    syncMem: ((fieldName) => {
      dispatch({
        type: 'directCheckDetailsModule/syncMemFields',
        payload: {
          fieldName,
        },
      });
    }),
    getGoodsListByTyping: ((queryString) => {
      dispatch({
        type: 'directCheckDetailsModule/queryGoodsCoding',
        payload: { limit: 20, status: 1, storeId, queryString },
      });
    }),
    syncSeletedItemIntoRow: ((selectedObjs, index) => {
      dispatch({
        type: 'directCheckDetailsModule/syncSeletedItemIntoList',
        payload: { selectedObjs, index },
      });
    }),
    insertNewRowAfterIndex: ((index) => {
      dispatch({
        type: 'directCheckDetailsModule/insertNewListItemAfterIndex',
        payload: { index },
      });
    }),
    removeRowAtIndex: ((index) => {
      dispatch({
        type: 'directCheckDetailsModule/removeListItemAtIndex',
        payload: { index },
      });
    }),
    saveDetails: ((status) => {
      dispatch({
        type: 'directCheckDetailsModule/saveDirectCheckDetails',
        payload: { status },
      });
    }),
    cancelDetailPage: (() => {
      dispatch({
        type: 'directCheckDetailsModule/cancelDetailData',
        payload: {},
      });
      dispatch({
        type: 'directCheckModule/getList', // getOrderLibByFilter
        payload: {},
      });
    }),
    toNextMem: ((rowIndex, fieldName, isShow) => {
      dispatch({
        type: 'directCheckDetailsModule/toNextMemByCurr',
        payload: { rowIndex, fieldName, isShow },
      });
    }),
    toggleMemStatus: ((rowIndex, fieldName) => {
      dispatch({
        type: 'directCheckDetailsModule/toggleMemStatus',
        payload: { rowIndex, fieldName },
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

function mapStateToProps({ directCheckDetailsModule }) {
  return { directCheckDetailsModule };
}
export default connect(mapStateToProps)(DirectCheckDetails);
