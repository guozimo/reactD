import React from 'react';
import { connect } from 'dva';
import { message } from 'antd'
import StockGlobalReportSearch from '../../components/Inventory/StockGlobalReport/search';
import StockGlobalReportList from '../../components/Inventory/StockGlobalReport/list';

const StockGlobalReport = ({ stockGlobalReport, dispatch, merchantApp }) => {
  const { storeId, depotList, cateId, depotCannList, opType, depotId, inNewDepotId, searchTree, loading, newData, dataSourceAll, billStatus, filterOpterName, goodsName, listPagination } = stockGlobalReport;
  // const { storeId, loading, depotList, supplierList, typeList, warehouseList, newData, dataSourceAll, pagination,
  // dataSource, count, editableMem, selectData } = stockGlobalReport;
  // console.log('storeId:',storeId);
  const { menuData } = merchantApp;
  const requisitionSearchList = {
    menuData,
    storeId,
    newData,
    filterOpterName,
    depotCannList, // 出入库
    goodsName, // 物资名称
    depotId, // 调出仓库ID
    inNewDepotId, // 调入仓库ID
    searchTree, // 类别
    opType,
    cateId,
    key: storeId,
    storeList: depotList,
    upadateDepotId(value) { // 出库
      // _.remove(dataList, item => {
      //     item.id === value
      // })
      dispatch({
        type: 'stockGlobalReport/querySuccess',
        payload: {
          depotId: value,
        },
      });
      dispatch({
        type: 'stockGlobalReport/getList',
        payload: {
          pageNo: 1,
        },
      });
    },
    upadateInDepot(value) { // 入库
      dispatch({
        type: 'stockGlobalReport/querySuccess',
        payload: {
          inNewDepotId: value,
        },
      });
    },
    onTreeChange(value) { // 修改类别
      dispatch({
        type: 'stockGlobalReport/querySuccess',
        payload: {
          cateId: value,
        },
      });
      dispatch({
        type: 'stockGlobalReport/getList',
        payload: {
          pageNo: 1,
        },
      });
    },
    exportRequisition(id) {
      dispatch({
        type: 'stockGlobalReport/exportItem',
        payload: {
          storeId,
        },
      });
    },
    selectStore(value) {
      if (value) {
        dispatch({
          type: 'stockGlobalReport/queryDepot',
          payload: {
            rows: 10,
            storeId: value,
          },
        });
        dispatch({
          type: 'stockGlobalReport/findTreeList',
          payload: {
            type: '0',
          },
        });
      }
      dispatch({
        type: 'stockGlobalReport/querySuccess',
        payload: {
          storeId: value,
          depotId: '',
          inNewDepotId: '',
          searchTree: [],
        },
      });
      dispatch({
        type: 'stockGlobalReport/getList',
        payload: {
          storeId: value,
          pageNo: 1,
        },
      });
    },
    queryAll(value) {
      dispatch({
        type: 'stockGlobalReport/getList',
        payload: {
          value,
          pageNo: 1,
        },
      });
    },
    changeFilterOpterName(event) {
      dispatch({
        type: 'stockGlobalReport/setFilterOpterName',
        payload: {
          filterOpterName: event.target.value,
        },
      });
      // // 修改创建人后自动搜索
      // dispatch({
      //   type: 'stockGlobalReport/getList', // getRequisitionByFilter
      //   payload: { pageNo: 1 },
      // });
    },
    changeGoodsName(event) { //  编号
      const newValue = event.target.value;
      if (newValue.length > 30) {
        message.error('编码数量不能超过30个！');
        return false;
      }
      dispatch({
        type: 'stockGlobalReport/setFilterBillNo',
        payload: {
          goodsName: newValue,
        },
      });
    },
    filterRequisition() {
      dispatch({
        type: 'stockGlobalReport/getList', // getRequisitionByFilter
        payload: { pageNo: 1 },
      });
    },
  };

  const requisitionListDate = {
    menuData,
    storeId,
    dataSourceAll,
    listPagination,
    billStatus,
    loading,
    onPageChange(page) {
      dispatch({
        type: 'stockGlobalReport/getList',
        payload: {
          pageNo: page.current,
          pageSize: page.pageSize,
          storeId,
        },
      });
    },
    onPageSizeChange(current, pageSize) {
      dispatch({
        type: 'stockGlobalReport/getList',
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
      <StockGlobalReportSearch {...requisitionSearchList} />
      <StockGlobalReportList {...requisitionListDate} />
    </div>
  );
};

function mapStateToProps({ stockGlobalReport, merchantApp }) {
  return { stockGlobalReport, merchantApp };
}
export default connect(mapStateToProps)(StockGlobalReport);
