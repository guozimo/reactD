import React, { PropTypes, Component } from 'react';
import { Modal, Form, Select, Input } from 'antd';
import classnames from 'classnames';
const FormItem = Form.Item;
const Option = Select.Option;

class BindModal extends Component {
  static propTypes = {
    elemeShops: PropTypes.array,
    stores: PropTypes.array,
    form: PropTypes.object,
    dispatch: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      visible: false,
    };
  }

  showModelHandler = (e) => {
    if (e) e.stopPropagation();
    this.setState({
      visible: true,
    });
  };

  hideModelHandler = () => {
    this.setState({
      visible: false,
    });
  };

  okHandler = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        // console.log('Received values of form: ', values);

        this.props.dispatch({
          type: 'authorization/submitShopBind',
          values,
        });

        this.hideModelHandler();
      }
    });
  };

  elemStoreChange = (item) => {
    this.props.form.setFieldsValue({
      'elemeStoreName': item.label,
      'elemeStoreId': item.key,
    });
  };

  render() {
    const { children } = this.props;
    const { getFieldDecorator, getFieldError } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    return (
      <span>
        <span onClick={this.showModelHandler}>
          { children }
        </span>

        <Modal visible={this.state.visible}
               onCancel={this.hideModelHandler}
               onOk={this.okHandler}
        >
          <Form horizontal onSubmit={this.okHandler} style={{marginTop: 20}}>
            <FormItem {...formItemLayout} label="门店列表">
              {
                getFieldDecorator('id', {
                  rules: [
                    { required: true, message: '请选择要绑定的门店!' },
                  ],
                })(<Select placeholder="请选择" >
                  <Option key="city" value="">请选择</Option>
                  {
                    this.props.stores.map((data) => {
                      return <Option key={data.id} value={data.id}>{data.name}</Option>;
                    })
                  }
                </Select>)
              }
            </FormItem>

            <FormItem {...formItemLayout}
                      help={getFieldError('elemeStoreId')}
                      validateStatus={
                        classnames({
                          error: !!getFieldError('elemeStoreId'),
                        })}
                      label="饿了么门店">
              <Select labelInValue placeholder="请选择" onChange={this.elemStoreChange}>
                <Option key="store" value="">请选择</Option>
                {
                  this.props.elemeShops.map((data) => {
                    return <Option key={data.id} value={data.id}>{data.storeName}</Option>;
                  })
                }
              </Select>

              { getFieldDecorator('elemeStoreId', {
                rules: [
                  { required: true, message: '请选择饿了么门店!' },
                ],
              })(
                <Input type="hidden" />
              ) }
              { getFieldDecorator('elemeStoreName')(
                <Input type="hidden" />
              ) }
            </FormItem>
          </Form>
      </Modal>
      </span>
    );
  }
}

export default Form.create()(BindModal);
