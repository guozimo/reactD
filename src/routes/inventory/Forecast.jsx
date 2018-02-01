import React, { PropTypes } from 'react'
import { connect } from 'dva';
import ForecastList from '../../components/Inventory/Forecast/list'
import ForecastSearch from '../../components/Inventory/Forecast/search'
import ForecastModal from '../../components/Inventory/Forecast/modal'

function Forecast({location, dispatch, forecast}) {
  const {
    loading, list,pagination,
    currentItem, modalVisible, modalType, depotList,salesChart,
    storeId, weatherList, eventList,modalError,modalErrorValue,startDateValue, modalKey,serverTime,
  } = forecast.forecast;
  const { menuData } = forecast.merchantApp;
  const { field } = location.query
  const forecastListProps = {
    menuData,
    dataSource: list,
    loading,
    pagination:pagination,
    shopId: storeId,
    saleList: salesChart,
    startDateValue: startDateValue,
    serverTime,
    onEditItem(item) {
      dispatch({
        type: 'forecast/showModal',
        payload: {
          modalType: 'update',
          currentItem: item,
        },
      })
    },
  }
  const forecastSearchProps = {
    menuData,
    field,
    storeList: depotList,
    shopId: storeId,
    startDateValue: startDateValue,
    serverTime,
    onSearch(fieldsValue) {
      dispatch({
        type: 'forecast/query',
        payload: fieldsValue,
      })
    },
    selectStore(data) {
      dispatch({
        type: 'forecast/querySuccess',
        payload:{
          storeId: data.storeId,
          // startDateValue: data.startDateValue,
        },
      });
      dispatch({
        type: 'forecast/query',
        payload: {
          rows: 10,
          storeId: data.storeId,
          forecastDate: startDateValue,
        },
      });
      dispatch({
        type: 'forecast/queryChart',
        payload: {
          rows: 7,
          storeId: data.storeId,
          forecastDate: startDateValue,
        },
      });
    },
    onSelectDate(dateTime) {
      dispatch({
        type: 'forecast/query',
        payload: {
          rows: 10,
          storeId: storeId,
          forecastDate: dateTime,
        },
      });
      dispatch({
        type: 'forecast/queryChart',
        payload: {
          rows: 7,
          storeId: storeId,
          forecastDate: dateTime,
        },
      });
      dispatch({
        type: 'forecast/querySuccess',
        payload:{
          startDateValue: dateTime,
        },
      });
    },
    onExportData(date) {
      dispatch({
        type: 'forecast/exports',
        payload: {
          storeId: storeId,
          forecastDate: date,
        },
      })
    },
    onAdd() {
      dispatch({
        type: 'forecast/showModal',
        payload: {
          modalType: 'create',
        },
      })
    },
  }
  const forecastModalProps = {
    menuData,
    loading,
    item: modalType === 'create' ? {} : currentItem,
    type: modalType,
    title: modalType === 'create' ? '新增特殊事件' : '编辑条目',
    visible: modalVisible,
    weathersValue: weatherList,
    eventValue: eventList,
    shopId: storeId,
    modalErr: modalError,
    modalErrValue: modalErrorValue,
    key: modalKey,
    serverTime,
    onOk(data) {
      dispatch({
        type: `forecast/${modalType}`,
        payload: data,
      })
    },
    onCancel() {
      dispatch({
        type: 'forecast/hideModal',
      });
      dispatch({
        type: 'forecast/modalState',
        payload: {
          modalError: false,
          modalErrorValue: null,
        },
      })
    },
  }


  const ForecastModalGen = () =>
    <ForecastModal {...forecastModalProps}/>
  return (
    <div className="routes">
      <ForecastSearch {...forecastSearchProps} />
      <ForecastList {...forecastListProps} />
      <ForecastModal {...forecastModalProps}/>
    </div>
  );
}

  Forecast.propTypes = {
  forecast: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}

function mapStateToProps(forecast) {
  return {forecast};
}

export default connect(mapStateToProps)(Forecast);
