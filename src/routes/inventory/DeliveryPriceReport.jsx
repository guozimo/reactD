import React, { PropTypes } from 'react';
import { connect } from 'dva';
import { message } from 'antd';
import DeliveryPriceReportSearch from '../../components/Inventory/DeliveryPriceReport/search';
import DeliveryPriceReportList from '../../components/Inventory/DeliveryPriceReport/list';
import { deleteCodes } from '../../utils';

const DeliveryPriceReport = ({ deliveryPriceData, dispatch }) => {
  const {
    loading,
    orgInfoId, // 机构id
    orgList, // 全部机构
    pagination, // 首页分页
    dataList,
    baseInfo,
    chooseBills,
    chooseBillsList,
    filters,
    startDate,
    endDate,
    monthDate,
  } = deliveryPriceData.deliveryPriceReport;
  const dateFormat = 'YYYY-MM-DD';
  const deliveryPriceReportListProps = { // 首页列表
    loading,
    orgInfoId,
    pagination, // 首页分页
    dataList,
    chooseBills,
    monthDate,
    onPageChange(page) { // 修改分页
      const currPage = page.pageSize === pagination.pageSize ? page.current : 1;
      dispatch({
        type: 'deliveryPriceReport/queryList',
        payload: {
          orgInfoId,
          storeId: filters.storeId,
          status: filters.status,
          goodsId: filters.goodsId,
          billNo: filters.billNo,
          startDate,
          endDate,
          page: currPage,
          rows: page.pageSize,
        },
      });
    },
    // 选择单据
    onSelectBills(data) {
      let codeArray = [];
      const cacheBills = chooseBillsList;
      data.selectedBills.map((item) => {
        cacheBills.push({
          id: item.id,
          billNo: item.billNo,
        });
        return null;
      });
      if (chooseBills) {
        codeArray = [...chooseBills, ...data.selectedCodes];
      } else {
        codeArray = data.selectedCodes;
      }
      dispatch({
        type: 'deliveryPriceReport/updateState',
        payload: {
          chooseBills: codeArray,
          chooseBillsList: cacheBills,
        },
      });
    },
    // 删除单据
    onDeleteBills(codes) {
      const cacheBills = [];
      chooseBillsList.map((item) => {
        if (codes.split(',').indexOf(item.id) < 0) { // 如果该元素的code不在删除的code数组里，则新数组里有该项
          cacheBills.push(item); // item加入cacheBills数组
        }
        return null;
      });
      dispatch({
        type: 'deliveryPriceReport/updateState',
        payload: {
          chooseBills: deleteCodes(chooseBills, codes),
          chooseBillsList: cacheBills,
        },
      });
    },
    onCancelBill(record) {
      dispatch({
        type: 'deliveryPriceReport/cancel',
        payload: {
          chooseBillsList: [{
            id: record.id,
            billNo: record.billNo,
          }],
        },
      });
    },
  };
  const deliveryPriceReportSearchProps = { // 首页搜索
    orgList, // 全部机构
    orgInfoId, // 机构id
    baseInfo,
    filters,
    startDate,
    endDate,
    chooseBills,
    key: orgInfoId,
    // 修改单号
    changeBillNo(event) {
      const newValue = event.target.value;
      if (newValue.length > 30) {
        message.error('单号长度不能超过30！');
        return false;
      }
      dispatch({
        type: 'deliveryPriceReport/updateState',
        payload: {
          filters: {
            billNo: newValue,
          },
        },
      });
    },
    onChangeOrg(value) { // 选择机构id
      dispatch({ // 存入机构id，顺便把搜索条件清空
        type: 'deliveryPriceReport/updateState',
        payload: {
          orgInfoId: value,
          filters: {
            storeId: null,
            goodsId: null,
            billNo: null,
            status: '',
          },
          chooseBills: [],
          chooseBillsList: [],
          dataList: [],
        },
      });
      dispatch({ // 查询机构下的门店
        type: 'deliveryPriceReport/queryOrg',
        payload: {
          distribId: value,
          orgType: 1,
        },
      });
      dispatch({
        type: 'deliveryPriceReport/queryGoodsMini',
        payload: {
          queryString: '',
          storeId: value,
          rows: 10,
        },
      });
      dispatch({
        type: 'deliveryPriceReport/queryList',
        payload: {
          orgInfoId: value,
          storeId: null,
          status: null,
          goodsId: null,
          billNo: null,
          startDate,
          endDate,
          rows: 10,
          page: 1,
        },
      });
    },
    filterOrderLib() {
      dispatch({
        type: 'deliveryPriceReport/queryList', // getOrderLibByFilter
        payload: { page: 1 },
      });
    },
    onChangeShop(value) { // 选择门店id
      dispatch({
        type: 'deliveryPriceReport/updateState',
        payload: {
          filters: {
            ...filters, storeId: value,
          },
        },
      });
      dispatch({
        type: 'deliveryPriceReport/queryList',
        payload: {
          orgInfoId,
          storeId: value,
          status: filters.status,
          goodsId: filters.goodsId,
          billNo: filters.billNo,
          startDate,
          endDate,
          rows: 10,
          page: 1,
        },
      });
    },
    onGoodsListQuery(keywords) {
      const queryString = keywords || '';
      // console.log("我是搜索",keywords);
      if (queryString) {
        dispatch({
          type: 'deliveryPriceReport/queryGoodsMini',
          payload: {
            queryString,
            storeId: orgInfoId,
            rows: 10,
          },
        });
        dispatch({
          type: 'deliveryPriceReport/updateState',
          payload: {
            goodsKeywords: queryString,
          },
        });
      } else {
        dispatch({
          type: 'deliveryPriceReport/updateState',
          payload: {
            goodsList: [],
            goodsKeywords: null,
          },
        });
      }
    },
    onGoodsIdSave(option) { // 选择某个物资后的操作，一方面把选择的goodsId保存起来，另外请求列表数据
      // console.log("我是保存",option);
      dispatch({
        type: 'deliveryPriceReport/updateState',
        payload: {
          filters: {
            ...filters, goodsId: option,
          },
        },
      });
      dispatch({
        type: 'deliveryPriceReport/queryList',
        payload: {
          orgInfoId,
          storeId: filters.storeId,
          status: filters.status,
          goodsId: option,
          billNo: filters.billNo,
          startDate,
          endDate,
          rows: 10,
          page: 1,
        },
      });
    },
    onSearch(searchParam) {
      dispatch({
        type: 'deliveryPriceReport/updateState',
        payload: {
          filters: {
            ...filters,
            storeId: searchParam.storeId !== '请选择门店名称' ? searchParam.storeId : null,
            billNo: searchParam.billNo,
            status: searchParam.status,
          },
          startDate: searchParam.rangeDate[0].format(dateFormat),
          endDate: searchParam.rangeDate[1].format(dateFormat),
        },
      });
      dispatch({
        type: 'deliveryPriceReport/queryList',
        payload: {
          orgInfoId: searchParam.orgInfoId,
          storeId: searchParam.storeId !== '请选择门店名称' ? searchParam.storeId : null,
          status: searchParam.status,
          goodsId: filters.goodsId,
          billNo: searchParam.billNo,
          startDate: searchParam.rangeDate[0].format(dateFormat),
          endDate: searchParam.rangeDate[1].format(dateFormat),
          rows: 10,
          page: 1,
        },
      });
    },
    onStatusChange(event) { // 改变单据状态
      dispatch({
        type: 'deliveryPriceReport/updateState',
        payload: {
          filters: {
            ...filters, status: event.target.value,
          },
        },
      });
      dispatch({
        type: 'deliveryPriceReport/queryList',
        payload: {
          orgInfoId,
          storeId: filters.storeId,
          status: event.target.value,
          goodsId: filters.goodsId,
          billNo: filters.billNo,
          startDate,
          endDate,
          rows: 10,
          page: 1,
        },
      });
    },
    onChangeDate(dates) { // 改变日期
      dispatch({
        type: 'deliveryPriceReport/updateState',
        payload: {
          startDate: dates[0].format(dateFormat),
          endDate: dates[1].format(dateFormat),
        },
      });
      dispatch({
        type: 'deliveryPriceReport/queryList',
        payload: {
          orgInfoId,
          storeId: filters.storeId,
          status: filters.status,
          goodsId: filters.goodsId,
          billNo: filters.billNo,
          startDate: dates[0].format(dateFormat),
          endDate: dates[1].format(dateFormat),
          rows: 10,
          page: 1,
        },
      });
    },
    onCancel() {
      dispatch({
        type: 'deliveryPriceReport/cancel',
        payload: {
          type: 'cancelBills',
          chooseBillsList,
        },
      });
    },
  };
  return (
    <div className="routes">
      <DeliveryPriceReportSearch {...deliveryPriceReportSearchProps} />
      <DeliveryPriceReportList {...deliveryPriceReportListProps} />
    </div>
  );
};
DeliveryPriceReport.propTypes = {
  dispatch: PropTypes.func,
};
function mapStateToProps(deliveryPriceData) {
  return { deliveryPriceData };
}

export default connect(mapStateToProps)(DeliveryPriceReport);
