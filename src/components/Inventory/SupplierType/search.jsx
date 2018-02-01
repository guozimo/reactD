import React, { PropTypes } from 'react'
import { Form, Input, Button, Select, Breadcrumb } from 'antd'
import INVENTORY_PERMISSION from '../../common/Permission/inventoryPermission';
import Permission from '../../common/Permission/Permission.jsx';

const search = ({
  queryString,
  onSearch,
  onAdd,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
}) => {
  function handleSubmit(e) {
    e.preventDefault()
    validateFields((errors) => {
      if (!!errors) {
        return
      }
      onSearch(getFieldsValue())
    })
  }

  return (
    <div className="components-search">
      <Breadcrumb separator=">">
        <Breadcrumb.Item>供应链</Breadcrumb.Item>
        <Breadcrumb.Item>供应商管理</Breadcrumb.Item>
        <Breadcrumb.Item>供应商类型</Breadcrumb.Item>
      </Breadcrumb>
      <div className="shop-select">
        <Form inline onSubmit={handleSubmit}>
          <Form.Item hasFeedback className="no-span-col">
            {getFieldDecorator('stCode', {
              initialValue: queryString || '',
              rules: [{ max: 20, message: '最大长度不超过20' },
              ],
            })(<Input placeholder="供应商类型编码、名称" />)}
          </Form.Item>
          <Form.Item hasFeedback className="no-span-col">
            <Button type="primary" htmlType="submit">搜索</Button>
          </Form.Item>
        </Form>
        <Permission path={INVENTORY_PERMISSION.SUPPLIER_TYPE.CREATE}>
          <div className="right-act">
            <Button type="primary" onClick={onAdd}>添加</Button>
          </div>
        </Permission>
      </div>
    </div>
  )
}

search.propTypes = {
  form: PropTypes.object.isRequired,
  onSearch: PropTypes.func,
  onAdd: PropTypes.func,
  queryString: PropTypes.string,
}

export default Form.create()(search)
