import React, { PropTypes } from 'react'
import { Form, Input, Modal, DatePicker, Icon, Alert } from 'antd'
const FormItem = Form.Item
import moment from 'moment';
const dateFormat = 'YYYY-MM-DD';



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
  onOk,
  onCancel,
  title,
  shopId,
  disabledStartDate,
  modalErr,
  modalErrValue,
  loading,
  serverTime,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    getFieldValue,
  },
}) => {
  const timeNow = serverTime ? moment(serverTime) : moment();
  function handleOk() {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = getFieldsValue();
      data.bussDate = data.startDate.format(dateFormat);
      data.storeId = shopId;
      data.rows = 10;
      delete data.startDate;
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

  //日期处理函数

  disabledStartDate = (startDate) => {
    if(serverTime){
      return startDate.valueOf() < moment(serverTime).startOf('day') || startDate.valueOf() > moment(serverTime).startOf('day').add(3, 'days') ;
    }else {
      return startDate.valueOf() < moment().startOf('day') || startDate.valueOf() > moment().startOf('day').add(3, 'days') ;
    }
  };


  return (
    <Modal {...modalOpts}>
      <div className="components-modal">
      {modalErr && <Alert message={modalErrValue} type="error" showIcon  />}
      <Form horizontal>
        <Form.Item label="选择日期："  fieldNames="startDate" {...formItemLayout}>
          {getFieldDecorator('startDate',{
            initialValue: timeNow,
            rules: [
              {
                required: true, message: '日期未选择!',
              }
            ],
          })(<DatePicker
            format={dateFormat}
            placeholder="选择日期"
            disabledDate={disabledStartDate}
          />)}
        </Form.Item>
      </Form>
      </div>
    </Modal>
  )
}

modal.propTypes = {
  visible: PropTypes.bool,
  form: PropTypes.object,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
  title: PropTypes.string,
  shopId: PropTypes.string,
  disabledStartDate: PropTypes.bool,
  modalErr: PropTypes.bool,
  modalErrValue: PropTypes.string,
  loading: PropTypes.bool,
  serverTime: PropTypes.string,
}

export default Form.create()(modal)
