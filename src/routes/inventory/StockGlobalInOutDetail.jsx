import React from 'react';
import { connect } from 'dva';
import { message } from 'antd'
import StockGlobalInOutDetailSearch from '../../components/Inventory/StockGlobalInOutDetail/search';
import StockGlobalInOutDetailList from '../../components/Inventory/StockGlobalInOutDetail/list';

const StockGlobalInOutDetail = ({ stockGlobalInOutDetail, dispatch }) => {
  const {
    storeId,
    depotList,
    depotCannList,
    supplierList,
    typeList,
    searchTree,
    goodsName,
    depotId,
    filterDataRange, // 采购日期'
    supplierName,
    typeName,
    dataSourceAll,
    listPagination,
    billStatus,
    loading
  } = stockGlobalInOutDetail;
  const requisitionSearchList = {
    storeId,
    goodsName,
    depotId,
    depotCannList, // 出入库
    supplierList, // 供应商
    typeList,
    searchTree,
    filterDataRange, // 采购日期'
    supplierName,
    typeName,
    storeList: depotList,
    exportRequisition(id) { // 导出表格
      dispatch({
        type: 'stockGlobalInOutDetail/exportItem',
        payload: {
          id
        } });
    },
    selectStore(value) {
      if (value) {
        dispatch({
          type: 'stockGlobalInOutDetail/queryDepot',
          payload: {
            rows: 10,
            storeId: value
          }
        });
        dispatch({
          type: 'stockGlobalInOutDetail/querySupplier',
          payload: {
            rows: 1000
          }
        });
        dispatch({
          type: 'stockGlobalInOutDetail/queryType',
          payload: {
            t: 910
          }
        });
        dispatch({
          type: 'stockGlobalInOutDetail/findTreeList',
          payload: {
            type: '0'
          }
        });
        dispatch({
          type: 'stockGlobalInOutDetail/querySuccess',
          payload: {
            storeId: value,
            depotId: '',
            inNewDepotId: '',
            searchTree: []
          }
        });
        dispatch({
          type: 'stockGlobalInOutDetail/getList',
          payload: {
            storeId: value,
            pageNo: 1
          }
        });
      }
    },
    changeFilterDataRange(dates) { // 修改采购日期
      // console.warn("data",dates);
      if (dates.length) {
        dispatch({
          type: 'stockGlobalInOutDetail/setFilterDataRange',
          payload: {
            filterDataRange: dates
          }
        });
        // 选择订单时间后自动搜索
        dispatch({
          type: 'stockGlobalInOutDetail/getList', // getRequisitionByFilter
          payload: {
            pageNo: 1
          }
        });
      }
    },
    filterRequisition() {
      dispatch({
        type: 'stockGlobalInOutDetail/getList', // getRequisitionByFilter
        payload: {
          pageNo: 1
        }
      });
    },
    upadateDepotId(value) { // 更新仓库
      dispatch({
        type: 'stockGlobalInOutDetail/querySuccess',
        payload: {
          depotId: value
        }
      });
      dispatch({
        type: 'stockGlobalInOutDetail/getList', // getRequisitionByFilter
        payload: {
          pageNo: 1
        }
      });
    },
    upadateType(value) {
      dispatch({
        type: 'stockGlobalInOutDetail/querySuccess',
        payload: {
          typeName: value
        }
      });
      dispatch({
        type: 'stockGlobalInOutDetail/getList', // getRequisitionByFilter
        payload: {
          pageNo: 1
        }
      });
    },
    upadateSupplier(value) {
      dispatch({
        type: 'stockGlobalInOutDetail/querySuccess',
        payload: {
          supplierName: value
        }
      });
      dispatch({
        type: 'stockGlobalInOutDetail/getList', // getRequisitionByFilter
        payload: {
          pageNo: 1
        }
      });
    },
    changeGoodsName(event) { //  更改物品名称的调用
      const newValue = event.target.value;
      if (newValue.length > 30) {
        message.error('编码数量不能超过30个！');
        return false;
      }
      dispatch({
        type: 'stockGlobalInOutDetail/setFilterBillNo',
        payload: {
          goodsName: newValue
        }
      });
    },
    onTreeChange(value) { // 修改类别
      dispatch({
        type: 'stockGlobalInOutDetail/querySuccess',
        payload: {
          cateId: value
        }
      });
      dispatch({
        type: 'stockGlobalInOutDetail/getList', // getRequisitionByFilter
        payload: {
          pageNo: 1
        }
      });
    }
  };
  const requisitionListDate = {
    storeId,
    dataSourceAll,
    listPagination,
    billStatus,
    loading,
    typeList,
    onPageChange(page) {
      dispatch({
        type: 'stockGlobalInOutDetail/getList',
        payload: {
          pageNo: page.current,
          pageSize: page.pageSize,
          storeId,
        },
      });
    },
    onPageSizeChange(current, pageSize) {
      dispatch({
        type: 'stockGlobalInOutDetail/getList',
        payload: {
          pageNo: 1,
          pageSize,
          storeId,
        },
      });
    },
  }
  return (<div className="routes">
    <StockGlobalInOutDetailSearch {...requisitionSearchList} />
    <StockGlobalInOutDetailList {...requisitionListDate} />
  </div>);
}
function mapStateToProps({ stockGlobalInOutDetail }) {
  return { stockGlobalInOutDetail };
}
export default connect(mapStateToProps)(StockGlobalInOutDetail);
