import React from 'react';
import { connect } from 'dva';
import { message } from 'antd'
import StockOutDistributionSearch from '../../components/Inventory/StockOutDistribution/search';
import StockOutDistributionList from '../../components/Inventory/StockOutDistribution/list';

const StockOutDistribution = ({ stockOutDistribution, dispatch }) => {
  const {
      testId,
      storeId,
      storeList, // 仓库列表
      searchList,
      // list
      pagination,
      dataQuerySupplyList,
      typeList,
      loading,

  } = stockOutDistribution;

  const OutDistribution = {
    testId,
    storeId,
    storeList,
    searchList,
    changeStore(value){
      if (value) {
        // 初始化搜索栏
        dispatch({
          type: 'stockOutDistribution/querySuccess',
          payload: {
            storeId: value,
            dataQuerySupplyList: [],
          }
        });
        dispatch({
          type: 'stockOutDistribution/querySelectArea',
          // 仓库请求
          depotPayload: {
            rows: 10,
            storeId: value
          },
          // 收货机构请求
          storeNamePayload: {
          //  rows: 10,
            orgType: 1,
            distribId: value,
          }
        });
        dispatch({
          type: 'stockOutDistribution/queryList', // getRequisitionByFilter
          payload: {
            storeId: '',
          }
        });
        // // 搜索收货机构
        // dispatch({
        //   type: 'stockOutDistribution/queryStore',
        //   payload: { rows: 10, orgType: 1, storeId },
        // });
      }
    },
    searchAgency(value) {
      // 搜索收货机构
      dispatch({
        type: 'stockOutDistribution/queryStore',
        payload: {
           orgType: 1,
           distribId: storeId,
           queryString: value },
      });
      console.log(storeId);
    },
    upadateId(value, type) { // 更新仓库
      // console.log("当前要更新的数据：",value);
      dispatch({
        type: 'stockOutDistribution/queryUpdate',
        updateType: type,   // 更新模式
        payload: value,    // 更新值
      });
      if (type !== 'distributionOrderId') {
        dispatch({
          type: 'stockOutDistribution/queryList', // getRequisitionByFilter
          payload: {},
        });
      }
    },
    filterRequisition() {
      dispatch({
        type: 'stockOutDistribution/queryList', // getRequisitionByFilter
        payload: {}
      });
    },
  }

  const distributionListProps = {
    storeList,
    loading,
    distribId: storeId,
    pagination, // 首页分页
    dataQuerySupplyList,
    typeList,
    searchList,
    exportItem(data){
      dispatch({
        type: 'stockOutDistribution/queryExport',
        payload: {
          id: data,
          distribId: storeId,
        },
      })
    },
    onPageChange(page) { // 修改分页
      //  console.log(page);
      dispatch({
        type: 'stockOutDistribution/queryList',
        payload: {
          page: page.current,
          rows: page.pageSize,
        },
      });
    },
    /**
     *
     *      跳转 【判断】
     *
     */
    onDetails(id, type, status) { // 判断编辑还是查看
      // console.log("--------------------id",id,"type",type);
      if (type) { // 编辑
        dispatch({
          type: 'stockOutDistribution/addNewList',
          payload: {
            id,
            storeId,
            status,
          },
        });
      } else { // 查看
        dispatch({
          type: 'stockOutDistribution/queryfind',
          payload: {
            id,
            storeId,
            status,
          },
        });
      }
    },
    onClose(id) { // 关闭订单
      dispatch({
        type: 'supplyOrder/queryfind',
        payload: {
          id,
          storeId,
        },
      });
      dispatch({
        type: 'supplyOrder/querySuccess',
        payload: {
          closeUpdate: true,
        },
      });
    },
    onPageSizeChange(current, pageSize) { // 修改页条数
      // console.log(pageSize);
      dispatch({
        type: 'stockOutDistribution/queryList',
        payload: {
          page: 1,
          rows: pageSize,
        },
      });
    },
  }
  return (
    <div className="routes">
      <StockOutDistributionSearch {...OutDistribution} />
      <StockOutDistributionList {...distributionListProps} />
    </div>

  );
}
function mapStateToProps({ stockOutDistribution }) {
  return { stockOutDistribution };
}
export default connect(mapStateToProps)(StockOutDistribution);
