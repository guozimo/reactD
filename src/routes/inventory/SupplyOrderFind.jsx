import React, { PropTypes } from 'react';
import { connect } from 'dva';
import SupperOrderList from '../../components/Inventory/SupplyOrder/findList.jsx';

const SupplyOrder = ({ supplyOrder, dispatch }) => {
  // console.log("------------supplyOrder", supplyOrder);
  const { loading, findList, storeId, storeList, supplierList, closeUpdate } = supplyOrder;

  const SupperOrderListDate = {
    loading,
    findList,
    storeId,
    storeList,
    supplierList,
    closeUpdate, // 关闭订单
    goBack() {
      dispatch({
        type: 'supplyOrder/cancelAll',
        payload: {},
      });
    },
    onClose() {
      dispatch({
        type: 'supplyOrder/closeScmDirect',
        payload: {
          id: findList.id,
          status: '966'
        },
      });
    },
  };

  return (
    <div className="routes">
      <SupperOrderList {...SupperOrderListDate} />
    </div>
  );
};

SupplyOrder.propTypes = {
  supplyOrder: PropTypes.object,
  dispatch: PropTypes.func,
};
function mapStateToProps({ supplyOrder }) {
  return { supplyOrder };
}
export default connect(mapStateToProps)(SupplyOrder);
