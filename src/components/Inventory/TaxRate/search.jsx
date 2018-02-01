import React, { PropTypes } from 'react'
import { Form, Input, Button, Select, Breadcrumb } from 'antd'

const search = ({
  menuData,
  queryString,
  onSearch,
  onAdd,
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
      onSearch(getFieldsValue())
    })
  }

  return (
    <div className="components-search">
      <Breadcrumb separator=">">
        <Breadcrumb.Item>供应链</Breadcrumb.Item>
        <Breadcrumb.Item>基本设置</Breadcrumb.Item>
        <Breadcrumb.Item>税率设置</Breadcrumb.Item>
      </Breadcrumb>
      <div className="shop-select">
        <Form inline onSubmit={handleSubmit}>
          <Form.Item hasFeedback className="no-span-col">
            {getFieldDecorator('queryString', {
              initialValue: queryString || '',
            })(<Input placeholder="税率名称、税率编码" maxLength="20" />)}
          </Form.Item>
          <Button type="primary" htmlType="submit">搜索</Button>
        </Form>
        <div className="right-act">
          {list.hasOwnProperty('61100101')&&<Button type="primary" onClick={onAdd} key="80010101">添加</Button>}
        </div>
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
