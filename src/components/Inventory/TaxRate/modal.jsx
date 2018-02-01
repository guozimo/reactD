import React, { PropTypes } from 'react'
import { Form, Input, Modal, Alert } from 'antd'
import { trimParam } from '../../../utils'

const FormItem = Form.Item
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

const modal = ({
  menuData,
  visible,
  item = {},
  onOk,
  checkRatio,
  onCancel,
  title,
  modalErr,
  modalErrValue,
  loading,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },

}) => {
  function handleOk() {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
        key: item.key,
      };
      trimParam(data);
      onOk(data)
    })
  };

  checkRatio = (rule, value, callback) =>{
    if (value) {
      if(!isNaN(value)){
        if(value < 0 || value > 1){
          callback('请输入0至1之间的数！');
        }else{
          callback();
        }
      }else{
        callback('请输入数字！');
      }
    } else {
      callback();
    }
  }


  const modalOpts = {
    title:title,
    visible,
    onOk: handleOk,
    onCancel,
    wrapClassName: 'vertical-center-modal',
    confirmLoading: loading,
  }

  return (
    <Modal {...modalOpts}  >
      <div className="components-modal">
      {modalErr && <Alert message={modalErrValue} type="error" showIcon  />}
      <Form horizontal>
        <FormItem label="税率名称：" hasFeedback {...formItemLayout}>
          {getFieldDecorator('taxName', {
            initialValue: item.taxName,
            rules: [
              { required: true, message: '税率名称未填写', whitespace: true, },
              { max: 20, message: '最大长度不超过20', },
            ],
          })(<Input placeholder="请输入税率名称" maxLength="20"/>)}
        </FormItem>
        <FormItem label="税率值：" hasFeedback {...formItemLayout} className='taxRateForm'>
          {getFieldDecorator('taxRatio', {
            initialValue: item.taxRatio !== undefined ? String(item.taxRatio) : '',
            rules: [
              { required: true, message: '税率值未填写!', whitespace: true, },
              { max: 4, message: '最大长度不超过4', },
              { validator: checkRatio,}
            ],
          })( <Input placeholder="0.01至1.00，保留两位小数" maxLength="4"/>)}
        </FormItem>
      </Form>
      </div>
    </Modal>
  )
}

modal.propTypes = {
  visible: PropTypes.bool,
  form: PropTypes.object,
  item: PropTypes.object,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
  checkRatio: PropTypes.func,
  title: PropTypes.string,
  modalErr: PropTypes.bool,
  modalErrValue: PropTypes.string,
  loading: PropTypes.bool,
}

export default Form.create()(modal)
