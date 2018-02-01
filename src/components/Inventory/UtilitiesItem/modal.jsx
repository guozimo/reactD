import React, { PropTypes } from 'react'
import { Form, Input, Modal, DatePicker, Icon, Alert  } from 'antd'
import { trimParam } from '../../../utils'
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
  item = {},
  onOk,
  onCancel,
  title,
  utilId,
  shopId,
  dateAble,
  checkEndDate,
  checkCurrCnt,
  checkPrice,
  changePrice,
  changeCurrCnt,
  modalErr,
  modalErrValue,
  loading,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    getFieldValue,
    setFieldsValue,
  },
}) => {
  function handleOk() {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = getFieldsValue();
      data.startDate = data.startDate.format(dateFormat);
      data.endDate = data.endDate.format(dateFormat);
      data.storeId = shopId;
      data.utilitiesId = utilId;
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


  checkEndDate = (rule, value, callback) =>{
    const startDateValue = getFieldValue('startDate');
    if (startDateValue.valueOf() > value.valueOf()) {
          callback('结束日期不能小于开始日期！');
    } else {
      callback();
    }
  };
  checkCurrCnt = (rule, value, callback) =>{
    const preCntValue = Number(getFieldValue('preCnt'));
    if (value) {
      if(!isNaN(value)){
        if(value <= preCntValue){
          callback('当前数量不能小于等于上次基数！');
        }else{
          callback();
        }
      }else{
        callback('请输入数字！');
      }
    } else {
      callback();
    }
  };
  checkPrice = (rule, value, callback) =>{
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
  let amtValue = 0;
  let oldAmtValue = 0;
  const preCnt = Number(getFieldValue('preCnt'));
  changePrice = ( e ) =>{
    oldAmtValue = amtValue;
    const currCntValue = Number(getFieldValue('currCnt'));
    const price = e.target.value;
    amtValue = (currCntValue - preCnt) * price;
    amtValue = amtValue.toFixed(2);
    if(amtValue > 0 && amtValue !== oldAmtValue){
      setFieldsValue({'amt': amtValue});
    }
  };
  changeCurrCnt = ( e ) =>{
    oldAmtValue = amtValue;
    const price = Number(getFieldValue('price'));
    const currCntValue = e.target.value;
    amtValue = (currCntValue - preCnt) * price;
    amtValue = amtValue.toFixed(2);
    if(amtValue > 0 && amtValue !== oldAmtValue){
      setFieldsValue({'amt': amtValue});
    }
  };

  return (
    <Modal {...modalOpts}>
      <div className="components-modal">
      {modalErr && <Alert message={modalErrValue} type="error" showIcon  />}
      <Form horizontal>
        <Form.Item label="开始日期："  fieldNames="startDate" {...formItemLayout}>
          {getFieldDecorator('startDate',{
            initialValue: moment(item.startDate),
            rules: [
              {
                required: true, message: '日期未选择!',
              }
            ],
          })(<DatePicker
            disabled = { dateAble }
            format={dateFormat}
            placeholder="开始日期"
          />)}
        </Form.Item>
        <Form.Item label="结束日期："  fieldNames="endDate" {...formItemLayout}>
          {getFieldDecorator('endDate', {
            initialValue: moment(item.endDate),
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
          />)}
        </Form.Item>
        <FormItem label="上次基数："  {...formItemLayout}>
          {getFieldDecorator('preCnt', {
            initialValue: item.preCnt !== undefined ? String(item.preCnt) : "",
          })(<Input disabled />)}
        </FormItem>
        <FormItem label="当前数量：" hasFeedback {...formItemLayout}>
          {getFieldDecorator('currCnt', {
            initialValue: item.currCnt !== undefined ? String(item.currCnt) : "",
            rules: [
              { required: true, message: '当前数量未填写', whitespace: true, },
              { max: 10, message: '最大长度不超过10', },
              { validator: checkCurrCnt, }
            ],
          })(<Input onChange={(e) => changeCurrCnt(e)} placeholder="请输入当前数量" maxLength="10"/>)}
        </FormItem>
        <FormItem label="单价：" hasFeedback {...formItemLayout}>
          {getFieldDecorator('price', {
            initialValue: item.price !== undefined ? String(item.price) : "",
            rules: [
              { required: true, message: '单价未填写', whitespace: true, },
              { max: 5, message: '最大长度不超过5', },
              { validator: checkPrice, }
            ],
          })(<Input onChange={(e) => changePrice(e)} placeholder="请输入单价" maxLength="5" />)}
        </FormItem>
        <FormItem label="金额：" hasFeedback {...formItemLayout}>
          {getFieldDecorator('amt', {
            initialValue: item.amt !== undefined ? String(item.amt) : "",
          })(<Input disabled />)}
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
  utilId: PropTypes.string,
  shopId: PropTypes.string,
  dateAble: PropTypes.bool,
  checkEndDate: PropTypes.func,
  checkCurrCnt: PropTypes.func,
  checkPrice: PropTypes.func,
  changePrice: PropTypes.func,
  changeCurrCnt: PropTypes.func,
  modalErr: PropTypes.bool,
  modalErrValue: PropTypes.string,
  loading: PropTypes.bool,
}

export default Form.create()(modal)
