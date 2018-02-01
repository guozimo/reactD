import React, { PropTypes } from 'react'
import { Form, Input, Button, Select, DatePicker, Icon, Breadcrumb} from 'antd'
import moment from 'moment';
const dateFormat = 'YYYY-MM-DD';
const Option = Select.Option

const search = ({
  menuData,
  onSearch,
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
  storeList,
  shopId,
  changeStore,
  selectStore,
  onExport,
  onExportData,
  serverTime,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    getFieldValue,
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
      if(searchParam.startDate){
        searchParam.startDate = searchParam.startDate.format(dateFormat);
      }
      if(searchParam.endDate){
        searchParam.endDate = searchParam.endDate.format(dateFormat);
      }
      searchParam.storeId = shopId;
      delete  searchParam.shopName;
      onSearch(searchParam)
    })
  }
  changeStore = (value) => {
    selectStore(value);
  };
  onExport = () =>{
    const param = {};
    param.startDate = getFieldValue('startDate').format(dateFormat);
    param.endDate = getFieldValue('endDate').format(dateFormat);
    onExportData(param);
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

  const storeOptions = storeList.map(store => <Option value={store.id} key={store.id}>{store.name}</Option>);
  return (
    <div className="components-search">
      <Breadcrumb separator=">">
        <Breadcrumb.Item>供应链</Breadcrumb.Item>
        <Breadcrumb.Item>成本管理</Breadcrumb.Item>
        <Breadcrumb.Item>物资差异分析</Breadcrumb.Item>
      </Breadcrumb>
      <div className="shop-select">
        <Form inline >
          <Form.Item label="门店名称">
            {getFieldDecorator('shopName', {
              initialValue: shopId || '请选择门店名称',
            })(
              <Select
                style={{ width: 160 }}
                onChange={changeStore}
              >
                {storeOptions}
              </Select>
            )}
          </Form.Item>
        </Form>
        {shopId && menuData['list'].hasOwnProperty('61600401') && <div className="right-act">
          <a onClick={onExport}><Icon type="export" />&nbsp;导出差异分析</a>
        </div>}
      </div>
      {shopId && <div className="search">
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
      </div>}
    </div>
  )
}

search.propTypes = {
  form: PropTypes.object.isRequired,
  onSearch: PropTypes.func,
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
  shopId: PropTypes.string,
  storeList: PropTypes.array,
  changeStore: PropTypes.func,
  selectStore: PropTypes.func,
  onExport: PropTypes.func,
  onExportData: PropTypes.func,
  serverTime: PropTypes.string,
}

export default Form.create()(search)
