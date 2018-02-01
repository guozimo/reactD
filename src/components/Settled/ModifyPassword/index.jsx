import React, { PropTypes, Component } from 'react';
import { connect } from 'dva';
import {Form, Input, Button} from 'antd';

import { hex_md5 } from '../../../utils/md5';

const FormItem = Form.Item;

class ModifyPasswordForm extends Component {

  static propTypes = {
    dispatch: PropTypes.func,
    form: PropTypes.object,
    submitBtnLoading: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.state = {
      submitBtnLoading: false,
    };
  }

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
      form.validateFields(['confirmPassword'], { force: true });
    }
    callback();
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.confirmPassword = hex_md5(values.confirmPassword);
        values.oldPassword = hex_md5(values.oldPassword);
        values.password = hex_md5(values.password);
        this.props.dispatch({
          type: 'modifyPassword/submit',
          values,
        })
      }
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

    return (
      <Form onSubmit={this.handleSubmit} style={{ marginTop: 50 }}>

        <FormItem
          {...formItemLayout}
          label="原密码"
          hasFeedback
        >
          {getFieldDecorator('oldPassword', {
            rules: [{
              required: true, message: '请输入原密码!',
              min: 6, message: '密码不少于6位',
              pattern: /^[0-9a-zA-Z]{6,16}$/, message: '6到16个字符，大小写字母和数字构成，不能有其他字符'
            }],

          })(
            <Input type="password" placeholder="不少于6位" />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="新密码"
          hasFeedback
        >
          {getFieldDecorator('password', {
            rules: [{
              required: true, message: '请输入登录密码!',
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
          label="确认新密码"
          hasFeedback
        >
          {getFieldDecorator('confirmPassword', {
            rules: [{
              required: true, message: '请输入登录密码!',
              min: 6, message: '密码不少于6位',
              pattern: /^[0-9a-zA-Z]{6,16}$/, message: '6到16个字符，大小写字母和数字构成，不能有其他字符'
            }, {
              validator: this.checkPassword,
            }],
          })(
            <Input type="password" onBlur={this.handlePasswordBlur} placeholder="不少于6位" />
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
  const { submitBtnLoading } = state.modifyPassword;

  return {
    submitBtnLoading,
  };
}

export default connect(mapStateToProps)(Form.create()(ModifyPasswordForm));
