import React from 'react';
import { connect } from 'dva';
import { message } from 'antd';
import DispatchCheckSearch from '../../components/Inventory/DispatchCheck/search';
import DispatchCheckList from '../../components/Inventory/DispatchCheck/list';

const DispatchCheck = ({ dispatchCheck, dispatch, merchantApp }) => {
  const {
    loading,
    storeId,
    depotList,
    dispatchBillNo,
    dispatchStatus, // 验收状态
    billNo, // 配送单号
    filterDataRange, // 单号创建日期
    dataSourceAll,
    billStatus,
    listPagination,
    selectedRows,
  } = dispatchCheck;
  const { menuData } = merchantApp;
  const dispatchCheckSearchDate = {
    menuData,
    storeId,
    dispatchStatus,
    filterDataRange,
    dispatchBillNo,
    selectedRows,
    billNo,
    storeList: depotList,
    // 修改门店名称
    changeStore(value) {
      dispatch({
        type: 'dispatchCheck/querySuccess',
        payload: {
          storeId: value,
          dispatchBillNo: '',
          billNo: '',
          dispatchStatus: '',
        },
      });
      dispatch({ // 请求表格
        type: 'dispatchCheck/getList',
        payload: {
          storeId: value,
          pageNo: 1,
        },
      });
    },
    // 修改配送出库单号
    changeDispatchBillNo(event) {
      const newValue = event.target.value;
      if (newValue.length > 30) {
        message.error('单号长度不能超过30！');
        return false;
      }
      dispatch({
        type: 'dispatchCheck/setDispatchBillNo',
        payload: {
          dispatchBillNo: newValue,
        },
      });
      // dispatch({ // 修改配送出库单号后立即返回列表
      //   type: 'dispatchCheck/getList',
      //   payload: {},
      // });
    },
    // 改变验收状态
    changeDispatchStatus(event) {
      dispatch({
        type: 'dispatchCheck/setDispatchStatus',
        payload: {
          dispatchStatus: event.target.value,
        },
      });
      dispatch({ // 选择验收状态后立即返回列表
        type: 'dispatchCheck/getList',
        payload: { pageNo: 1 },
      });
    },
    // 修改配送单号
    changeBillNo(event) {
      const newValue1 = event.target.value;
      if (newValue1.length > 30) {
        message.error('单号长度不能超过30！');
        return false;
      }
      dispatch({
        type: 'dispatchCheck/setBillNo',
        payload: {
          billNo: newValue1,
        },
      });
      // dispatch({ // 修改配送单号后立即返回列表
      //   type: 'dispatchCheck/getList',
      //   payload: {},
      // });
    },
    // 修改单号创建日期
    changeFilterDataRange(dates) {
      dispatch({
        type: 'dispatchCheck/setFilterDataRange',
        payload: {
          filterDataRange: dates,
        },
      });
      dispatch({ // 选择时间范围后立即返回列表
        type: 'dispatchCheck/getList',
        payload: { pageNo: 1 },
      });
    },
    // 点击搜索
    filterDispatchCheck() {
      dispatch({
        type: 'dispatchCheck/getList',
        payload: { pageNo: 1 },
      });
    },
  };

  const dispatchCheckListDate = {
    menuData,
    storeId,
    dataSourceAll, // 数据数组
    listPagination, // 分页器
    billStatus,
    loading,
    selectedRows,
    // 查看、验收
    toDetail(record, opType) {
      dispatch({
        type: 'dispatchCheck/createBill',
        payload: {
          id: record.id,
          opType,
          storeId: record.storeId,
        },
      });
    },
    // 页码改变的回调，参数是改变后的页码及每页条数
    onPageChange(page) {
      dispatch({
        type: 'dispatchCheck/getList',
        payload: {
          pageNo: page.current,
          pageSize: page.pageSize,
          storeId,
        },
      });
    },
    // pageSize 变化的回调
    onPageSizeChange(current, pageSize) {
      dispatch({
        type: 'dispatchCheck/getList',
        payload: {
          pageNo: 1,
          pageSize,
          storeId,
        },
      });
    },
  };

  return (
    <div className="routes">
      <DispatchCheckSearch {...dispatchCheckSearchDate} />
      <DispatchCheckList {...dispatchCheckListDate} />
    </div>
  );
};

function mapStateToProps({ dispatchCheck, merchantApp }) {
  return { dispatchCheck, merchantApp };
}
export default connect(mapStateToProps)(DispatchCheck);
