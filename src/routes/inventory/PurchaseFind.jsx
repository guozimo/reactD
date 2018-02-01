import React, { PropTypes } from 'react';
import { connect } from 'dva';
import PurchaseList from '../../components/Inventory/Purchase/findList.jsx';

const Purchase = ({ purchase, dispatch }) => {
  const {  loading,findList,storeId} = purchase;

  const purchaseListDate = {
    loading,
    findList,
    storeId,
    goBack() {
      dispatch({
        type: 'purchase/cancelAll',
        payload: {},
      });
    },
  }

  return (
    <div className="routes">
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
