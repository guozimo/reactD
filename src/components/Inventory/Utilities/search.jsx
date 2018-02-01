import React, { PropTypes } from 'react'
import { Form, Input, Button, Select, Breadcrumb } from 'antd'
const Option = Select.Option;

const search = ({
  menuData,
  queryString,
  onSearch,
  onAdd,
  storeList,
  selectStore,
  changeStore,
  shopId,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
}) => {
  const { list } = menuData;
  function handleSubmit(e) {
    e.preventDefault()
    validateFields((errors) => {
      if (!!errors) {
        return
      }
      const param = getFieldsValue();
      param.storeId = shopId;
      delete param.shopName;
      onSearch(param);
    })
  }

   changeStore = (value) => {
     selectStore(value);
  }

  const storeOptions = storeList.map(store => <Option value={store.id} key={store.id}>{store.name}</Option>);
  return (
    <div className="components-search">
      <Breadcrumb separator=">">
        <Breadcrumb.Item>供应链</Breadcrumb.Item>
        <Breadcrumb.Item>成本管理</Breadcrumb.Item>
        <Breadcrumb.Item>水电气设置</Breadcrumb.Item>
      </Breadcrumb>
      <div className="shop-select">
        <Form inline onSubmit={handleSubmit}>
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
        {shopId && list.hasOwnProperty('61600101') && <div className="right-act">
          <Button type="primary"  onClick={onAdd}>添加</Button>
        </div>}
      </div>

      {shopId && <div className="search">
        <div className="search-item">
          <Form inline onSubmit={handleSubmit}>
            <Form.Item hasFeedback className="no-span-col">
              {getFieldDecorator('queryString', {
                initialValue: queryString || '',
              })(<Input placeholder="项目名称" />)}
            </Form.Item>
            <Button type="primary" htmlType="submit">搜索</Button>
          </Form>
        </div>
      </div>}
    </div>
  )
}

search.propTypes = {
  form: PropTypes.object.isRequired,
  queryString: PropTypes.string,
  storeList: PropTypes.array,
  shopId: PropTypes.string,
  onSearch: PropTypes.func,
  onAdd: PropTypes.func,
  selectStore: PropTypes.func,
  changeStore: PropTypes.func,
}

export default Form.create()(search)
