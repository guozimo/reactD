import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { message } from 'antd';
import _ from 'lodash';
import DetailsFilter from '../../components/Inventory/CannManage/details/filter';
// import DetailListCreate from '../../components/Inventory/CannManage/details/listCreate';
import DetailListView from '../../components/Inventory/CannManage/details/listView';

const CannManageDetails = ({ cannMangeDetailsModule, dispatch }) => {
  const { storeId, billNo, startDate, fetching, depotInCannList, InFetching, depotCannList, opType, remarks, outDepotId, inDepotId, user, bussDate, detailList, pageDetail,
    editableMem, goodsList, loadingList, dataSourceIndex, pageStatus, savingStatus, goodsPopListModel, popupListPagination, billInfo, foundTreeList, popupListLoading } = cannMangeDetailsModule;
  const SearchData = {
    opType,
    user,
    bussDate,
    billInfo,
    outDepotId,
    inDepotId,
    remarks,
    depotCannList,
    depotInCannList,
    startDate,
    fetching,
    InFetching,
    selectedBussDate(date, dateString) {
      dispatch({
        type: 'cannMangeDetailsModule/setBussinessDate',
        payload: {
          date,
          dateString,
        },
      });
    },
    searchDepot(value, type) { // 供应商名称搜索
      // console.log("我是搜索",value);
      if (type === 'out') {
        dispatch({
          type: 'cannMangeDetailsModule/querySuccess',
          payload: {
            fetching: true,
          },
        });
      } else {
        dispatch({
          type: 'cannMangeDetailsModule/querySuccess',
          payload: {
            inFetching: true,
          },
        });
      }
      dispatch({
        type: 'cannMangeDetailsModule/outQueryDepot',
        payload: { rows: 10, storeId, queryString: value, type },
      });
    },
    upadateOutDepot(value) { // 调出仓库：
      if (inDepotId && inDepotId === value) {
        message.error('调入仓库不能等于调出仓库');
        return false;
      } else {
        const newCannList = _.find(depotCannList, item => item && item.id === value);
        dispatch({
          type: 'cannMangeDetailsModule/querySuccess',
          payload: {
            outDepotId: value,
            newCannList: newCannList ? [newCannList] : [],
          },
        });
        return null;
      }
    },
    searchInDepot(value) { // 供应商名称搜索
      // console.log("我是搜索",value);
      dispatch({
        type: 'cannMangeDetailsModule/querySuccess',
        payload: {
          inFetching: true,
        },
      });
      dispatch({
        type: 'cannMangeDetailsModule/queryDepot',
        payload: { rows: 10, storeId, queryString: value },
      });
    },
    upadateInDepot(value) { // 调入仓库：
      if (outDepotId && outDepotId === value) {
        message.error('调入仓库不能等于调出仓库');
        return false;
      } else {
        // console.log("-----------------------------22");
        const newCannList = _.find(depotCannList, item => item && item.id === value);
        dispatch({
          type: 'cannMangeDetailsModule/querySuccess',
          payload: {
            inDepotId: value,
            newCannList: newCannList ? [newCannList] : [],
          },
        });
      }
    },
    upadateRemarks(value) { //  备注
      const newRemarks = value.target.value;
      if (newRemarks.length > 200) {
        message.error('备注不能超过200个字！');
        return false;
      } else {
        dispatch({
          type: 'cannMangeDetailsModule/querySuccess',
          payload: {
            remarks: newRemarks,
          },
        });
      }
    },
  };
  // console.log("RequisitionDetails goodsPopListModel",goodsPopListModel)
  const ListData = {
    opType,
    pageStatus,
    detailList,
    pageDetail,
    editableMem,
    goodsList,
    savingStatus,
    bussDate,
    loadingList,
    goodsPopListModel,
    popupListPagination,
    foundTreeList,
    storeId,
    outDepotId,
    inDepotId,
    popupListLoading,
    dataSourceIndex,

    switchType: ((type) => {
      dispatch({
        type: 'cannMangeDetailsModule/startWithType',
        payload: {
          opType: type,
        },
      });
    }),
    resyncDataSource: ((listData) => {
      dispatch({
        type: 'cannMangeDetailsModule/resyncListData',
        payload: {
          listData,
        },
      });
    }),
    syncMem: ((fieldName) => {
      dispatch({
        type: 'cannMangeDetailsModule/syncMemFields',
        payload: {
          fieldName,
        },
      });
    }),
    getGoodsListByTyping: ((queryString) => {
      // if (!storeId || !outDepotId) {
      //   message.error('调出仓库不能为空！');
      //   return false;
      // } else if (!storeId || !inDepotId) {
      //   message.error('调入仓库不能为空！');
      //   return false;
      // } else {
      dispatch({
        type: 'cannMangeDetailsModule/queryGoodsCoding',
        payload: { limit: 20, status: 1, queryString },
      });
      // }
    }),
    syncSeletedItemIntoRow: ((selectedObjs, index, fieldName, isModal) => {
      dispatch({
        type: 'cannMangeDetailsModule/syncSeletedItemIntoList',
        payload: { selectedObjs, index, fieldName, isModal },
      });
    }),
    toNextMem: ((rowIndex, fieldName, isShow) => {
      dispatch({
        type: 'cannMangeDetailsModule/toNextMemByCurr',
        payload: { rowIndex, fieldName, isShow },
      });
    }),
    toggleMemStatus: ((rowIndex, fieldName) => {
      dispatch({
        type: 'cannMangeDetailsModule/toggleMemStatus',
        payload: { rowIndex, fieldName },
      });
    }),
    updateEditableMem(targetField, index) {
      // console.log("targetField in updateEditableMem",targetField,index+1);
      dispatch({
        type: 'cannMangeDetailsModule/updateEditableMem',
        payload: { targetField, index },
      });
    },
    insertNewRowAfterIndex: ((index) => {
      dispatch({
        type: 'cannMangeDetailsModule/insertNewListItemAfterIndex',
        payload: { index },
      });
    }),
    removeRowAtIndex: ((deltId, index) => {
      dispatch({
        type: 'cannMangeDetailsModule/removeListItemAtIndex',
        payload: { deltId, index },
      });
    }),
    saveDetails: ((status) => {
      dispatch({
        type: 'cannMangeDetailsModule/saveRequisitionDetails',
        payload: { status },
      });
    }),
    cancelDetailPage: (() => {
      dispatch({
        type: 'cannMangeDetailsModule/cancelDetailData',
        payload: {},
      });
      dispatch({
        type: 'cannManage/getList',
        payload: {
          pageNo: 1,
        },
      });
      dispatch({
        type: 'cannMangeDetailsModule/querySuccess',
        payload: {
          outDepotId: '',
          inDepotId: '',
          remarks: '',
          bussDate: moment(new Date()).format('YYYY-MM-DD'),
          dataSourceIndex: [],
          delIdsList: [],
          pageStatus: 0,
        },
      });
    }),
    switchEditingStatus: ((rowIndex, fieldName, status) => {
      dispatch({
        type: 'cannMangeDetailsModule/changeEditingStatus',
        payload: { rowIndex, fieldName, status },
      });
    }),
    openGoodsModel: ((value) => {
      dispatch({
        type: 'cannMangeDetailsModule/openGoodsModel',
        payload: {
          goodsVisible: true,
          modalRowIndex: value,
        },
      });
    }),

    getGoodsListdata: ((value) => {
      dispatch({
        type: 'cannMangeDetailsModule/getPopListData',
        payload: {
        },
      });
      dispatch({ type: 'cannMangeDetailsModule/searchTreeList', payload: { type: 0 } });
      // dispatch({
      //   type: 'cannMangeDetailsModule/mapPopListDataToModel',
      //   payload: {
      //   },
      // });
    }),
    onCloseModel: (() => {
      dispatch({
        type: 'cannMangeDetailsModule/querySuccess',
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
      // console.warn("page",page);
      dispatch({
        type: 'cannMangeDetailsModule/getPopListData',
        payload: {
          pageNo: page.current,
          pageSize: page.pageSize,
        },
      });
    }),
    selectModalSearch: ((value) => {
      dispatch({
        type: 'cannMangeDetailsModule/getPopListData',
        payload: {
          pageNo: 1,
          pageSize: 10,
          queryString: value,
        },
      });
      dispatch({
        type: 'cannMangeDetailsModule/querySuccess',
        payload: {
          queryModalString: value,
        },
      });
    }),
    onPopupPageSizeChange:((current, pageSize) => {
      dispatch({
        type: 'cannMangeDetailsModule/getPopListData',
        payload: {
          pageNo: 1,
          pageSize,
        },
      });
    }),
    onUpdateAdd() {
      if (!outDepotId) {
        message.error('调出仓库不能为空！');
        return false;
      } else if (!inDepotId) {
        message.error('调入仓库不能为空！');
        return false;
      } else if (outDepotId === inDepotId) {
        message.error('调入仓库不能调出仓库！');
        return false;
      }
      return null;
    },
    onSelectedTreeItem(selectedKeys) { // 根据类别跳转
      // console.log('selectedKeys',selectedKeys);
      dispatch({
        type: 'cannMangeDetailsModule/getPopListData',
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
        type: 'cannMangeDetailsModule/saveCateId',
        payload: {
          cateId: selectedKeys[0],
        },
      });
    },
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

function mapStateToProps({ cannMangeDetailsModule }) {
  return { cannMangeDetailsModule };
}
export default connect(mapStateToProps)(CannManageDetails);
