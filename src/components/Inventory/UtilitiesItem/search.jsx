import React, { PropTypes } from 'react'
import { Form, Input, Button, Select, DatePicker, Icon,Breadcrumb } from 'antd'
import moment from 'moment';
const dateFormat = 'YYYY-MM-DD';

const search = ({
  onSearch,
  onAdd,
  disabledStartDate,
  disabledEndDate,
  onStartChange,
  onEndChange,
  handleStartOpenChange,
  handleEndOpenChange,
  startDateValue,
  endDateValue,
  endDateOpen,
  onDataChange,
  utilId,
  shopId,
  utilitiesName,
  onBack,
  serverTime,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
}) => {
  const timeNow = serverTime ? moment(serverTime) : moment();
  let startDateInit = startDateValue ? moment(startDateValue) : timeNow;
  let endDateInit = endDateValue ? moment(endDateValue) : timeNow;

  function handleSubmit(e) {
    e.preventDefault()
    validateFields((errors) => {
      if (!!errors) {
        return
      }
      const searchParam = getFieldsValue();
      searchParam.startDate = searchParam.startDate.format(dateFormat);
      searchParam.endDate = searchParam.endDate.format(dateFormat);
      searchParam.storeId = shopId;
      searchParam.id = utilId;
      onSearch(searchParam)
    })
  }

  //日期处理函数
  disabledStartDate = (startDate) => {
    const endDate =moment(endDateValue);
    if (!startDate || !endDate) {
      return false;
    }
    return startDate.valueOf() > endDate.valueOf();
  };

  disabledEndDate = (endDate) => {
    const startDate = moment(startDateValue);
    if (!endDate || !startDate) {
      return false;
    }
    return endDate.valueOf() <= startDate.valueOf();
  };


  onStartChange = (value) => {
    const param = {
      'startDateValue': value.format(dateFormat)
    };
    onDataChange(param);
  };

  onEndChange = (value) => {
    const param = {
      'endDateValue': value.format(dateFormat)
    };
    onDataChange(param);
  };
  handleStartOpenChange = (open) => {
    if (!open) {
      const param = {
        'endDateOpen': true
      };
      onDataChange(param);
    }
  };

  handleEndOpenChange = (open) => {
    const param = {
      'endDateOpen': open
    };
    onDataChange(param);
  };


  return (
    <div className="components-search">
      <Breadcrumb separator=">">
        <Breadcrumb.Item>供应链</Breadcrumb.Item>
        <Breadcrumb.Item>成本管理</Breadcrumb.Item>
        <Breadcrumb.Item href="/inventory.html#/stock/utilities">水电气设置</Breadcrumb.Item>
        <Breadcrumb.Item>{utilitiesName}</Breadcrumb.Item>
      </Breadcrumb>
      <div className="crumb-box">
        <p>项目名称：<label>{utilitiesName}</label></p>
        <div className="right-act">
          <a onClick={onBack}>返回</a>
        </div>
      </div>
      <div className="shop-select">
        <Form inline onSubmit={handleSubmit}>
          <Form.Item label="开始时间："  fieldNames="startDate">
            {getFieldDecorator('startDate',{
              initialValue: startDateInit,
            })(<DatePicker
              format={dateFormat}
              disabledDate={disabledStartDate}
              onChange={onStartChange}
              placeholder="开始时间"
              onOpenChange={handleStartOpenChange}
            />)}
          </Form.Item>
          <Form.Item label="结束时间："  fieldNames="endDate">
            {getFieldDecorator('endDate', {
              initialValue: endDateInit,
            })(<DatePicker
              format={dateFormat}
              disabledDate={disabledEndDate}
              onChange={onEndChange}
              placeholder="结束时间"
              open={endDateOpen}
              onOpenChange={handleEndOpenChange}
            />)}
          </Form.Item>
          <Button type="primary" htmlType="submit">搜索</Button>
        </Form>
        <div className="right-act">
          <Button type="primary"  onClick={onAdd}>添加</Button>
        </div>
      </div>
    </div>
  )
}

search.propTypes = {
  form: PropTypes.object.isRequired,
  onSearch: PropTypes.func,
  onAdd: PropTypes.func,
  disabledStartDate: PropTypes.func,
  disabledEndDate: PropTypes.func,
  onStartChange: PropTypes.func,
  onEndChange: PropTypes.func,
  handleStartOpenChange: PropTypes.func,
  handleEndOpenChange: PropTypes.func,
  startDateValue: PropTypes.string,
  endDateValue: PropTypes.string,
  endDateOpen: PropTypes.bool,
  onDataChange: PropTypes.func,
  utilId: PropTypes.string,
  shopId: PropTypes.string,
  utilitiesName: PropTypes.string,
  onBack: PropTypes.func,
  serverTime: PropTypes.string,
}

export default Form.create()(search)
