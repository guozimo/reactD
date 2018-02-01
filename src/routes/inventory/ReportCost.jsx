import React, { PropTypes } from 'react'
import { connect } from 'dva';
import ReportCostList from '../../components/Inventory/ReportCost/list'
import ReportCostSearch from '../../components/Inventory/ReportCost/search'

function ReportCost({location, dispatch, reportCost}) {
  const {
    loading, list,pagination,
    startDateValue,endDateValue,endDateOpen,depotList,storeId,serverTime,
  } = reportCost.reportCost
  const { menuData } = reportCost.merchantApp;

  const { queryString } = location.query

  const reportCostListProps = {
    menuData,
    dataSource: list,
    loading,
    pagination:pagination,
    shopId: storeId,
    onPageChange(page) {
      dispatch({
        type: 'reportCost/query',
        payload: {
          page: page.current,
          rows:page.pageSize,
          storeId,
        },
      })
    },
    onPageSizeChange(current, pageSize){
      dispatch({
        type: 'reportCost/query',
        payload: {
          page: 1,
          rows:pageSize,
          storeId,
        },
      })
    },
  }

  const reportCostSearchProps = {
    menuData,
    queryString,
    startDateValue: startDateValue,
    endDateValue: endDateValue,
    endDateOpen: endDateOpen,
    storeList: depotList,
    shopId: storeId,
    serverTime,
    onSearch(fieldsValue) {
      dispatch({
        type: 'reportCost/query',
        payload: fieldsValue,
      })
    },
    onDataChange(data) {
      dispatch({
        type: 'reportCost/querySuccess',
        payload:data,
      });
    },
    selectStore(value) {
      dispatch({
        type: 'reportCost/querySuccess',
        payload:{
          storeId: value,
        },
      });
      dispatch({
        type: 'reportCost/query',
        payload: {
          rows: 10,
          storeId: value,
          startDate: startDateValue,
          endDate: endDateValue,
        },
      })
    },
  }



  return (
    <div className="routes">
      <ReportCostSearch {...reportCostSearchProps} />
      <ReportCostList {...reportCostListProps} />
    </div>
  );
}

ReportCost.propTypes = {
  reportCost: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}

function mapStateToProps(reportCost) {
  return {reportCost};
}

export default connect(mapStateToProps)(ReportCost);
