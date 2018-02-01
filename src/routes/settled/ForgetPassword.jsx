import React,{ PropTypes } from 'react';
import { connect } from 'dva';
import ForgetPasswordForm from '../../components/Settled/ForgetPassword';

function ForgetPassword() {
  return (
    <div>
      <h2 className="page-title">找回密码</h2>
      <ForgetPasswordForm />
    </div>
  );
}

export default connect()(ForgetPassword);


