import React, { PropTypes } from 'react'
import { Form, Input, Button, Select, DatePicker, Icon,Breadcrumb } from 'antd'
const dateFormat = 'YYYY-MM-DD';
const Option = Select.Option

const search = ({
  menuData,
  onAdd,
  storeList,
  changeStore,
  selectStore,
  shopId,
  onExport,
  onExportData,
  form: {
    getFieldDecorator,
  },
}) => {
  changeStore = (value) => {
    selectStore(value);
  };
  onExport = () =>{
    onExportData();
  }
  const { list } = menuData;
  const storeOptions = storeList.map(store => <Option value={store.id} key={store.id}>{store.name}</Option>);
  return (
    <div className="components-search">
      <Breadcrumb separator=">">
        <Breadcrumb.Item>供应链</Breadcrumb.Item>
        <Breadcrumb.Item>预估管理</Breadcrumb.Item>
        <Breadcrumb.Item>菜品点击率</Breadcrumb.Item>
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
        {shopId && list.hasOwnProperty('61700201') && <div className="right-act">
          <a onClick={onExport}><Icon type="export" />&nbsp;导出菜品点击率</a>
        </div>}

      </div>
      {shopId && list.hasOwnProperty('61700202') && <div className="search search-bar">
        <div className="left-act">
          <Button type="primary"  onClick={onAdd}>计算</Button>
          <span style={{ color: 'rgba(0,0,0,0.5)', marginLeft: '15px' }}>【菜品万元点击率 = 菜品销售数量 × 10000元 ÷ 菜品销售总额】</span>
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
  onExport: PropTypes.func,
  onExportData: PropTypes.func,
}

export default Form.create()(search)
