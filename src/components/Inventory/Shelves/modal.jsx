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
  visible,
  item = {},
  onOk,
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
    <Modal {...modalOpts}>
      <div className="components-modal">
      {modalErr && <Alert message={modalErrValue} type="error" showIcon  />}
      <Form horizontal>
        <FormItem label="货架名称：" hasFeedback {...formItemLayout}>
          {getFieldDecorator('shelvesName', {
            initialValue: item.shelvesName,
            rules: [
              { required: true, message: '货架名称未填写', whitespace: true, },
              { max: 20, message: '最大长度不超过20', },
            ],
          })(<Input placeholder="请输入货架名称" maxLength="20"/>)}
        </FormItem>
        <FormItem label="备注：" hasFeedback {...formItemLayout}>
          {getFieldDecorator('remarks', {
            initialValue: item.remarks,
            rules: [
              { max: 100, message: '最大长度不超过100', },
            ],
          })(<Input type="textarea" placeholder="备注" maxLength="100"/>)}
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
  title: PropTypes.string,
  modalErr: PropTypes.bool,
  modalErrValue: PropTypes.string,
  loading: PropTypes.bool,
}

export default Form.create()(modal)
