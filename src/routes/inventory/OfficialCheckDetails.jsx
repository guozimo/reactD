import React from 'react';
import { connect } from 'dva';
import DetailsFilter from '../../components/Inventory/OfficialCheck/details/filter';
// import DetailListCreate from '../../components/Inventory/OfficialCheck/details/listCreate';
import moment from 'moment';
import DetailListView from '../../components/Inventory/OfficialCheck/details/listView';

const OfficialCheckDetails = ({ officialCheckDetailsModule, dispatch }) => {
  const { storeId, reposId, orgId, reposList, reposName, opType, depotId, user, bussDate, loadingList, detailList, pageDetail, editableMem, goodsList, pageStatus, savingStatus, goodsPopListModel,
    checkTypes, currRemarks, popupListPagination, dataSourceIndex, billInfo, foundTreeList, popupListLoading } = officialCheckDetailsModule;
  const SearchData = {
    opType,
    user,
    bussDate,
    billInfo,
    checkTypes,
    currRemarks,
    reposId,
    reposName,
    reposList,
    selectTypes(value, editableRowObj) { // editableColNames 用以获取数据后立即生成“编辑参照表”
      const type = value.target.value;
      dispatch({ // 点击盘底类型后立即保存设置
        type: 'officialCheckDetailsModule/saveTypes',
        payload: { checkTypes: type },
      });
      dispatch({ // 点击盘底类型后立即搜索响应类型并且绑定
        type: 'officialCheckDetailsModule/showDetailListByType',
        payload: { editableRowObj },
      });
      dispatch({ // 清空备注remark
        type: 'officialCheckDetailsModule/saveRemarks',
        payload: {
          remarks: '',
        },
      });
    },
    selectedBussDate(date, dateString) {
      dispatch({
        type: 'officialCheckDetailsModule/setBussinessDate',
        payload: {
          date,
          dateString,
        },
      });
    },
    selectRepos(value, editableRowObj) {
      dispatch({ // 点击仓库后立即保存设置
        type: 'officialCheckDetailsModule/saveReposId',
        payload: { reposId: value },
      });

      dispatch({ // 点击仓库后后立即搜索响应类型并且绑定
        type: 'officialCheckDetailsModule/showDetailListByType',
        payload: { editableRowObj },
      });

      dispatch({ // 清空备注remark
        type: 'officialCheckDetailsModule/saveRemarks',
        payload: {
          remarks: '',
        },
      });
    },
    setCurrRemarks(value) {
      // console.log('setCurrRemarks value', value);
      dispatch({
        type: 'officialCheckDetailsModule/saveRemarks',
        payload: {
          remarks: value,
        },
      });
    },
  };
  const ListData = {
    orgId,
    reposId,
    opType,
    storeId,
    depotId,
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
    loadingList,
    checkTypes,
    popupListLoading,
    dataSourceIndex,

    switchType: ((type) => {
      dispatch({
        type: 'officialCheckDetailsModule/startWithType',
        payload: {
          opType: type,
        },
      });
    }),
    resyncDataSource: ((listData) => {
      dispatch({
        type: 'officialCheckDetailsModule/resyncListData',
        payload: {
          listData,
        },
      });
    }),
    syncMem: ((fieldName, index, opName) => {
      dispatch({
        type: 'officialCheckDetailsModule/syncMemFields',
        payload: {
          fieldName,
          index,
          opName,
        },
      });
    }),
    getGoodsListByTyping: ((queryString) => {
      dispatch({
        type: 'officialCheckDetailsModule/queryGoodsCoding',
        payload: { limit: 20, status: 1, storeId, depotId, queryString },
      });
    }),
    syncSeletedItemIntoRow: ((selectedObjs, index, fieldName, isModal) => {
      // console.log("22222222222222222222222222isModal",isModal);
      dispatch({
        type: 'officialCheckDetailsModule/syncSeletedItemIntoList',
        payload: { selectedObjs, index, fieldName, isModal },
      });
    }),
    toNextMem: ((rowIndex, fieldName, isShow, crossOverColsCount = 1) => { // 默认一个
      // console.log("crossOverColsCount",crossOverColsCount);
      dispatch({
        type: 'officialCheckDetailsModule/toNextMemByCurr',
        payload: { rowIndex, fieldName, isShow, crossOverColsCount },
      });
    }),
    toggleMemStatus: ((rowIndex, fieldName) => {
      dispatch({
        type: 'officialCheckDetailsModule/toggleMemStatus',
        payload: { rowIndex, fieldName },
      });
    }),
    updateEditableMem(targetField, index) {
      dispatch({
        type: 'officialCheckDetailsModule/updateEditableMem',
        payload: { targetField, index },
      });
    },
    insertNewRowAfterIndex: ((index) => {
      dispatch({
        type: 'officialCheckDetailsModule/insertNewListItemAfterIndex',
        payload: { index },
      });
    }),
    removeRowAtIndex(deltId, index) {
      // console.log("111111111111deltId",deltId);
      dispatch({
        type: 'officialCheckDetailsModule/removeListItemAtIndex',
        payload: { deltId, index },
      });
    },
    saveDetails: ((status) => {
      dispatch({
        type: 'officialCheckDetailsModule/saveOfficialCheckDetails',
        payload: { status },
      });
    }),
    cancelDetailPage: (() => {
      dispatch({
        type: 'officialCheckDetailsModule/cancelDetailData',
        payload: {},
      });
      dispatch({
        type: 'officialCheckModule/getList', // getOrderLibByFilter
        payload: {},
      });
      dispatch({
        type: 'officialCheckDetailsModule/querySuccess',
        payload: {
          checkTypes: '943',
          reposId: '',
          remarks: '',
          bussDate: moment(new Date()).format('YYYY-MM-DD'),
        },
      });
    }),
    switchEditingStatus: ((rowIndex, fieldName, status) => {
      dispatch({
        type: 'officialCheckDetailsModule/changeEditingStatus',
        payload: { rowIndex, fieldName, status },
      });
    }),
    openGoodsModel: ((value) => {
      dispatch({
        type: 'officialCheckDetailsModule/openGoodsModel',
        payload: {
          goodsVisible: true,
          modalRowIndex: value,
        },
      });
    }),

    getGoodsListdata: ((value) => {
      dispatch({
        type: 'officialCheckDetailsModule/getPopListData',
        payload: {
        },
      });
      // dispatch({
      //   type: 'officialCheckDetailsModule/mapPopListDataToModel',
      //   payload: {
      //   },
      // });
    }),
    onCloseModel: (() => {
      dispatch({
        type: 'officialCheckDetailsModule/querySuccess',
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
        type: 'officialCheckDetailsModule/getPopListData',
        payload: {
          pageNo: page.current,
          pageSize: page.pageSize,
        },
      });
    }),

    onPopupPageSizeChange: ((current, pageSize) => {
      dispatch({
        type: 'officialCheckDetailsModule/getPopListData',
        payload: {
          pageNo: 1,
          pageSize,
        },
      });
    }),
    onSelectedTreeItem(selectedKeys) { // 根据类别跳转
      // console.log('selectedKeys',selectedKeys);
      dispatch({
        type: 'officialCheckDetailsModule/getPopListData',
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
        type: 'officialCheckDetailsModule/saveCateId',
        payload: {
          cateId: selectedKeys[0],
        },
      });
    },
    selectModalSearch: ((value) => {
      dispatch({
        type: 'officialCheckDetailsModule/getPopListData',
        payload: {
          pageNo: 1,
          pageSize: 10,
          queryString: value,
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

function mapStateToProps({ officialCheckDetailsModule }) {
  return { officialCheckDetailsModule };
}
export default connect(mapStateToProps)(OfficialCheckDetails);
