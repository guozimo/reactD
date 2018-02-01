import React, { PropTypes } from 'react'
import { Form, Input, Button, Select, DatePicker, Icon,Breadcrumb } from 'antd'
import moment from 'moment';
const dateFormat = 'YYYY-MM-DD';
const Option = Select.Option

const search = ({
  menuData,
  onAdd,
  storeList,
  changeStore,
  selectStore,
  shopId,
  onDateChange,
  onSelectDate,
  onExport,
  onExportData,
  startDateValue,
  serverTime,
  form: {
    getFieldDecorator,
    getFieldValue,
  },
}) => {
  const { list } = menuData;
  const timeNow = serverTime ? moment(serverTime) : moment();
  let startDateInit = startDateValue ? moment(startDateValue) : timeNow.startOf('day').add(-1, 'days');
  onExport = () =>{
    const currDate = getFieldValue('startDate').format(dateFormat);
    onExportData(currDate);
  };
  onDateChange = (value) => {
    const dateTime = value.format(dateFormat);
    onSelectDate(dateTime);
  };
  changeStore = (value) => {
    const data = {};
    data.storeId = value;
    selectStore(data);
  };
  const storeOptions = storeList.map(store => <Option value={store.id} key={store.id}>{store.name}</Option>);
  return (
  <div className="components-search">
    <Breadcrumb separator=">">
      <Breadcrumb.Item>供应链</Breadcrumb.Item>
      <Breadcrumb.Item>预估管理</Breadcrumb.Item>
      <Breadcrumb.Item>营业预估</Breadcrumb.Item>
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
      {shopId && list.hasOwnProperty('61700101') && <div className="right-act">
        <a onClick={onExport}><Icon type="export" />&nbsp;导出营业预估</a>
      </div>}
    </div>

    {shopId && <div className="search search-bar">
      <div className="search-item">
        <Form inline >
          <Form.Item  label="选择日期：" fieldNames="startDate">
            {getFieldDecorator('startDate',{
              initialValue: startDateInit,
            })(<DatePicker
              format={dateFormat}
              onChange={onDateChange}
              placeholder="选择日期"
            />)}
          </Form.Item>
        </Form>
        <div className="left-act">
          { list.hasOwnProperty('61700102') && <Button type="primary"  onClick={onAdd}>添加</Button> }
        </div>
      </div>
    </div>}
  </div>
  )
}

search.propTypes = {
  form: PropTypes.object.isRequired,
  onAdd: PropTypes.func,
  storeList: PropTypes.array,
  changeStore: PropTypes.func,
  selectStore: PropTypes.func,
  shopId: PropTypes.string,
  onDateChange: PropTypes.func,
  onSelectDate: PropTypes.func,
  onExport: PropTypes.func,
  onExportData: PropTypes.func,
  startDateValue: PropTypes.string,
  serverTime: PropTypes.string,
}

export default Form.create()(search)
