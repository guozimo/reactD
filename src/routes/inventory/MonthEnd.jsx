import React,{PropTypes} from 'react';
import { connect } from 'dva';
import MonthEndSearch from '../../components/Inventory/MonthEnd/search'
import MonthEndList from '../../components/Inventory/MonthEnd/list'

function MonthEnd({ dispatch, monthEnd}) {
  const {
    loading,
    depotList,
    storeId,
    shopId,
    scmOutList,
    month,
    isCheck,
    nowLast,
    now,
    monthNext,
    scmInList,
    scmCheckList,
    scmTransferList,
    scmDirectList,
    notChecked,
  } = monthEnd.monthEnd
  const { menuData } = monthEnd.merchantApp;
  const monthEndListProps={
    menuData,
    loading,
    shopId:storeId,
    scmOutList:scmOutList,
    scmInList:scmInList,
    scmCheckList:scmCheckList,
    scmTransferList:scmTransferList,
    scmDirectList:scmDirectList,
  }
  const monthEndSearchProps={
    menuData,
    storeList: depotList,
    month:month,
    monthNext:monthNext,
    isCheck:isCheck,
    nowLast:nowLast,
    now:now,
    shopId: storeId,
    notChecked,
    selectStore(value) {
      dispatch({
        type:'monthEnd/query',
        payload:{
          storeId: value,
        },
      });
      dispatch({
        type: 'monthEnd/querySuccess',
        payload:{
          storeId: value,
        },
      });
    },
    changeMonthEnd(value){
      dispatch({
        type:'monthEnd/changeMonthEnd',
        payload:{
          storeId: value,
        }
      })
    }
  }
  return (
    <div className="routes">
      <MonthEndSearch {...monthEndSearchProps} />
      <MonthEndList {...monthEndListProps} />
    </div>
  );
}
MonthEnd.propTypes = {
  monthEnd: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}
function mapStateToProps(monthEnd) {
  return {monthEnd};
}

export default connect(mapStateToProps)(MonthEnd);
