import React from 'react';
import { connect } from 'dva';
import { message } from 'antd'
import CannManageSearch from '../../components/Inventory/CannManage/search';
import CannManageList from '../../components/Inventory/CannManage/list';

const CannManage = ({ cannManage, dispatch }) => {
  const { storeId, depotList, depotCannList, opType, outNewDepotId, inNewDepotId, loading, newData, dataSourceAll, billStatus, filterStatus, filterDataRange, filterOpterName, filterBillNo, listPagination } = cannManage;
  // const { storeId, loading, depotList, supplierList, typeList, warehouseList, newData, dataSourceAll, pagination,
  // dataSource, count, editableMem, selectData } = cannManage;
  // console.log('storeId:',storeId);
  const requisitionSearchList = {

    storeId,
    newData,

    filterStatus,
    filterOpterName,
    filterDataRange, // 采购日期
    depotCannList, // 出入库
    filterBillNo, // 首页编号
    outNewDepotId, // 调出仓库ID
    inNewDepotId, // 调入仓库ID
    opType,
    key: storeId,
    storeList: depotList,
    upadateOutDepot(value) { // 出库
      // _.remove(dataList, item => {
      //     item.id === value
      // })
      // console.log('dataList', value);
      if (inNewDepotId && inNewDepotId === value) {
        message.error('调入仓库不能等于调出仓库');
        return false;
      }
      dispatch({
        type: 'cannManage/querySuccess',
        payload: {
          outNewDepotId: value,
        },
      });
    },
    upadateInDepot(value) { // 入库
      if (outNewDepotId && outNewDepotId === value) {
        message.error('调入仓库不能等于调出仓库');
        return false;
      }
      dispatch({
        type: 'cannManage/querySuccess',
        payload: {
          inNewDepotId: value,
        },
      });
    },
    selectStore(value) {
      if (value) {
        dispatch({
          type: 'cannManage/queryDepot',
          payload: {
            rows: 10,
            storeId: value,
          },
        });
      }
      dispatch({
        type: 'cannManage/querySuccess',
        payload: {
          storeId: value,
          outNewDepotId: '',
          dataSourceAll: [],
          inNewDepotId: '',
          filterStatus: '',
        },
      });
      dispatch({
        type: 'cannMangeDetailsModule/querySuccess',
        payload: {
          newCannList: [],
        },
      });
      dispatch({
        type: 'cannManage/getList',
        payload: {
          storeId: value,
          pageNo: 1,
        },
      });
    },
    onCreate(value) {
      // dispatch({
      //   type: 'cannMangeDetailsModule/queryDepot',
      //   payload: {
      //     rows: 10,
      //     storeId,
      //   },
      // });

      dispatch({
        type: 'cannManage/createBill',
        payload: {
          dataSource: [storeId],
          opType: 'create',
          cannId: '',
        },
      });
      dispatch({
        type: 'cannMangeDetailsModule/querySuccess',
        payload: {
          storeId,
        },
      });
      // dispatch({
      //   type: 'cannMangeDetailsModule/startWithType', // 写在此处不写在上面intoModel的原因是因为要驱动初始添加数据。
      //   payload: {
      //     opType: 'create',
      //   },
      // });
    },
    queryAll(value) {
      dispatch({
        type: 'cannManage/getList',
        payload: {
          value,
          pageNo: 1,
        },
      });
    },
    changeFilterStatus(event) {
      dispatch({
        type: 'cannManage/setFilterStatus',
        payload: {
          filterStatus: event.target.value,
        },
      });

      // 选择订单状态后自动搜索
      dispatch({
        type: 'cannManage/getList', // getRequisitionByFilter
        payload: { pageNo: 1 },
      });
    },
    changeFilterDataRange(dates) { // 修改采购日期
      // console.warn("data",dates);
      if (dates.length) {
        dispatch({
          type: 'cannManage/setFilterDataRange',
          payload: {
            filterDataRange: dates,
          },
        });
        // 选择订单时间后自动搜索
        dispatch({
          type: 'cannManage/getList', // getRequisitionByFilter
          payload: { pageNo: 1 },
        });
      }
    },
    changeFilterOpterName(event) {
      dispatch({
        type: 'cannManage/setFilterOpterName',
        payload: {
          filterOpterName: event.target.value,
        },
      });
      // // 修改创建人后自动搜索
      // dispatch({
      //   type: 'cannManage/getList', // getRequisitionByFilter
      //   payload: { pageNo: 1 },
      // });
    },
    changeFilterBillNo(event) { //  编号
      const newValue = event.target.value;
      if (newValue.length > 30) {
        message.error('编码数量不能超过30个！');
        return false;
      }
      dispatch({
        type: 'cannManage/setFilterBillNo',
        payload: {
          filterBillNo: newValue,
        },
      });
      dispatch({
        type: 'cannManage/getList',
        payload: {
          pageNo: 1,
        },
      });
    },
    filterRequisition() {
      dispatch({
        type: 'cannManage/getList', // getRequisitionByFilter
        payload: { pageNo: 1 },
      });
    },
  };

  const requisitionListDate = {
    storeId,
    dataSourceAll,
    listPagination,
    billStatus,
    loading,
    toDetail(record, opType) {
      // console.log('record', record);
      dispatch({
        type: 'cannManage/createBill',
        payload: {
          dataSource: [storeId],
          opType,
          cannId: record.id,
        },
      });
      // dispatch({
      //   type: 'cannMangeDetailsModule/showDetailList',
      //   payload: {
      //     id: record.id,
      //     storeId,
      //   },
      // });
      // dispatch({
      //   type: 'cannMangeDetailsModule/startWithType',
      //   payload: {
      //     opType,
      //   },
      // });
      // dispatch({
      //   type: 'cannMangeDetailsModule/intoModel',
      //   payload: {
      //     storeId,
      //   },
      // });
    },
    deleteItem(id) {
      dispatch({
        type: 'cannManage/deleteRequisitionItem',
        payload: {
          storeId,
          id,
        },
      });
    },
    onPageChange(page) {
      dispatch({
        type: 'cannManage/getList',
        payload: {
          pageNo: page.current,
          pageSize: page.pageSize,
          storeId,
        },
      });
    },
    onPageSizeChange(current, pageSize) {
      dispatch({
        type: 'cannManage/getList',
        payload: {
          pageNo: 1,
          pageSize,
          storeId,
        },
      });
    },
    exportRequisition(id) {
      dispatch({
        type: 'cannManage/exportItem',
        payload: {
          id,
        },
      });
    },
  };

  return (
    <div className="routes">
      <CannManageSearch {...requisitionSearchList} />
      <CannManageList {...requisitionListDate} />
    </div>
  );
};

function mapStateToProps({ cannManage }) {
  return { cannManage };
}
export default connect(mapStateToProps)(CannManage);
