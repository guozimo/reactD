import React, { PropTypes } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import moment from 'moment';
import PurchaseCheckSearch from '../../components/Inventory/PurchaseCheck/search';
import PurchaseCheckList from '../../components/Inventory/PurchaseCheck/list';

const PurchaseCheck = ({ purchaseCheckData, dispatch }) => {
  const {
    loading,
    storeId, // 机构id
    distribId, // 机构id
    aclStoreListAll, // 全部机构
    storeList, // 仓库列表
    pagination, // 首页分页
    dataQuerySupplyList, // tabele列表
    typeList,
    listStatus,
    searchAll, // 搜索的全部数据
    busiListId, // 供应商id
    fetching,
    supplierList, // 供应商数组
    filterDataRange,
    supplyListPage,
    billListNo,
    storeListId,
  } = purchaseCheckData.purchaseCheck;
// console.log("status",status);
  const PurchaseCheckSearchProps = { // 首页搜索
    distribIdList: aclStoreListAll, // 全部机构
    storeId: storeListId, // 机构id
    distribId, // 机构id
    storeList, // 仓库列表
    fetching,
    supplierList,
    busiId: busiListId,
    status: listStatus,
    billNo: billListNo,
    filterDataRange,
    key: distribId,
    updateListBillNo(value) { // 修改订单
      // console.log("page",page);
      dispatch({
        type: 'purchaseCheck/querySuccess',
        payload: {
          billListNo: value.target.value,
        },
      });
    },
    selectListBillNo(value) { // 修改订单
      // console.log("page",page);
      // dispatch({
      //   type: 'purchaseCheck/querySuccess',
      //   payload: {
      //     billListNo: value.target.value,
      //   },
      // });
      dispatch({
        type: 'purchaseCheck/querySupplyList',
        payload: {
          distribId,
          billNo: value.target.value,
          busiId: busiListId,
          storeId: storeListId,
          status: listStatus,
          startDate: filterDataRange[0].format('YYYY-MM-DD'),
          endDate: filterDataRange[1].format('YYYY-MM-DD'),
          page: 1,
          rows: 10,
        },
      });
    },
    changeStore(value) { // 选择机构id
      dispatch({
        type: 'purchaseCheck/querySuccess',
        payload: {
          distribId: value,
          storeListId: '',
          billListNo: '',
          filterDataRange: [moment(), moment()],
          busiListId: '',
          listStatus: '',
        },
      });
      dispatch({
        type: 'purchaseCheck/querySupplyList',
        payload: {
          distribId: value,
          page: 1,
          rows: 10,
        },
      });
      dispatch({ // 请求仓库
        type: 'purchaseCheck/queryOrgList',
        payload: {
          distribId: value,
          orgType: 1,
        },
      });
      dispatch({ // 请求仓库
        type: 'purchaseCheck/querySupplier',
        payload: {
          status: 1,
          rows: 10,
        },
      });
    },
    changeFilterDataRange(value) { // 修改分页
      // console.log("修改时间的是滴是滴是value", value);
      dispatch({
        type: 'purchaseCheck/querySuccess',
        payload: {
          filterDataRange: value,
        },
      });
      dispatch({
        type: 'purchaseCheck/querySupplyList',
        payload: {
          distribId,
          billNo: billListNo,
          busiId: busiListId,
          storeId: storeListId,
          status: listStatus,
          startDate: value[0].format('YYYY-MM-DD'),
          endDate: value[1].format('YYYY-MM-DD'),
          page: 1,
          rows: 10,
        },
      });
    },
    updateBusiId(value) { // 供应商修改
      const newValueShop = _.find(supplierList, item => item && item.id === value);
      dispatch({
        type: 'purchaseCheck/querySuccess',
        payload: {
          busiListId: value,
          newValueShop: newValueShop ? [newValueShop] : [],
        },
      });
      dispatch({
        type: 'purchaseCheck/querySupplyList',
        payload: {
          distribId,
          billNo: billListNo,
          busiId: value,
          storeId: storeListId,
          status: listStatus,
          startDate: filterDataRange[0].format('YYYY-MM-DD'),
          endDate: filterDataRange[1].format('YYYY-MM-DD'),
          page: 1,
          rows: 10,
        },
      });
    },
    updateStoreId(value) { // 仓库修改
      const newValueShop = _.find(storeList, item => item && item.id === value);
      dispatch({
        type: 'purchaseCheck/querySuccess',
        payload: {
          storeListId: value,
          newValueStore: newValueShop ? [newValueShop] : [],
        },
      });
      dispatch({
        type: 'purchaseCheck/querySupplyList',
        payload: {
          distribId,
          billNo: billListNo,
          busiId: busiListId,
          storeId: value,
          status: listStatus,
          startDate: filterDataRange[0].format('YYYY-MM-DD'),
          endDate: filterDataRange[1].format('YYYY-MM-DD'),
          page: 1,
          rows: 10,
        },
      });
    },
    // fetchShop(value) { // 供应商名称搜索
    //   // console.log("我是搜索",value);
    //   dispatch({
    //     type: 'purchaseCheck/querySuccess',
    //     payload: {
    //       fetching: true,
    //     },
    //   });
    //   dispatch({
    //     type: 'purchaseCheck/querySupplier',
    //     payload: {
    //       status: 1,
    //       rows: '10',
    //       queryString: value,
    //     },
    //   });
    // },
    // fetchStore(value) { // 供应商名称搜索
    //   console.log("我是搜索",value);
    //   dispatch({
    //     type: 'purchaseCheck/querySuccess',
    //     payload: {
    //       fetchingStore: true,
    //     },
    //   });
    //   dispatch({
    //     type: 'purchaseCheck/queryWarehouse',
    //     payload: {
    //       storeId: distribId,
    //       status: 1,
    //       rows: '10',
    //       queryString: value,
    //     },
    //   });
    // },
    updateStatus(value) { // 选择机构id
      const statusValue = value.target.value;
      // console.log('订单状态', value.target.value);
      dispatch({
        type: 'purchaseCheck/querySuccess',
        payload: {
          listStatus: statusValue,
        },
      });
      dispatch({
        type: 'purchaseCheck/querySupplyList',
        payload: {
          distribId,
          billNo: billListNo,
          busiId: busiListId,
          storeId: storeListId,
          status: statusValue,
          startDate: filterDataRange[0].format('YYYY-MM-DD'),
          endDate: filterDataRange[1].format('YYYY-MM-DD'),
          page: 1,
          rows: 10,
        },
      });
    },
    queryAll(value) { // 搜索全部
      // console.log( "---------搜索全部",value);
      dispatch({
        type: 'purchaseCheck/querySupplyList',
        payload: {
          ...value,
          // storeId,
          page: 1,
          rows: 10,
        },
      });
      dispatch({
        type: 'purchaseCheck/querySuccess',
        payload: {
          searchAll: value,
        },
      });
    },
    onAdd() { // 新增采购订单
      dispatch({
        type: 'purchaseCheck/addNewList',
        payload: {
          distribId,
          update: false,
          supplyId: '',
        },
      });
      // dispatch({
      //   type: 'purchaseCheck/querySuccess',
      //   payload: {
      //     update: false,
      //   },
      // });
      // dispatch({
      //   type: 'purchaseCheck/addDepotId',
      //   payload: { orgType: 1, rows: 10, storeId: distribId },
      // });
    },
    updateAudit() { // 弃审
      // dispatch({
      //   type: 'purchaseCheck/querySuccess',
      //   payload: {
      //     storeId: value,
      //   },
      // });
    },
  };
  const PurchaseCheckListProps = { // 首页列表
    loading,
    storeId: storeListId,
    distribId,
    pagination, // 首页分页
    dataQuerySupplyList,
    typeList,
    exportItem(data){
      dispatch({
        type: 'purchaseCheck/queryExport',
        payload: {
          id: data,
          storeId: distribId,
        },
      })
    },
    onPageChange(page) { // 修改分页
      // console.log("page",page);
      dispatch({
        type: 'purchaseCheck/querySupplyList',
        payload: {
          page: page.current,
          rows: page.pageSize,
          // storeId,
          distribId,
          billNo: billListNo,
          busiId: busiListId,
          storeId: storeListId,
          status: listStatus,
          startDate: filterDataRange[0].format('YYYY-MM-DD'),
          endDate: filterDataRange[1].format('YYYY-MM-DD'),
        },
      });
      // dispatch({
      //   type: 'purchaseCheck/querySuccess',
      //   payload: {
      //     supplyListPage: {
      //       page: page.current,
      //       rows: page.pageSize,
      //     },
      //   },
      // });
    },
    onDetails(id, type) { // 判断编辑还是查看
      // console.log("--------------------id",id,"type",type);
      if (type) { // 编辑
        dispatch({
          type: 'purchaseCheck/addNewList',
          payload: {
            distribId,
            update: true,
            supplyId: id,
          },
        });
        // dispatch({
        //   type: 'purchaseCheck/querySuccess',
        //   payload: {
        //     update: true,
        //   },
        // });
      } else { // 查看
        dispatch({
          type: 'purchaseCheck/queryfind',
          payload: {
            id,
            distribId,
          },
        });
      }
    },
    onClose(id) { // 关闭订单
      dispatch({
        type: 'purchaseCheck/queryfind',
        payload: {
          id,
          distribId,
        },
      });
      dispatch({
        type: 'purchaseCheck/querySuccess',
        payload: {
          closeUpdate: true,
        },
      });
      // dispatch({
      //   type: 'purchaseCheck/closeScmDirect',
      //   payload: {
      //     id,
      //     status: '966'
      //   },
      // });
    },
    onPageSizeChange(current, pageSize) { // 修改页条数
      dispatch({
        type: 'purchaseCheck/querySupplyList',
        payload: {
          distribId,
          billNo: billListNo,
          busiId: busiListId,
          storeId: storeListId,
          status: listStatus,
          startDate: filterDataRange[0].format('YYYY-MM-DD'),
          endDate: filterDataRange[1].format('YYYY-MM-DD'),
          page: 1,
          rows: pageSize,
        },
      });
    },
  };
  return (
    <div className="routes">
      <PurchaseCheckSearch {...PurchaseCheckSearchProps} />
      <PurchaseCheckList {...PurchaseCheckListProps} />
    </div>
  );
};
PurchaseCheck.propTypes = {
  dispatch: PropTypes.func,
};
function mapStateToProps(purchaseCheckData) {
  return { purchaseCheckData };
}

export default connect(mapStateToProps)(PurchaseCheck);
