import React, { PropTypes } from 'react';
import { connect } from 'dva';
import PurchaseList from '../../components/Inventory/Purchase/list.jsx';
import PurchaseSearch from '../../components/Inventory/Purchase/search';

const Purchase = ({ purchase, dispatch }) => {
  const { storeId, loading, depotList, searchAll, status, filterDataRange, supplierList, typeList, warehouseList, newData, dataSourceAll, pagination, dataSource, count, editableMem, selectData } = purchase;
  const purchaseSearchList = {
    loading,
    storeId,
    storeList: depotList,
    supplierList,
    typeList,
    newData,
    warehouseList,
    searchAll,
    status,
    filterDataRange,
    selectStore(value) {
      dispatch({
        type: 'purchase/query',
        payload: {
          storeId: value,
        },
      });
      dispatch({
        type: 'purchase/queryWarehouse',
        payload: {
          status: 1,
          rows: '1000',
          queryString: '',
          storeId: value,
          limit: '1000',
        },
      });
      dispatch({
        type: 'purchase/queryType',
        payload: {
          t: 910,
        },
      });
      dispatch({
        type: 'purchase/querySupplier',
        payload: {
          status: 1,
          rows: '1000',
        },
      });
      dispatch({
        type: 'purchase/querySuccess',
        payload: {
          storeId: value,
        },
      });
    },
    onAdd(value) {
      dispatch({
        type: 'purchase/addNewList',
        payload: {
          dataSource:[newData],
        }
      })
    },
    changeFilterDataRange(value) {
      dispatch({
        type: 'purchase/querySuccess',
        payload: {
          filterDataRange: value,
        }
      })
    },
    changeFilterStatus(value) {
      dispatch({
        type: 'purchase/querySuccess',
        payload: {
          status: value.target.value,
        }
      });
      dispatch({
        type: 'purchase/query',
        payload: {
          status: value.target.value,
          ...searchAll,
        }
      });
    },
    queryAll(value) {
      dispatch({
        type: 'purchase/query',
        payload: {
          ...value,
          status,
        }
      })
      dispatch({
        type: 'purchase/querySuccess',
        payload: {
          searchAll: value,
        },
      })
    }
  };
  const purchaseListDate = {
    loading,
    storeId,
    dataSourceAll,
    pagination,
    onPageChange(page) {
      dispatch({
        type: 'purchase/query',
        payload: {
          page: page.current,
          rows:page.pageSize,
          storeId,
        },
      })
    },
    onPageSizeChange(current, pageSize){
      dispatch({
        type: 'purchase/query',
        payload: {
          page: 1,
          rows:pageSize,
          storeId,
        },
      })
    },
    updateItem(data){
      dispatch({
        type: 'purchase/queryfind',
        payload: {
          id:data.id,
          storeId
        },
      })
    },
    exportItem(data){
      dispatch({
        type: 'purchase/queryExport',
        payload: {
          id:data.id,
          storeId
        },
      })
    },
  }

  return (
    <div className="routes">
    <PurchaseSearch {...purchaseSearchList} />
    <PurchaseList {...purchaseListDate} />
    </div>
  );
};

Purchase.propTypes = {
  purchase: PropTypes.object,
  dispatch: PropTypes.func,
};
function mapStateToProps({ purchase }) {
  return { purchase };
}
export default connect(mapStateToProps)(Purchase);
