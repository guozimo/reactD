import React, { PropTypes } from 'react'
import { Form, Input, Modal, DatePicker, Icon, Select, Alert } from 'antd'
import { trimParam } from '../../../utils'
const FormItem = Form.Item;
const Option = Select.Option;
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
  item = {},
  onOk,
  onCancel,
  title,
  shopId,
  weathersValue,
  eventValue,
  onCheckDate,
  disabledStartDate,
  modalErr,
  modalErrValue,
  checkAmt,
  loading,
  serverTime,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
}) => {
  const timeNow = serverTime ? moment(serverTime) : moment();
  function handleOk() {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = getFieldsValue();
      data.forecastDate = data.forecastDate.format(dateFormat);
      data.storeId = shopId;
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
  };

  checkAmt = (rule, value, callback) =>{
    if (value) {
      if(!isNaN(value)){
        callback();
      }else{
        callback('请输入数字！');
      }
    } else {
      callback();
    }
  };

  disabledStartDate = (startDate) => {
    const timeToday = timeNow.startOf('day');
    if (!startDate ) {
      return false;
    }
    return startDate.valueOf() < timeToday.valueOf();
  };

  onCheckDate = (rule, value, callback) =>{
    const timeToday = timeNow.startOf('day');
    if (value.valueOf() < timeToday.valueOf()) {
          callback('日期不能小于当前日期！');
    } else {
      callback();
    }
  };


  const weatherOptions = weathersValue.map(weather => <Option value={weather.id} key={weather.id}>{weather.weatherName}</Option>);
  const eventOptions = eventValue.map(event => <Option value={event.id} key={event.id}>{event.holidaysName}</Option>);

  return (
    <Modal {...modalOpts}>
      <div className="components-modal">
        {modalErr && <Alert message={modalErrValue} type="error" showIcon  />}
        <Form horizontal>
          {!item.forecastDate && <Form.Item label="日期："  fieldNames="forecastDate" {...formItemLayout}>
            {getFieldDecorator('forecastDate',{
              initialValue: timeNow,
              rules: [
                {
                  required: true, message: '日期未选择!',
                }, {
                  validator: onCheckDate,
                }
              ],
            })(<DatePicker
              format={dateFormat}
              disabledDate={disabledStartDate}
              placeholder="选择日期"
            />)}
          </Form.Item>}
          {item.forecastDate && <Form.Item label="日期："  fieldNames="forecastDate" {...formItemLayout}>
            {getFieldDecorator('forecastDate',{
              initialValue: moment(item.forecastDate),
            })(<DatePicker
              disabled
              format={dateFormat}
              disabledDate={disabledStartDate}
              placeholder="选择日期"
            />)}
          </Form.Item>}

          {!item.forecastDate && <FormItem label="事件："  {...formItemLayout}>
            {getFieldDecorator('eventId', {
              initialValue: item.eventId || '',
              rules: [
                {
                  required: true, message: '事件未选择!',
                }
              ],
            })(<Select
              placeholder = "请选择事件"
              style={{ width: 160 }}
              //onChange={changeStore}
            >
              <Option value="" disabled selected>请选择事件</Option>
              {eventOptions}
            </Select>)}
          </FormItem>}
          {item.forecastDate && <FormItem label="事件："  {...formItemLayout}>
            {getFieldDecorator('eventId', {
              initialValue: item.eventId || '',
            })(<Select
              placeholder = "请选择事件"
              style={{ width: 160 }}
              //onChange={changeStore}
            >
              <Option value="" disabled selected>请选择事件</Option>
              {eventOptions}
            </Select>)}
          </FormItem>}
          <FormItem label="天气："  {...formItemLayout}>
            {getFieldDecorator('weatherId', {
              initialValue: item.weatherId || '',
            })(<Select
              placeholder = "请选择天气"
              style={{ width: 160 }}
              //onChange={changeStore}
            >
              <Option value="" disabled selected>请选择天气</Option>
              {weatherOptions}
            </Select>)}
          </FormItem>
          {(item.amtU >= 0 && item.amtU !=null)&& <FormItem label="预估值修正：" hasFeedback {...formItemLayout}>
            {getFieldDecorator('amtU', {
              initialValue:String(item.amtU),
              rules: [
                { required: true, message: '预估值未填写', whitespace: true, },
                { max: 10, message: '最大长度不超过10', },
                { validator: checkAmt, },
              ],
            })(<Input placeholder="请输入预估值" maxLength="10" />)}
          </FormItem>}
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
  shopId: PropTypes.string,
  weathersValue: PropTypes.array,
  eventValue: PropTypes.array,
  onCheckDate: PropTypes.func,
  disabledStartDate: PropTypes.func,
  modalErr: PropTypes.bool,
  modalErrValue: PropTypes.string,
  checkAmt: PropTypes.func,
  loading: PropTypes.bool,
  serverTime: PropTypes.string,
}

export default Form.create()(modal)
