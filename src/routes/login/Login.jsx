import React, { PropTypes } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Icon, Input, Button, Row, Col } from 'antd';
import { hex_md5 } from '../../utils/md5';
import moment from 'moment';
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 24 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
  },
}
const RequisitionList = ({
  dispatch,
  location,
  isLogin,
  winHeight,
	form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
    getFieldValue,
    setFieldsValue,
  },
}) => {
  //----检测手机号格式----
  const checkPhone = (rule, value, callback) => {
    if (value) {
      if (!(/^1[34578]\d{9}$/.test(value))) {
        callback('请输入正确的手机格式!');
      } else {
        callback();
      }
    } else {
      callback('请输入手机号码');
    }
  };
	const onSubmit = (value) => {
		validateFields((err, values) => {
      if (!err) {
        values.password = hex_md5(values.password);
        values.username = values.userName;
        dispatch({
          type: 'login/fetchLogin',
          values,
        })
      }
    });
	}
  const handleSubmit= (e,values) => {
	  console.log('e====>', e);
    console.log('values====>', values);
	  if (event.key === 'Enter'){
      validateFields((err, values) => {
        if (!err) {
          values.password = hex_md5(values.password);
          values.username = values.userName;
          dispatch({
            type: 'login/fetchLogin',
            values,
          })
        }
      });
    }


  }
  return (
      <div className="login-wrapper">
        <div className="s-header">
          <div className="site-top-bar">
            <div className="site-container">客服/投诉电话：400-8100-167</div>
          </div>
        </div>
        <div className="site-header hidden-xs">
          <div className="site-container">
            <p className="logo"><a href="/index.html#/login" style={{display: 'block'}}></a></p>
            {
              isLogin && <div className="act-list">
                <a href="/settled.html#/merchants/merchantsInfo" className="btn btn-danger btn-outline">进入系统</a>
              </div>
            }
          </div>
        </div>
        { !isLogin && <div>
          <div className="site-index-login" style={{ height: winHeight }}>
            <div className="site-container">
              <div className="login-box" onKeyDown={(e,value)=>handleSubmit(e,value)}>
                <Form>
                  <FormItem
                    {...formItemLayout}
                  >
                    {getFieldDecorator('userName', {
                      rules: [{
                        validator: checkPhone,
                      }],
                    })(
                      <Input style={{borderRadius: '20px'}} prefix={<Icon type="user" style={{ fontSize: 20, color: '#f47373' }} />} placeholder="请录入您的手机号" />
                    )}
                  </FormItem>
                  <FormItem style={{marginBottom: 10}}
                    {...formItemLayout}
                  >
                    {getFieldDecorator('password', {
                      rules: [{ required: true, message: '请输入密码' }, {
                      pattern: /^[0-9a-zA-Z]{6,16}$/, message: '6到16个字符，大小写字母和数字构成，不能有其他字符'
                      }],
                    })(
                      <Input style={{borderRadius: '20px'}} prefix={<Icon type="lock" style={{ fontSize: 20, color: '#f47373' }} />} type="password" placeholder="请输入密码" />
                    )}
                  </FormItem>
                <FormItem>
                  <a className="login-form-left" href="/settled.html#/merchants/forgetPassword">忘记密码</a>
                  <a className="login-form-forgot" href="/settled.html#/merchants/register">商户注册</a>
                  <Button onClick={onSubmit} type="primary" htmlType="submit"  className="login-form-button" style={{width: '100%', height: '40px', fontSize: 18}}>
                    登录
                  </Button>
                </FormItem>
                </Form>
                <div className="slogan">
                  <div className="bgNGY"></div>
                </div>
              </div>
            </div>
          </div>
        </div>}
        {isLogin && <div className="site-index-login site-index-logined"  id="site-index-logined" style={{ height: winHeight }}>
          <div className="site-container visible-xs">
            <div className="login-box">
                <div className="form-group act-box ">
                  <a href="/settled.html#/merchants/merchantsInfo" className="btn btn-lg btn-danger login-form-button">进入系统</a>
                </div>
                <div className="slogan"><p className="bgNGY"></p></div>
            </div>
          </div>
        </div>}
        <div className="footer" id="site-footer">
          <div className="site-container">
            <p>京ICP备05002582号-2&nbsp;&nbsp;&nbsp;&nbsp;COPYRIGHT©CHOICESOFT.COM.CN</p>
          </div>
        </div>
      </div>
  );
};

function mapStateToProps(state) {
  const { isLogin, winHeight } = state.login;
  return {isLogin, winHeight};
}
RequisitionList.propTypes = {
  isLogin: PropTypes.bool,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  winHeight: PropTypes.number
};
export default connect(mapStateToProps)(Form.create()(RequisitionList));
