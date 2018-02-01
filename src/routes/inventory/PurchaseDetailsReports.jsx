import React from 'react';
import { connect } from 'dva';
import { message } from 'antd';
import moment from 'moment';
import PurchaseDetailsReportsSearch from '../../components/Inventory/PurchaseDetailsReports/search';
import PurchaseDetailsReportsList from '../../components/Inventory/PurchaseDetailsReports/list';

const PurchaseDetailsReports = ({ purchaseDetailsReports, dispatch }) => {
  const { originId, originList, weatherList, loading, dataSourceAll, busiName, goodsName, goodsList, storeName, filterDataRange, listPagination, startDate, endDate, supplierList } = purchaseDetailsReports;
  const requisitionSearchList = {
    originId,           // 机构Id
    storeName,          // 门店名称
    goodsName,          // 物资名称
    goodsList, // 物资列表
    busiName,           // 供应商名称
    filterDataRange,    // 时间
    originList,         // 机构名称
    weatherList,        // 门店名称
    startDate,          // 开始时间
    endDate,            // 结束时间
    supplierList,
    // 选择某个物资后的操作，一方面把选择的goodsName保存起来，另外请求列表数据
    onGoodsIdSave(option) {
      dispatch({
        type: 'purchaseDetailsReports/updateState',
        payload: {
          goodsName: option,
        },
      });
      dispatch({
        type: 'purchaseDetailsReports/getList',
        payload: {
          pageNo: 1,
        },
      });
    },
    onGoodsListQuery(keywords) {
      const queryString = keywords || '';
      if (queryString) {
        dispatch({
          type: 'purchaseDetailsReports/queryGoodsMini',
          payload: {
            queryString,
            // originId,
            rows: 10,
          },
        });
      }
    },
    // 导出表格
    exportRequisition(id) {
      dispatch({
        type: 'purchaseDetailsReports/exportItem',
        payload: {
          originId,
          startDate,
          endDate,
        },
      });
    },
    // 获取机构ID
    changeOrigin(value) {
      if (value) {
        dispatch({
          type: 'purchaseDetailsReports/queryDepot',
          payload: {
            distribId: value,
            orgType: 1,
          },
        });
      }
      dispatch({
        type: 'purchaseDetailsReports/updateState',
        payload: {
          originId: value,
          storeName: '',
          dataSourceAll: [],
        },
      });
      dispatch({
        type: 'purchaseDetailsReports/querySupplier',
        payload: {
          rows: 1000,
        },
      });
      // 请求物资列表
      dispatch({
        type: 'purchaseDetailsReports/queryGoodsMini',
        payload: {
          queryString: '',
          // originId: value,
          rows: 10,
        },
      });
      dispatch({
        type: 'purchaseDetailsReports/getList',
        payload: {
          originId: value,
          pageNo: 1,
          pageSize: 10,
        },
      });
    },
    // 获取门店名称
    updateStoreName(value) {
        dispatch({
          type: 'purchaseDetailsReports/updateState',
          payload: {
            rows: 10,
            storeName: value,
          },
        });
      dispatch({
        type: 'purchaseDetailsReports/getList',
        payload: {
          pageNo: 1,
          pageSize: 10,
        },
      });
    },
    // 获取物资名称
    changeGoodsName(event) { //  编号
      const newValue = event.target.value;
      if (newValue.length > 30) {
        message.error('编码数量不能超过30个！');
        return false;
      }
      dispatch({
        type: 'purchaseDetailsReports/updateState',
        payload: {
          goodsName: newValue,
        },
      });
    },
    // 获取供应商名称
    changeBusiName(value) { // 供应商
        dispatch({
          type: 'purchaseDetailsReports/updateState',
          payload: {
            busiName: value,
          },
        });
      dispatch({
        type: 'purchaseDetailsReports/getList',
        payload: {
          pageNo: 1,
          pageSize: 10,
          busiName: value,
        },
      });
    },
    // 改变时间
    changeFilterDataRange(value) {
      dispatch({
        type: 'purchaseDetailsReports/updateState',
        payload: {
          filterDataRange: value,
        },
      });
      dispatch({
        type: 'purchaseDetailsReports/getList',
        payload: {
          pageNo: 1,
          pageSize: 10,
        },
      });
    },
    // 搜索
    filterRequisition() {
      dispatch({
        type: 'purchaseDetailsReports/getList', // getRequisitionByFilter
        payload: { pageNo: 1 },
      });
    },
  };

  const requisitionListDate = {
    originId,
    dataSourceAll,
    listPagination,
    loading,
    originList,
    // 页码改变
    onPageChange(page) {
      dispatch({
        type: 'purchaseDetailsReports/getList',
        payload: {
          pageNo: page.current,
          pageSize: page.pageSize,
          originId,
        },
      });
    },
    // 分页格式改变
    onPageSizeChange(current, pageSize) {
      dispatch({
        type: 'purchaseDetailsReports/getList',
        payload: {
          pageNo: 1,
          pageSize,
        },
      });
    },
    // 时间戳转换成时间格式
    timestampToDate(timestamp) {
      const newDate = new Date(timestamp);    // 根据时间戳生成的时间对象
      const date = `${newDate.getFullYear()}-${
        newDate.getMonth() + 1}-${
        newDate.getDate()}`;
      return date;
    },
    // 总计
    // getAccount(data) {
    //   const account = [];
    //   account[0] = 0;
    //   account[1] = 0;
    //   data.map((item) => {
    //     account[0] += item.ordUnitNum;
    //     account[1] += (Math.round(parseFloat(item.ordUnitNum * item.ordPrice) * 10000) / 10000 : 0);
    //   });
    //   account[0] = account[0].toFixed(4);
    //   account[1] = account[1].toFixed(4);
    //   return account;
    // },
  };

  return (
    <div className="routes">
      <PurchaseDetailsReportsSearch {...requisitionSearchList} />
      <PurchaseDetailsReportsList {...requisitionListDate} />
    </div>
  );
};

function mapStateToProps({ purchaseDetailsReports }) {
  return { purchaseDetailsReports };
}
export default connect(mapStateToProps)(PurchaseDetailsReports);
