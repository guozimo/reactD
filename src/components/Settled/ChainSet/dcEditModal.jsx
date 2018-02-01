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
function dcEditModal({
  dispatch,
  dcView,
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
  const onOk = () => {
    validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'chainSet/saveEditDc',
          values: {
          	...dcView,
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
            storeId: dcView.id,
          },
        });
      }
    });
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
        title="编辑配送中心"
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
                label="机构名称："
              >
                {getFieldDecorator('name', {
                  initialValue: (dcView && dcView.name) || '',
                })(
                  <Input disabled={true}/>
                )}
            	</FormItem>
            </Row>
            <Row style={{ paddingBottom: '10px' }}>
            	<FormItem
                style={{ height: '20px', marginBottom: '2px' }}
                {...formItemLayout}
                label="机构编号："
              >
                {getFieldDecorator('orgCode', {
                  initialValue: (dcView && dcView.orgCode) || '',
                })(
                  <Input disabled={true}/>
                )}
            	</FormItem>
            </Row>
            <Row style={{ paddingBottom: '10px' }}>
              <FormItem
                style={{ height: '20px', marginBottom: '2px' }}
                {...formItemLayout}
                label="机构类型："
              >
                {getFieldDecorator('orgCode', {
                  initialValue: '配送中心',
                })(
                  <Input disabled={true}/>
                )}
            	</FormItem>
            </Row>
            <Row style={{ paddingBottom: '10px' }}>
              <FormItem
                style={{ height: '20px', marginBottom: '2px' }}
                {...formItemLayout}
                label="上级机构："
              >
                {getFieldDecorator('orgCode', {
                  initialValue: (dcView && dcView.parentName) || '',
                })(
                  <Input disabled={true}/>
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
                  initialValue: (dcView && dcView.contactMan) || '',
                  rules: [{
                    required: true, message: '请输入联系人',
                    max: 20, message: '最多不超过20个字符'
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
                  initialValue: (dcView && dcView.contactNumber) || '',
                  rules: [{
                    validator: checkPhone,
                  }],
                })(
                  <Input  maxLength={'11'}/>
                )}
              </FormItem>
            </Row>
            <Row style={{ paddingBottom: '10px' }}>
              <FormItem
                {...formItemLayout}
                label="配送中心地址"
                style={{ marginBottom: '10px' }}
              >
                { getFieldDecorator('province', {
                  initialValue: (dcView && dcView.province) || '',
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
                  initialValue: (dcView && dcView.city) || '',
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
                  initialValue: (dcView && dcView.district) || '',
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
                  initialValue: (dcView && dcView.address) || '',
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
export default Form.create()(dcEditModal);
