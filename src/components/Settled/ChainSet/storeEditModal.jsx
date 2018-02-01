import React, { PropTypes } from 'react';
import { Row, Col, Tree, Modal, Button, Form, Input, Select } from 'antd';
import classnames from 'classnames';
const { Option, OptGroup } = Select;
const TreeNode = Tree.TreeNode;
const { TextArea } = Input;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    span: 14,
    offset: 6,
  },
};
function storeEditModal({
  dispatch,
  storeView,
  visible,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
    getFieldValue,
    setFieldsValue,
    getFieldError,
  },
  provinceList,
  cityList,
  districtList,
}){
  const onCancel = () => {
    dispatch({
      type: 'chainSet/hideModal',
    });
  };
  const onOk = () => {
    validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'chainSet/saveEditStore',
          values: {
            address: values.address,
            city: values.city,
            comptel: values.comptel,
            contactMan: values.contactMan,
            contactNumber: values.contactNumber,
            district: values.district,
            latestNews: values.latestNews,
            name: values.name,
            province: values.province,
            storeIntroduction: values.storeIntroduction,
            storeId: storeView.id,
          },
        });
      }
    });
  };
  const checkPhone = (rule, value, callback) => {
    if (value) {
      if (!(/^1[34578]\d{9}$/.test(value))) {
        callback('请输入正确的手机格式!');
      } else {
        callback();
      }
    } else {
      callback('请输入手机号码');
    }
  };
  const provinceChange = (value) => {
    dispatch({
      type: 'chainSet/getDistrict',
      id: value,
      getType: 'city'
    });
    setFieldsValue({'city' : '' });
    setFieldsValue({'district': ''});
  };
  const cityChange = (value) => {
    dispatch({
      type: 'chainSet/getDistrict',
      id: value,
      getType: 'area'
    });
    setFieldsValue({'district': ''});
  };
  return(<div style={{ marginTop: 20 }}>
      <Modal
        width={810}
        title="编辑门店"
        visible = {visible}
        footer={[
          <Button key="back" size="large" onClick={onCancel}>返回</Button>,
          <Button key="save" size="large" type="primary" onClick={onOk}>保存</Button>,
        ]}
        onCancel={onCancel}
        maskClosable={false}
      >
        <Row style={{ fontSize: '14px', padding:'10px 0' }}>
          <Col span={12} >
            <Row style={{ paddingBottom: '10px' }}>
              <FormItem
                style={{ height: '20px', marginBottom: '2px' }}
                {...formItemLayout}
                label="门店名称"
              >
                {getFieldDecorator('name', {
                  initialValue: (storeView && storeView.name) || '',
                  rules: [{
                    required: true, message: '请输入门店名称',
                    max: 30, message: '门店名称不超过30个字符',
                  }],
                })(
                  <Input maxLength="30"/>
                )}
            </FormItem>
            </Row>
            <Row style={{ paddingBottom: '10px' }}>
              <FormItem
                style={{ height: '20px', marginBottom: '2px', fontWeight: 400 }}
                {...formItemLayout}
                label="门店编号"
              >
               <div style={{ fontWeight: 400 }}>{storeView && storeView.code}</div>
            </FormItem>
            </Row>
            <Row style={{ paddingBottom: '10px' }}>
              <FormItem
                style={{ height: '20px', marginBottom: '2px' }}
                {...formItemLayout}
                label="欢迎语"
              >
                {getFieldDecorator('latestNews', {
                  initialValue: (storeView && storeView.latestNews) || '',
                  rules: [{
                    max: 50, message: '最多输入50个字符',
                  }],
                })(
                  <TextArea placeholder='最多输入50个字符' maxLength="50" autosize={{ minRows: 4, maxRows: 6 }}/>
                )}
            </FormItem>
            </Row>
            <Row style={{ paddingBottom: '10px' }}>
              <FormItem
                style={{ height: '20px', marginBottom: '2px' }}
                {...formItemLayout}
                label="备注"
              >
                {getFieldDecorator('storeIntroduction', {
                  initialValue: (storeView && storeView.storeIntroduction) || '',
                  rules: [{
                    max: 150, message: '最多输入150个字符',
                  }],
                })(
                  <TextArea placeholder='最多输入150个字符' maxLength="150" autosize={{ minRows: 4, maxRows: 6 }}/>
                )}
            </FormItem>
            </Row>
          </Col>
          <Col span={12}>
            <Row style={{ paddingBottom: '10px' }}>
              <FormItem
                style={{ height: '20px', marginBottom: '2px' }}
                {...formItemLayout}
                label="联系人"
              >
                {getFieldDecorator('contactMan', {
                  initialValue: (storeView && storeView.contactMan) || '',
                  rules: [{
                    required: true, message: '请输入联系人',
                    mex: 20, message: '最多输入20个字符'
                  }],
                })(
                  <Input maxLength="20"/>
                )}
            </FormItem>
            </Row>
            <Row style={{ paddingBottom: '10px' }}>
              <FormItem
                style={{ height: '20px', marginBottom: '2px' }}
                {...formItemLayout}
                label="联系方式"
              >
                {getFieldDecorator('contactNumber', {
                  initialValue: (storeView && storeView.contactNumber) || '',
                  rules: [{
                    validator: checkPhone,
                  }],
                })(
                  <Input maxLength={'11'}/>
                )}
              </FormItem>
            </Row>
            <Row style={{ paddingBottom: '10px' }}>
              <FormItem
                style={{ height: '20px', marginBottom: '2px' }}
                {...formItemLayout}
                label="投诉电话"
              >
                {getFieldDecorator('comptel', {
                  initialValue: (storeView && storeView.comptel) || '',
                  rules: [{
                    validator: checkPhone,
                  }],
                })(
                  <Input maxLength={'11'}/>
                )}
              </FormItem>
            </Row>
            <Row style={{ paddingBottom: '10px' }}>
              <FormItem
                {...formItemLayout}
                label="门店地址："
                style={{ marginBottom: '10px' }}
              >
                { getFieldDecorator('province', {
                  initialValue: (storeView && storeView.province) || '',
                  rules: [
                    { required: true, message: '请选择省份!' },
                  ],
                  onChange: provinceChange,
                })(
                  <Select placeholder="请选择"
                    style={{ width: '35%' }}
                    dropdownMatchSelectWidth = {false}
                  >
                    <Option key="province" value="">请选择</Option>
                    {
                      provinceList.map((data) => {
                        return <Option key={data.id} value={data.id}>{data.areaName}</Option>;
                      })
                    }
                  </Select>
                )}
                {getFieldDecorator('city', {
                  initialValue: (storeView && storeView.city) || '',
                  rules: [
                    { required: true, message: '请选择城市!' },
                  ],
                  onChange: cityChange,
                })(
                  <Select placeholder="请选择" style={{ width: '30%', marginLeft: '2%' }} dropdownMatchSelectWidth = {false}>
                    <Option key="city" value="">请选择</Option>
                    {
                      cityList.map((data) => {
                        return <Option key={data.id} value={data.id}>{data.areaName}</Option>;
                      })
                    }
                  </Select>
                )}
                {getFieldDecorator('district', {
                  initialValue: (storeView && storeView.district) || '',
                  rules: [
                    { required: true, message: '请选择区域!' },
                  ],
                })(
                  <Select placeholder="请选择" style={{ width: '30%', marginLeft: '2%' }} dropdownMatchSelectWidth = {false}>
                    <Option key="district" value="">请选择</Option>
                    {
                      districtList.map((data) => {
                        return <Option key={data.id} value={data.id}>{data.areaName}</Option>;
                      })
                    }
                  </Select>
                )}
              </FormItem>
              <FormItem {...tailFormItemLayout}>
                {getFieldDecorator('address', {
                  initialValue: (storeView && storeView.address) || '',
                  rules: [{ required: true, message: '请输入详细地址!' }, { max: 120, message: '最多输入120个字符' }],
                })  (
                  <TextArea type="textarea" placeholder="详细地址" maxLength="120" autosize={{ minRows: 4, maxRows: 6 }}/>
                )}
              </FormItem>
            </Row>
          </Col>
        </Row>
      </Modal>
  </div>)
}
export default Form.create()(storeEditModal);
