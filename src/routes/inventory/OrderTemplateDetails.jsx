import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { message } from 'antd';
import _ from 'lodash';
import OrderTempDetailsFilter from '../../components/Inventory/OrderTemplate/details/filter';
// import OrderTempDetailListView from '../../components/Inventory/OrderTemplate/details/listView';

const OrderTemplateDetails = ({ orderTempDetailsModule, dispatch }) => {
  const { pageType, templateNo, templateName, status } = orderTempDetailsModule;
  const SearchData = {
    pageType,
    templateNo,
    templateName,
    status,
    selectedBussDate(date, dateString) {
      dispatch({
        type: 'cannMangeDetailsModule/setBussinessDate',
        payload: {
          date,
          dateString,
        },
      });
    },
  };
  const ListData = {
    pageType,
    templateNo,
    templateName,
    status,
    selectedBussDate(date, dateString) {
      dispatch({
        type: 'cannMangeDetailsModule/setBussinessDate',
        payload: {
          date,
          dateString,
        },
      });
    },
  };

  const DetailsFilterData = {
    ...SearchData,
  };

  const DetailsListData = {
    ...ListData,
  };

  return (
    <div className="routes">
      <OrderTempDetailsFilter {...DetailsFilterData} />
      {/* <OrderTempDetailListView {...DetailsListData} /> */}
    </div>
  );
};

function mapStateToProps({ orderTempDetailsModule }) {
  return { orderTempDetailsModule };
}
export default connect(mapStateToProps)(OrderTemplateDetails);
