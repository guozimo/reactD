import React, { PropTypes } from 'react'
import { connect } from 'dva';
import ReportDishList from '../../components/Inventory/ReportDish/list'
import ReportDishSearch from '../../components/Inventory/ReportDish/search'

function ReportDish({location, dispatch, reportDish}) {
  const {
    loading, list, pagination,
    startDateValue,endDateValue,endDateOpen,depotList, storeId,serverTime,
  } = reportDish.reportDish
  const { menuData } = reportDish.merchantApp;

  const { queryString } = location.query

  const reportDishListProps = {
    menuData,
    dataSource: list,
    loading,
    pagination:pagination,
    shopId: storeId,
    onPageChange(page) {
      dispatch({
        type: 'reportDish/query',
        payload: {
          page: page.current,
          rows:page.pageSize,
          storeId,
          startDate: startDateValue,
          endDate: endDateValue,
        },
      })
    },
    onPageSizeChange(current, pageSize){
      dispatch({
        type: 'reportDish/query',
        payload: {
          page: 1,
          rows:pageSize,
          storeId,
          startDate: startDateValue,
          endDate: endDateValue,
        },
      })
    },
    onExportData(id) {
      dispatch({
        type: 'reportDish/exports',
        payload: {
          startDate: startDateValue,
          endDate: endDateValue,
          storeId: storeId,
          dishId: id,
        },
      })
    },
  }

  const reportDishSearchProps = {
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
        type: 'reportDish/query',
        payload: fieldsValue,
      });
      dispatch({
        type: 'reportDish/querySuccess',
        payload: {
          startDateValue: fieldsValue.startDate,
          endDateValue: fieldsValue.endDate,
        },
      });
    },
    onDataChange(data) {
      dispatch({
        type: 'reportDish/querySuccess',
        payload:data,
      });
    },
    selectStore(value) {
      dispatch({
        type: 'reportDish/querySuccess',
        payload:{
          storeId: value,
          startDateValue: serverTime,
          endDateValue: serverTime,
        },
      });
      dispatch({
        type: 'reportDish/query',
        payload: {
          rows: 10,
          storeId: value,
          startDate:  serverTime,
          endDate:  serverTime,
        },
      });
      dispatch({
        type: 'reportDish/queryChart',
        payload: {
          rows: 7,
          storeId: value,
        },
      });
    },
  }



  return (
    <div className="routes">
      <ReportDishSearch {...reportDishSearchProps} />
      <ReportDishList {...reportDishListProps} />
    </div>
  );
}

ReportDish.propTypes = {
  reportDish: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}

function mapStateToProps(reportDish) {
  return {reportDish};
}

export default connect(mapStateToProps)(ReportDish);
