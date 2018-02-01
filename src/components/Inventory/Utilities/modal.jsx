import React, { PropTypes } from 'react'
import { Form, Input, Modal, Select, Alert } from 'antd'
import { trimParam } from '../../../utils'
const Option = Select.Option;
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
  checkStartCnt,
  title,
  shopId,
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
        storeId:shopId,
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
  checkStartCnt = (rule, value, callback) =>{
    if (value) {
      if(!isNaN(value)){
        if(value < 0){
          callback('不能是负数！');
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

  return (
    <Modal {...modalOpts}>
      <div className="components-modal">
      {modalErr && <Alert message={modalErrValue} type="error" showIcon  />}
      <Form horizontal>
        <FormItem label="项目类别：" hasFeedback {...formItemLayout}>
          {getFieldDecorator('utilitiesType', {
           initialValue: item.utilitiesType !== undefined ? String(item.utilitiesType) : '',
            rules: [
              {
                required: true,
                message: '项目类别未选择',
              },
            ],
          })(
            <Select
              placeholder="请选择分类"
            >
              <Option value="" disabled selected>请选择分类</Option>
              <Option value="1">水</Option>
              <Option value="2">电</Option>
              <Option value="3">气</Option>
            </Select>
          )}
        </FormItem>
        <FormItem label="项目名称：" hasFeedback {...formItemLayout}>
          {getFieldDecorator('utilitiesName', {
            initialValue: item.utilitiesName,
            rules: [
              { required: true, message: '项目名称未填写', whitespace: true, },
              { max: 20, message: '最大长度不超过20', },
            ],
          })(<Input placeholder="请输入项目名称" maxLength="20"/>)}
        </FormItem>
        <FormItem label="期初值：" hasFeedback {...formItemLayout}>
          {getFieldDecorator('startCnt', {
            initialValue: item.startCnt !== undefined ? String(item.startCnt) : "",
            rules: [
              { required: true, message: '期初值未填写', whitespace: true, },
              { max: 10, message: '最大长度不超过10', },
              { validator: checkStartCnt, },
            ],
          })(<Input disabled={item.totalCnt > 0} placeholder="请输入期初值" maxLength="10"/>)}
        </FormItem>
        <FormItem label="单位：" hasFeedback {...formItemLayout}>
          {getFieldDecorator('utilitiesUnit', {
            initialValue: item.utilitiesUnit,
            rules: [
              { required: true, message: '单位未填写', whitespace: true, },
              { max: 10, message: '最大长度不超过10', },
            ],
          })(<Input disabled={item.totalCnt > 0} placeholder="请输入单位" maxLength="10" />)}
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
  checkStartCnt: PropTypes.func,
  title: PropTypes.string,
  shopId: PropTypes.string,
  modalErr: PropTypes.bool,
  modalErrValue: PropTypes.string,
  loading: PropTypes.bool,
}

export default Form.create()(modal)
