import React, { PropTypes, Component } from 'react';
import { Modal, Form, Select, Input, message } from 'antd';
import classnames from 'classnames';
const FormItem = Form.Item;
const Option = Select.Option;

class unBindModal extends Component {
  static propTypes = {
    stores: PropTypes.array,
    form: PropTypes.object,
    dispatch: PropTypes.func,
    visible: PropTypes.bool,
  };

  hideModelHandler = () => {
    this.props.dispatch({
      type: 'authorization/hideUnBindModal'
    })
  };

  okHandler = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        // console.log('Received values of form: ', values);

        delete values.elemeStoreName;

        console.log(values);

        this.props.dispatch({
          type: 'authorization/submitShopUnBind',
          values,
        });

        this.hideModelHandler();
      }
    });
  };

  onSelect = (index) => {
    const { id, elemeStoreName } = this.props.stores[index];

    this.props.form.setFieldsValue({
      id,
      elemeStoreName
    })
  };

  render() {
    const { children } = this.props;
    const { getFieldDecorator, getFieldError, getFieldValue } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    return (
      <span>
        <span>
          { children }
        </span>

        <Modal visible={this.props.visible}
               onCancel={this.hideModelHandler}
               onOk={this.okHandler}
        >
          <Form horizontal onSubmit={this.okHandler} style={{marginTop: 20}}>
            <FormItem {...formItemLayout}
                      label="门店列表"
                      help={getFieldError('id')}
                      validateStatus={
                        classnames({
                          error: !!getFieldError('id'),
                      })}
            >
              <Select placeholder="请选择" onSelect={this.onSelect}>
                  <Option key="city" value="">请选择</Option>
                {
                  this.props.stores.map((data, index) => {
                    return <Option key={index} value={String(index)}>{data.name}</Option>;
                  })
                }
                </Select>
                {
                  getFieldDecorator('id', {
                    rules: [
                      { required: true, message: '请选择要取消绑定的门店!' },
                    ],
                  })(
                    <Input type="hidden"/>
                  )
                }
            </FormItem>

            <FormItem {...formItemLayout} label="饿了么门店">
              {
                getFieldDecorator('elemeStoreName')(
                  <span className="ant-form-text">{getFieldValue('elemeStoreName')}</span>
                )
              }
            </FormItem>
          </Form>
      </Modal>
      </span>
    );
  }
}

export default Form.create()(unBindModal);
