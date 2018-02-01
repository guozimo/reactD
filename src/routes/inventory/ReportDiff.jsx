import React, { PropTypes } from 'react'
import { connect } from 'dva';
import ReportDiffList from '../../components/Inventory/ReportDiff/list'
import ReportDiffSearch from '../../components/Inventory/ReportDiff/search'

function ReportDiff({location, dispatch, reportDiff}) {
  const {
    loading, list, pagination,
    startDateValue,endDateValue,endDateOpen,depotList, storeId,serverTime,
  } = reportDiff.reportDiff
  const { menuData } = reportDiff.merchantApp;

  const { queryString } = location.query

  const reportDiffListProps = {
    menuData,
    dataSource: list,
    loading,
    pagination,
    shopId: storeId,
    onPageChange(page) {
      if (typeof page == 'object' && page.current && page.pageSize) {
      // console.log("page.current page.pageSize",page.current, page.pageSize)
        page=page.current;
      }
      dispatch({
        type: 'reportDiff/query',
        payload: {
          page: page,
          rows:pagination.size||page.pageSize||10,
          storeId,
          startDate: startDateValue,
          endDate: endDateValue,
        },
      })
    },
    onPageSizeChange(current, pageSize){
      dispatch({
        type: 'reportDiff/query',
        payload: {
          page: 1,
          rows:pageSize,
          storeId,
          startDate: startDateValue,
          endDate: endDateValue,
        },
      })
    },
  }

  const reportDiffSearchProps = {
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
        type: 'reportDiff/query',
        payload: { ...fieldsValue, rows: pagination.size },
      });
      dispatch({
        type: 'reportDiff/querySuccess',
        payload: {
          startDateValue: fieldsValue.startDate,
          endDateValue: fieldsValue.endDate,
        },
      });
    },
    onDataChange(data) {
      dispatch({
        type: 'reportDiff/querySuccess',
        payload:data,
      });
    },
    selectStore(value) {
      dispatch({
        type: 'reportDiff/querySuccess',
        payload:{
          storeId: value,
        },
      });
      dispatch({
        type: 'reportDiff/query',
        payload: {
          rows: 10,
          storeId: value,
          startDate: startDateValue,
          endDate: endDateValue,
        },
      });
      dispatch({
        type: 'reportDiff/queryChart',
        payload: {
          rows: 7,
          storeId: value,
        },
      });
    },
    onExportData(data) {
      dispatch({
        type: 'reportDiff/exports',
        payload: {
          startDate: data.startDate,
          endDate: data.endDate,
          page: pagination.current,
          rows: pagination.size,
          storeId: storeId,
        },
      })
    },
  }



  return (
    <div className="routes">
      <ReportDiffSearch {...reportDiffSearchProps} />
      <ReportDiffList {...reportDiffListProps} />
    </div>
  );
}

ReportDiff.propTypes = {
  reportDiff: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}

function mapStateToProps(reportDiff) {
  return {reportDiff};
}

export default connect(mapStateToProps)(ReportDiff);
