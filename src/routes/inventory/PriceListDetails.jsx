import React from 'react';
import { connect } from 'dva';
import DetailsFilter from '../../components/Inventory/PriceList/details/filter';
// import DetailListCreate from '../../components/Inventory/PriceList/details/listCreate';
import DetailListView from '../../components/Inventory/PriceList/details/listView';

const PriceListDetails = ({ priceListDetailsModule, dispatch }) => {
  const { storeId, billNo, opType, user, bussDate, detailList, pageDetail, editableMem, goodsList, pageStatus, savingStatus, goodsPopListModel,
    popupListPagination, dataSourceIndex, billInfo, foundTreeList, popupListLoading, loadingList, selectedReposes, selectedOrg, selectedStore, storeListOfOrg, billStatus, confilictionRows } = priceListDetailsModule;
  const SearchData = {
    opType, // 当前单据操作类型
    user,
    bussDate,
    billInfo, // 单据信息
    selectedReposes, // 选中的仓库
    selectedOrg, // 选中的机构
    selectedStore, // 已经选择的门店
    storeListOfOrg, // 所有可用门店列表
    selectedBussDate(date, dateString) {
      dispatch({
        type: 'priceListDetailsModule/setBussinessDate',
        payload: {
          date,
          dateString,
        },
      });
    },
    updateSelectedStoreList(storeList) {
      dispatch({
        type: 'priceListDetailsModule/setSelectedStoreList',
        payload: {
          storeList,
        },
      });
    }
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
    billStatus,
    confilictionRows,

    switchType: ((type) => {
      dispatch({
        type: 'priceListDetailsModule/startWithType',
        payload: {
          opType: type,
        },
      });
    }),
    resyncDataSource: ((listData) => {
      dispatch({
        type: 'priceListDetailsModule/resyncListData',
        payload: {
          listData,
        },
      });
    }),
    syncMem: ((fieldName) => {
      dispatch({
        type: 'priceListDetailsModule/syncMemFields',
        payload: {
          fieldName,
        },
      });
    }),
    getGoodsListByTyping: ((queryString) => {
      dispatch({
        type: 'priceListDetailsModule/queryGoodsCoding',
        payload: { limit: 20, status: 1, storeId, queryString },
      });
    }),
    syncSeletedItemIntoRow: ((selectedObjs, index, fieldName, isModal) => {
      dispatch({
        type: 'priceListDetailsModule/syncSeletedItemIntoList',
        payload: { selectedObjs, index, fieldName, isModal },
      });
      // dispatch({
      //   type: 'priceListDetailsModule/toNextMemByCurr',
      //   payload: { index, fieldName },
      // });
    }),
    toNextMem: ((rowIndex, fieldName, isShow) => {
      dispatch({
        type: 'priceListDetailsModule/toNextMemByCurr',
        payload: { rowIndex, fieldName, isShow },
      });
    }),
    toggleMemStatus: ((rowIndex, fieldName) => {
      dispatch({
        type: 'priceListDetailsModule/toggleMemStatus',
        payload: { rowIndex, fieldName },
      });
    }),
    updateEditableMem(targetField, index) {
      // console.log('targetField in updateEditableMem', targetField,index+1);
      dispatch({
        type: 'priceListDetailsModule/updateEditableMem',
        payload: { targetField, index },
      });
    },
    insertNewRowAfterIndex: ((index) => {
      dispatch({
        type: 'priceListDetailsModule/insertNewListItemAfterIndex',
        payload: { index },
      });
    }),
    removeRowAtIndex: ((index) => {
      dispatch({
        type: 'priceListDetailsModule/removeListItemAtIndex',
        payload: { index },
      });
    }),
    saveDetails: ((status) => {
      dispatch({
        type: 'priceListDetailsModule/savePriceListDetails',
        payload: { status },
      });
    }),
    cancelDetailPage: (() => {
      dispatch({
        type: 'priceListDetailsModule/cancelDetailData',
        payload: {},
      });
      dispatch({
        type: 'priceListModule/getList', // getOrderLibByFilter
        payload: {},
      });
      dispatch({
        type: 'priceListDetailsModule/querySuccess',
        payload: {
          dataSourceIndex: [],
          // pageDetail: [],
        },
      });
    }),
    switchEditingStatus: ((rowIndex, fieldName, status) => {
      dispatch({
        type: 'priceListDetailsModule/changeEditingStatus',
        payload: { rowIndex, fieldName, status },
      });
    }),
    openGoodsModel: ((value) => {
      dispatch({
        type: 'priceListDetailsModule/openGoodsModel',
        payload: {
          goodsVisible: true,
          modalRowIndex: value,
        },
      });
    }),

    getGoodsListdata: ((value) => {
      dispatch({
        type: 'priceListDetailsModule/getPopListData',
        payload: {
        },
      });
      dispatch({
        type: 'priceListDetailsModule/searchTreeList',
        payload: { type: 0 }, // 0,1
      });
      // dispatch({
      //   type: 'priceListDetailsModule/mapPopListDataToModel',
      //   payload: {
      //   },
      // });
    }),

    onPopupPageChange: ((page) => {
      dispatch({
        type: 'priceListDetailsModule/getPopListData',
        payload: {
          pageNo: page.current,
          pageSize: page.pageSize,
        },
      });
    }),
    onPopupPageSizeChange:((current, pageSize) => {
      dispatch({
        type: 'priceListDetailsModule/getPopListData',
        payload: {
          pageNo: 1,
          pageSize,
        },
      });
    }),
    onSelectedTreeItem(selectedKeys) { // 根据类别跳转
      // console.log('selectedKeys',selectedKeys);
      dispatch({
        type: 'priceListDetailsModule/getPopListData',
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
        type: 'priceListDetailsModule/saveCateId',
        payload: {
          cateId: selectedKeys[0],
        },
      });
    },
    selectModalSearch: ((value) => {
      dispatch({
        type: 'priceListDetailsModule/getPopListData',
        payload: {
          pageNo: 1,
          pageSize: 10,
          queryString: value,
        },
      });
    }),
    onCloseModel: (() => {
      dispatch({
        type: 'priceListDetailsModule/querySuccess',
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
    confirmConfiliction: (() => {
      dispatch({
        type: 'priceListDetailsModule/confirmConfilictionRows',
        payload: {
        },
      });
    }),
    deleteAGoods: ((item) => {
      dispatch({
        type: 'priceListDetailsModule/deleteAGoodsItem',
        payload: {
          item
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

function mapStateToProps({ priceListDetailsModule }) {
  return { priceListDetailsModule };
}
export default connect(mapStateToProps)(PriceListDetails);
