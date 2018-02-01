import React,{ PropTypes } from 'react';
import { connect } from 'dva';
import ResetPasswordForm from '../../components/Settled/ResetPassword';

function ResetPassword() {
  return (
    <div>
      <ResetPasswordForm />
    </div>
  );
}

export default connect()(ResetPassword);


