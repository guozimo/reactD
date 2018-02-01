import React,{PropTypes} from 'react';
import { connect } from 'dva';
import MonthEndSearch from '../../components/Inventory/ZbMonthEnd/search'
import MonthEndList from '../../components/Inventory/ZbMonthEnd/list'

function ZbMonthEnd({ dispatch, zbMonthEnd}) {
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
    notChecked,
  } = zbMonthEnd.zbMonthEnd
  const { menuData } = zbMonthEnd.merchantApp;
  const monthEndListProps={
    menuData,
    loading,
    shopId:storeId,
    scmOutList:scmOutList,
    scmInList:scmInList,
    scmCheckList:scmCheckList,
    scmTransferList:scmTransferList,
  }
  const monthEndSearchProps={
    menuData,
    storeList: depotList,
    month:month,
    monthNext:monthNext,
    isCheck:isCheck,
    nowLast:nowLast,
    now:now,
    notChecked,
    shopId: storeId,
    selectStore(value) {
      dispatch({
        type:'zbMonthEnd/query',
        payload:{
          storeId: value,
        },
      });
      dispatch({
        type: 'zbMonthEnd/querySuccess',
        payload:{
          storeId: value,
        },
      });
    },
    changeMonthEnd(value){
      dispatch({
        type:'zbMonthEnd/changeMonthEnd',
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
ZbMonthEnd.propTypes = {
  monthEnd: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}
function mapStateToProps(zbMonthEnd) {
  return {zbMonthEnd};
}

export default connect(mapStateToProps)(ZbMonthEnd);
