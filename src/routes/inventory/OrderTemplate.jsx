import React from 'react';
import { connect } from 'dva';
import OrderTemplateSearch from '../../components/Inventory/OrderTemplate/search';
import OrderTemplateList from '../../components/Inventory/OrderTemplate/list';

const OrderTemplate = ({ orderTemplateModule, dispatch }) => {
  const { id, storeId, dataSourceAll, loading, listPagination, templateNo, selectedRows } = orderTemplateModule;
  const orderTemplateSearchList = {
    id,
    storeId,
    loading,
    dataSourceAll,
    listPagination,
    templateNo,
    selectedRows,
    changeTemplateNo(event) {
      dispatch({
        type: 'orderTemplateModule/setTemplateNo',
        payload: {
          templateNo: event.target.value,
        },
      });
    },
    filterTemplates() {
      dispatch({
        type: 'orderTemplateModule/getTemplates', // getTemplatesByFilter
        payload: { pageNo: 1 },
      });
    },
    // importTemplates() {
    //   dispatch({
    //     type: 'orderTemplateModule/importTemplates', // import templates
    //     payload: { pageNo: 1 },
    //   });
    // },
    disabledOrNot(status) {
      dispatch({
        type: 'orderTemplateModule/disabledOrNot', // import templates
        payload: {
          storeId,
          status,
        },
      });
    },
    onAdd(value) {
      dispatch({
        type: 'orderTemplateModule/toItem',
        payload: {
          dataSource: [value],
        },
      });
      dispatch({
        type: 'orderTempDetailsModule/startWithType', // д�ڴ˴���д������intoModel��ԭ������ΪҪ������ʼ������ݡ�
        payload: {
          opType: 'create',
        },
      });
    },
  };

  const orderTemplateListData = {
    storeId,
    loading,
    dataSourceAll,
    listPagination,
    selectedRows,
    onPageChange(page) {
      dispatch({
        type: 'orderTemplateModule/getTemplates',
        payload: {
          pageNo: page.current,
          pageSize: page.pageSize,
          storeId,
        },
      });
    },
    onPageSizeChange(current, pageSize) {
      dispatch({
        type: 'orderTemplateModule/getTemplates',
        payload: {
          pageNo: 1,
          pageSize,
          storeId,
        },
      });
    },
    latestSelectedRows(selectedRows) {
      dispatch({
        type: 'orderTemplateModule/setSelectedRows',
        payload: {
          selectedRows,
        },
      });
    },
  };

  return (
    <div className="routes">
      <OrderTemplateSearch {...orderTemplateSearchList} />
      <OrderTemplateList {...orderTemplateListData} />
    </div>
  );
};

function mapStateToProps({ orderTemplateModule }) {
  return { orderTemplateModule };
}
export default connect(mapStateToProps)(OrderTemplate);
