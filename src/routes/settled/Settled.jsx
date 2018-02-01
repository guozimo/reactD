import React,{ PropTypes } from 'react';
import { connect } from 'dva';
import RegistrationForm from '../../components/Settled';


function MerchantSettled({ codeBtnStatus, submitBtnLoading, endTime, dispatch }) {
  return (
    <div>
      <h2 className="page-title">注册账号</h2>
      <RegistrationForm codeBtnStatus={codeBtnStatus}
                        submitBtnLoading={submitBtnLoading}
                        endTime={endTime}
                        dispatch={dispatch}/>
    </div>
  );
}

function mapStateToProps(state) {
  const { codeBtnStatus, submitBtnLoading, endTime } = state.merchantSettled;

  return {
    codeBtnStatus,
    submitBtnLoading,
    endTime,
  };
}

export default connect(mapStateToProps)(MerchantSettled);


