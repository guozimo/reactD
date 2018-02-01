import React, { PropTypes, Component } from 'react';
import { connect } from 'dva';
import {Form, Input, Select, Row, Col,message, Button} from 'antd';
import Countdown from '../../common/CountDown';
import { hex_md5 } from '../../../utils/md5';
const FormItem = Form.Item;

class ForgetPasswordForm extends Component {

  static propTypes = {
    dispatch: PropTypes.func,
    codeBtnStatus: PropTypes.bool,
    submitBtnLoading: PropTypes.bool,
    endTime: PropTypes.number,
    form: PropTypes.object,
  };

  constructor(props){
    super(props);

    this.state = {
      passwordDirty: false,
      submitBtnLoading: false,
    };
  }

  clickCode = () => {
    const { getFieldValue, getFieldError } = this.props.form;
    const phoneNum = getFieldValue('mobilePhoneNumber');
    const error = getFieldError('mobilePhoneNumber');

    if (error) {
      message.warning(error[0]);
      return;
    }

    if (!phoneNum) {
      message.warning('请先输入手机号');
      return;
    }

    this.props.dispatch({
      type: 'forgetPassword/send',
      phoneNum,
    });
  }

  handlePasswordBlur = (e) => {
    const value = e.target.value;
    this.setState({ passwordDirty: this.state.passwordDirty || !!value });
  };

  checkPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('newPassword')) {
      callback('您输入的两个密码不一致!');
    } else {
      callback();
    }
  };

  checkConfirm = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.passwordDirty) {
      form.validateFields(['newPasswordAgain'], { force: true });
    }
    callback();
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.newPasswordAgain = hex_md5(values.newPasswordAgain);
        values.newPassword = hex_md5(values.newPassword);
        this.props.dispatch({
          type: 'forgetPassword/submit',
          values,
        });
      }
    });
  };

    checkPhone (rule, value, callback) {
    if (value && !(/^1[34578]\d{9}$/.test(value))) {
      callback('请输入正确的手机格式!');
    } else {
      callback();
    }
  }

  resetStatus = () => {
    this.props.dispatch({
      type: 'forgetPassword/codeBtnEnable',
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 8},
    };
    const tailFormItemLayout = {
      wrapperCol: {
        span: 14,
        offset: 6,
      },
    };
    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: '86',
    })(
      <Select className="icp-selector" style={{ width: 60 }}>
        <Option value="86">+86</Option>
      </Select>
    );
    return (
      <Form onSubmit={this.handleSubmit} style={{ marginTop: 50 }}>

        <FormItem
          {...formItemLayout}
          label="手机号"
        >
          {getFieldDecorator('mobilePhoneNumber', {
            rules: [{ required: true, message: '请输入手机号码'
            }, {
              validator: this.checkPhone,
            }],
          })(
            <Input addonBefore={prefixSelector} maxLength="11" placeholder="请输入手机号"  />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="手机验证码"
          extra=""
        >
          <Row gutter={8}>
            <Col span={12}>
              {getFieldDecorator('smsAuthCode', {
                rules: [{ required: true, message: '请输入您收到的验证码!' }],
              })(
                <Input size="large" maxLength='6' placeholder="请输入验证码" />
              )}
            </Col>
            <Col span={12}>
              <Button size="large" onClick={this.clickCode} disabled={this.props.codeBtnStatus} >
                { this.props.codeBtnStatus ?
                  (<Countdown endDate={ this.props.endTime }
                              format={'ss秒'}
                              onFinished={ this.resetStatus }
                  />) : '获取验证码' }
              </Button>
            </Col>
          </Row>
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="新密码"
          hasFeedback
        >
          {getFieldDecorator('newPassword', {
            rules: [{
              required: true, message: '请输入新密码!',
              min: 6, message: '密码不少于6位',
              pattern: /^[0-9a-zA-Z]{6,16}$/, message: '6到16个字符，大小写字母和数字构成，不能有其他字符'
            }, {
              validator: this.checkConfirm,
            }],
          })(
            <Input type="password" onBlur={this.handlePasswordBlur} placeholder="不少于6位" />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="密码确认"
          hasFeedback
        >
          {getFieldDecorator('newPasswordAgain', {
            rules: [{
              required: true, message: '请输入确认密码!',
              min: 6, message: '密码不少于6位',
              pattern: /^[0-9a-zA-Z]{6,16}$/, message: '6到16个字符，大小写字母和数字构成，不能有其他字符'
            }, {
              validator: this.checkPassword,
            }],
          })(
            <Input type="password" placeholder="不少于6位" maxLength={'16'} />
          )}
        </FormItem>

        <FormItem {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" size="large" loading={this.props.submitBtnLoading}>提交</Button>
        </FormItem>

      </Form>
    );
  }
}

function mapStateToProps(state) {
  const {codeBtnStatus, submitBtnLoading, endTime} = state.forgetPassword;

  return {
    loading: state.loading.models.forgetPassword,
    codeBtnStatus,
    submitBtnLoading,
    endTime,
  };
}

export default connect(mapStateToProps)(Form.create()(ForgetPasswordForm));
