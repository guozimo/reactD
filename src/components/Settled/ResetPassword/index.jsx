import React, { PropTypes, Component } from 'react';
import { connect } from 'dva';
import {Form, Input, Button} from 'antd';
const FormItem = Form.Item;

class RegistrationForm extends Component {

  static propTypes = {
    dispatch: PropTypes.func,
    form: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {
      passwordDirty: false,
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };

  handlePasswordBlur = (e) => {
    const value = e.target.value;
    this.setState({ passwordDirty: this.state.passwordDirty || !!value });
  };

  checkPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('您输入的两个密码不一致!');
    } else {
      callback();
    }
  };

  checkConfirm = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.passwordDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
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

    return (
      <Form onSubmit={this.handleSubmit} style={{ marginTop: 50 }}>

        <FormItem
          {...formItemLayout}
          label="新密码"
          hasFeedback
        >
          {getFieldDecorator('password', {
            rules: [{
              required: true, message: '请输入登录密码!',
              min: 6, message: '密码不少于6位',
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
          {getFieldDecorator('confirm', {
            rules: [{
              required: true, message: '请输入确认密码!',
              min: 6, message: '密码不少于6位',
            }, {
              validator: this.checkPassword,
            }],
          })(
            <Input type="password" placeholder="不少于6位" maxLength={'16'}/>
          )}
        </FormItem>

        <FormItem {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" size="large">提交</Button>
        </FormItem>
      </Form>
    );
  }
}
const WrappedRegistrationForm = Form.create()(RegistrationForm);

function mapStateToProps(state) {
  /*const { codeStatus, submitBtnLoading } = state.merchantSettled;
   //console.log(state, submitBtnLoading);
   return {
   loading: state.loading.models.merchantSettled,
   codeStatus,
   submitBtnLoading
   };*/
}
export default connect(mapStateToProps)(WrappedRegistrationForm);
