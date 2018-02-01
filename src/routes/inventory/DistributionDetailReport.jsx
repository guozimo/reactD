/* eslint-disable no-dupe-keys,no-undef,consistent-return */
import React from 'react';
import { connect } from 'dva';
import { message } from 'antd';
import moment from 'moment';
import DistributionDetailReportSearch from '../../components/Inventory/DistributionDetailReport/search';
import DistributionDetailReportList from '../../components/Inventory/DistributionDetailReport/list';

const DistributionDetailReport = ({ distributionDetailReport, dispatch }) => {
  const { storeId, storeName, depotList, depotListAll, weatherList, cateId, bussDate, opType, depotId, loading, newData, dataSourceAll, billStatus, goodsName, goodsList, depotName, listPagination } = distributionDetailReport;
  const requisitionSearchList = {
    storeId, // 机构id
    newData,
    storeName,
    weatherList,
    goodsName, // 物资名称
    goodsList, // 物资列表
    depotName,
    depotListAll, // 仓库列表
    depotId, // 调出仓库ID
    bussDate,  // 请购日期
    opType,
    cateId,
    key: storeId,
    storeList: depotList,
     // 选择某个物资后的操作，一方面把选择的goodsName保存起来，另外请求列表数据
    onGoodsIdSave(option) {
      dispatch({
        type: 'distributionDetailReport/updateState',
        payload: {
          goodsName: option,
        },
      });
      dispatch({
        type: 'distributionDetailReport/getList',
        payload: {
          pageNo: 1,
        },
      });
    },
    onGoodsListQuery(keywords) {
      const queryString = keywords || '';
      if (queryString) {
        dispatch({
          type: 'distributionDetailReport/queryGoodsMini',
          payload: {
            queryString,
            storeId,
            rows: 10,
          },
        });
      }
    },
    changeBussDate(dates) { // 修改请购日期
      if (dates.length) {
        dispatch({
          type: 'distributionDetailReport/updateState',
          payload: {
            bussDate: dates,
          },
        });
        // 选择订单时间后自动搜索
        dispatch({
          type: 'distributionDetailReport/getList', // getRequisitionByFilter
          payload: { pageNo: 1 },
        });
      }
    },
    exportRequisition(value) {
      dispatch({
        type: 'distributionDetailReport/exportItem',
        payload: {
          value,
        },
      });
    },
    selectStore(value) { // 选择机构
      if (value) {
        dispatch({
          type: 'distributionDetailReport/updateState',
          payload: {
            storeId: value,
            storeName: '',
            dataSourceAll: [],
          },
        });
        dispatch({
          type: 'distributionDetailReport/findAclStoreForPage',
          payload: {
            distribId: value,
            orgType: 1,
          },
        });
        dispatch({ // 请求仓库
          type: 'distributionDetailReport/queryWarehouse',
          payload: {
            storeId: value,
            rows: 10,
          },
        });
        // 请求门店列表
        dispatch({
          type: 'distributionDetailReport/queryGoodsMini',
          payload: {
            queryString: '',
            storeId: value,
            rows: 10,
          },
        });
        dispatch({
          type: 'distributionDetailReport/getList',
          payload: { pageNo: 1 },
        });
      }
    },
    selectShop(value) { // 选择门店
      dispatch({
        type: 'distributionDetailReport/updateState',
        payload: {
          rows: 10,
          storeName: value,
        },
      });
      dispatch({
        type: 'distributionDetailReport/getList',
        payload: { pageNo: 1 },
      });
    },
    changeDepotId(value) {
      dispatch({
        type: 'distributionDetailReport/querySuccess',
        payload: {
          rows: 10,
          depotName: value,
        },
      });
      dispatch({
        type: 'distributionDetailReport/getList',
        payload: {
          payload: {
            pageNo: 1,
            depotName: value,
          },
        },
      });
    },
    queryAll(value) {
      dispatch({
        type: 'distributionDetailReport/getList',
        payload: {
          value,
          pageNo: 1,
        },
      });
    },
    changeGoodsName(event) {
      const newValue = event.target.value;
      if (newValue.length > 30) {
        message.error('编码数量不能超过30个！');
        return false;
      }
      dispatch({
        type: 'distributionDetailReport/updateState',
        payload: {
          goodsName: newValue,
        },
      });
    },
    changeDepotName(event) {
      const newValue = event.target.value;
      if (newValue.length > 30) {
        message.error('编码数量不能超过30个！');
        return false;
      }
      dispatch({
        type: 'distributionDetailReport/updateState',
        payload: {
          depotName: newValue,
        },
      });
    },

    filterRequisition() {
      dispatch({
        type: 'distributionDetailReport/getList',
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
    storeList: depotList,
    onPageChange(page) {
      dispatch({
        type: 'distributionDetailReport/getList',
        payload: {
          pageNo: page.current,
          pageSize: page.pageSize,
          storeId,
        },
      });
    },
    onPageSizeChange(current, pageSize) {
      dispatch({
        type: 'distributionDetailReport/getList',
        payload: {
          pageNo: 1,
          pageSize,
          storeId,
        },
      });
    },
    timestampToDate(timestamp) {
      const newDate = new Date(timestamp);    // 根据时间戳生成的时间对象
      const date = `${newDate.getFullYear()}-${
      newDate.getMonth() + 1}-${
        newDate.getDate()}`;
      return date;
    },
  };
  return (
    <div className="routes">
      <DistributionDetailReportSearch {...requisitionSearchList} />
      <DistributionDetailReportList {...requisitionListDate} />
    </div>
  );
};

function mapStateToProps({ distributionDetailReport }) {
  return { distributionDetailReport };
}
export default connect(mapStateToProps)(DistributionDetailReport);
