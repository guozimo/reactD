import React, { PropTypes } from 'react'
import { Form, Input, Modal, DatePicker, Icon, Alert } from 'antd'
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
  checkEndDate,
  disabledStartDate,
  disabledEndDate,
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
      data.endDate = data.endDate.format(dateFormat);
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


  checkEndDate = (rule, value, callback) =>{
    const startDateValue = getFieldValue('startDate');
    if (startDateValue.startOf('day').valueOf() > value.valueOf()) {
          callback('结束日期不能小于开始日期！');
    } else {
      callback();
    }
  };

  disabledStartDate = (startDate) => {
    const endDate = getFieldValue('endDate');
    if (!startDate || !endDate) {
      return false;
    }
    return startDate.valueOf() > endDate.valueOf();
  };
  disabledEndDate = (endDate) => {
    const startDate = getFieldValue('startDate');
    if (!endDate || !startDate) {
      return false;
    }
    return endDate.valueOf() < startDate.valueOf();
  };


  return (
    <Modal {...modalOpts}>
      <div className="components-modal">
        {modalErr && <Alert message={modalErrValue} type="error" showIcon  />}
        <Form horizontal>
          <Form.Item label="开始日期："  fieldNames="startDate" {...formItemLayout}>
            {getFieldDecorator('startDate',{
              initialValue: timeNow,
              rules: [
                {
                  required: true, message: '日期未选择!',
                }
              ],
            })(<DatePicker
              format={dateFormat}
              placeholder="开始日期"
              disabledDate={disabledStartDate}
            />)}
          </Form.Item>
          <Form.Item label="结束日期："  fieldNames="endDate" {...formItemLayout}>
            {getFieldDecorator('endDate', {
              initialValue: timeNow,
              rules: [
                {
                  required: true, message: '日期未选择!',
                }, {
                  validator: checkEndDate,
                }
              ],
            })(<DatePicker
              format={dateFormat}
              placeholder="结束日期"
              disabledDate={disabledEndDate}
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
  checkEndDate: PropTypes.func,
  disabledStartDate: PropTypes.bool,
  disabledEndDate: PropTypes.bool,
  modalErr: PropTypes.bool,
  modalErrValue: PropTypes.string,
  loading: PropTypes.bool,
  serverTime: PropTypes.string,
}

export default Form.create()(modal)
