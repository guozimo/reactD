import React, { PropTypes } from 'react'
import { Form, Input, Button, Select,Breadcrumb } from 'antd'

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
        <Breadcrumb.Item>基本设置</Breadcrumb.Item>
        <Breadcrumb.Item>货架设置</Breadcrumb.Item>
      </Breadcrumb>
      <div className="shop-select">
        <Form inline onSubmit={handleSubmit}>
          <Form.Item hasFeedback className="no-span-col">
            {getFieldDecorator('queryString', {
              initialValue: queryString || '',
            })(<Input placeholder="货架编码、货架名称" />)}
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
  queryString: PropTypes.string,
}

export default Form.create()(search)
