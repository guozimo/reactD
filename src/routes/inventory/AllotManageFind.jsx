import React, { PropTypes } from 'react';
import { connect } from 'dva';
import AllotManageList from '../../components/Inventory/AllotManage/findList.jsx';

const AllotManage = ({ allotManage, dispatch }) => {
  // console.log('------------allotManage', allotManage);
  const { loading, findList, storeId, storeList, busiList, closeUpdate } = allotManage;

  const AllotManageListDate = {
    loading,
    findList,
    storeId,
    storeList,
    busiList,
    closeUpdate, // 关闭订单
    goBack() {
      dispatch({
        type: 'allotManage/cancelAll',
        payload: {},
      });
    },
    onClose() {
      dispatch({
        type: 'allotManage/closeScmDirect',
        payload: {
          id: findList.id,
          status: '966'
        },
      });
    },
  }

  return (
    <div className="routes">
      <AllotManageList {...AllotManageListDate} />
    </div>
  );
};

AllotManage.propTypes = {
  allotManage: PropTypes.object,
  dispatch: PropTypes.func,
};
function mapStateToProps({ allotManage }) {
  return { allotManage };
}
export default connect(mapStateToProps)(AllotManage);
