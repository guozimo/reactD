import React, { PropTypes } from 'react';
import { connect } from 'dva';
import ZbStockInSearch from '../../components/Inventory/ZbStockIn/search';
import ZbStockInList from '../../components/Inventory/ZbStockIn/list';

const ZbStockIn = ({ stockInData, dispatch }) => {
  const {
    loading,
    storeId, // 机构id
    depotList, // 全部机构
    pagination, // 首页分页
    dataList,
    baseInfo,
    filters,
    startDate,
    endDate,
    monthDate,
  } = stockInData.zbStockIn;

  const dateFormat = 'YYYY-MM-DD';
  const zbStockInListProps = { // 首页列表
    loading,
    storeId,
    pagination, // 首页分页
    dataList,
    monthDate,
    onPageChange(page) { // 修改分页
      const currPage = page.pageSize === pagination.pageSize ? page.current : 1;
      dispatch({
        type: 'zbStockIn/queryList',
        payload: {
          billNo: filters.billNo,
          billType: filters.billType ? Number(filters.billType) : '',
          busiId: filters.busiId,
          depotId: filters.depotId,
          status: filters.status,
          startDate,
          endDate,
          storeId,
          page: currPage,
          rows: page.pageSize,
        },
      });
    },
    onDetails(id, type) { // 修改分页;
      if (type) { // 编辑
        dispatch({
          type: 'zbStockIn/update',
          payload: {
            id,
          },
        });
      } else { // 查看
        dispatch({
          type: 'zbStockIn/queryfind',
          payload: {
            id,
          },
        });
      }
    },
    onReverse(id) { // 反审核
      dispatch({
        type: 'zbStockIn/reverse',
        payload: {
          id,
          storeId,
        },
      });
    },
    onExport(id) { // 导出
      dispatch({
        type: 'zbStockIn/export',
        payload: {
          id,
          storeId,
        },
      });
    },
    onClose(id) { // 关闭
      dispatch({
        type: 'zbStockIn/queryfind',
        payload: {
          id,
        },
      });
      dispatch({
        type: 'zbStockIn/querySuccess',
        payload: {
          closeUpdate: false,
        },
      });
    },
    onView(id) {
      dispatch({
        type: 'zbStockIn/toItem',
        payload: {
          type: 'view',
          id,
          storeId,
        },
      });
    },
    onEdit(id) {
      dispatch({
        type: 'zbStockIn/toItem',
        payload: {
          type: 'edit',
          id,
          storeId,
        },
      });
    },
    onDelete(id) {
      dispatch({
        type: 'zbStockIn/delete',
        payload: {
          id,
          storeId,
        },
      });
    },
  };
  const zbStockInSearchProps = { // 首页搜索
    storeList: depotList, // 全部机构
    storeId, // 机构id
    baseInfo,
    filters,
    startDate,
    endDate,
    key: storeId,
    changeStore(value) { // 选择机构id
      dispatch({
        type: 'zbStockIn/querySuccess',
        payload: {
          storeId: value,
        },
      });
      dispatch({
        type: 'zbStockIn/queryList',
        payload: {
          storeId: value,
          rows: 10,
          startDate,
          endDate,
        },
      });
      dispatch({
        type: 'zbStockIn/queryWarehouse',
        payload: {
          rows: '1000',
          storeId: value,
        },
      });
    },
    onSearch(searchParam) {
      dispatch({
        type: 'zbStockIn/querySuccess',
        payload: {
          filters: {
            billNo: searchParam.billNo,
            billType: searchParam.billType,
            busiId: searchParam.busiId,
            depotId: searchParam.depotId,
            status: searchParam.status,
          },
          startDate: searchParam.rangeDate[0].format(dateFormat),
          endDate: searchParam.rangeDate[1].format(dateFormat),
        },
      });
      dispatch({
        type: 'zbStockIn/queryList',
        payload: {
          billNo: searchParam.billNo,
          billType: searchParam.billType ? Number(searchParam.billType) : '',
          busiId: searchParam.busiId,
          depotId: searchParam.depotId,
          status: searchParam.status,
          startDate: searchParam.rangeDate[0].format(dateFormat),
          endDate: searchParam.rangeDate[1].format(dateFormat),
          storeId: searchParam.storeId,
          rows: 10,
        },
      });
    },
    onChangeBillType(value) { // 改变单据类型
      dispatch({
        type: 'zbStockIn/querySuccess',
        payload: {
          filters: {
            ...filters, billType: value,
          },
        },
      });
      dispatch({
        type: 'zbStockIn/queryList',
        payload: {
          billNo: filters.billNo,
          billType: Number(value),
          busiId: filters.busiId,
          depotId: filters.depotId,
          status: filters.status,
          startDate,
          endDate,
          storeId,
          rows: 10,
        },
      });
    },
    onChangeDate(dates) { // 改变日期
      dispatch({
        type: 'zbStockIn/querySuccess',
        payload: {
          startDate: dates[0].format(dateFormat),
          endDate: dates[1].format(dateFormat),
        },
      });
      dispatch({
        type: 'zbStockIn/queryList',
        payload: {
          billNo: filters.billNo,
          billType: filters.billType ? Number(filters.billType) : '',
          busiId: filters.busiId,
          depotId: filters.depotId,
          status: filters.status,
          startDate: dates[0].format(dateFormat),
          endDate: dates[1].format(dateFormat),
          storeId,
          rows: 10,
        },
      });
    },
    onChangeDepotId(value) { // 选择仓库
      dispatch({
        type: 'zbStockIn/querySuccess',
        payload: {
          filters: {
            ...filters, depotId: value,
          },
        },
      });
      dispatch({
        type: 'zbStockIn/queryList',
        payload: {
          billNo: filters.billNo,
          billType: filters.billType ? Number(filters.billType) : '',
          busiId: filters.busiId,
          depotId: value,
          status: filters.status,
          startDate,
          endDate,
          storeId,
          rows: 10,
        },
      });
    },
    onChangeBusiId(value) { // 选择供应商
      dispatch({
        type: 'zbStockIn/querySuccess',
        payload: {
          filters: {
            ...filters, busiId: value,
          },
        },
      });
      dispatch({
        type: 'zbStockIn/queryList',
        payload: {
          billNo: filters.billNo,
          billType: filters.billType ? Number(filters.billType) : '',
          busiId: value,
          depotId: filters.depotId,
          status: filters.status,
          startDate,
          endDate,
          storeId,
          rows: 10,
        },
      });
    },
    onStatusChange(event) { // 改变单据状态
      dispatch({
        type: 'zbStockIn/querySuccess',
        payload: {
          filters: {
            ...filters, status: event.target.value,
          },
        },
      });
      dispatch({
        type: 'zbStockIn/queryList',
        payload: {
          billNo: filters.billNo,
          billType: filters.billType ? Number(filters.billType) : '',
          busiId: filters.busiId,
          depotId: filters.depotId,
          status: event.target.value,
          startDate,
          endDate,
          storeId,
          rows: 10,
        },
      });
    },
    onAdd() {
      dispatch({
        type: 'zbStockIn/toItem',
        payload: {
          type: 'add',
          storeId,
        },
      });
    },
  };
  return (
    <div className="routes">
      <ZbStockInSearch {...zbStockInSearchProps} />
      <ZbStockInList {...zbStockInListProps} />
    </div>
  );
};
ZbStockIn.propTypes = {
  dispatch: PropTypes.func,
};
function mapStateToProps(stockInData) {
  return { stockInData };
}

export default connect(mapStateToProps)(ZbStockIn);
