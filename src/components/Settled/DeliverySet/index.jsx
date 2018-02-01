import React, { PropTypes, Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Select, Button, Radio , Checkbox } from 'antd';
import classnames from 'classnames';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;

const TYPE_CODE = [
  {
    "code" : "244",
    "name" : "火锅",
  },
  {
    "code" : "241",
    "name" : "中餐",
  },
  {
    "code" : "242",
    "name" : "快餐",
  },
  {
    "code" : "245",
    "name" : "烧烤",
  },
  {
    "code" : "246",
    "name" : "休闲茶饮",
  },
  {
    "code" : "247",
    "name" : "休闲食品",
  },
  {
    "code" : "248",
    "name" : "烘焙糕点",
  },
  {
    "code" : "249",
    "name" : "汤/粥/煲/炖菜",
  },
  {
    "code" : "243",
    "name" : "其他美食",
  },
  {
    "code" : "250",
    "name" : "小吃",
  },
];

class DeliverySetForm extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    form: PropTypes.object,
    provinceList: PropTypes.array,
    cityList: PropTypes.array,
    areaList: PropTypes.array,
    circleList: PropTypes.array,
    submitBtnLoading: PropTypes.bool,
    cuisine: PropTypes.array,
  };

  constructor(props) {
    super(props);

    this.state = {
       passwordDirty: false,
    };
  }

  checkPhone (rule, value, callback) {
    if (value && !(/^1[34578]\d{9}$/.test(value))&& !(/^[0][0-9]{9,11}$/.test(value))) {
      callback('请输入正确的手机格式!');
    } else {
      callback();
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      const fields = {
        ...values,
        parentId: this.props.parent.id};

      if (!err) {
        if (fields.provCuisine && fields.provCuisine.length > 0) {
          fields.provCuisine = fields.provCuisine.join(',');
        }

        console.log('Received values of form: ', fields);

        this.props.dispatch({
          type: 'deliverySet/submit',
          values: fields,
        });
      }
    });
  };

  provinceChange = (value) => {
    this.props.dispatch({
      type: 'deliverySet/getDistrict',
      provinceId: value,
      getType: 'city'
    });

    this.props.form.resetFields(['city']);
    this.props.form.resetFields(['district']);
    this.props.form.resetFields(['circle']);
  };

  cityChange = (value) => {
    this.props.dispatch({
      type: 'deliverySet/getDistrict',
      provinceId: value,
      getType: 'area'
    });

    this.props.form.resetFields(['district']);
    this.props.form.resetFields(['circle']);
  };

  districtChange = (value) => {
    /*this.props.dispatch({
      type: 'deliverySet/getCircle',
      areaCode: value,
    });
    this.props.form.resetFields(['circle']);*/
  };

  formatChange = (value) => {
    this.props.dispatch({
      type: 'deliverySet/getCookStyle',
      dictCode: value,
    });
  };

  render() {
    const { getFieldDecorator, getFieldError } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 8},
    };
    const tailFormItemLayout = {
      wrapperCol: {
        span: 8,
        offset: 6,
      },
    };
    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: '86',
    })(
      <Select className="icp-selector" style={{ width: 60 }}>
        <Option value="86">+86</Option>
      </Select>
    );

    const { provinceList, cityList, areaList, parent } = this.props;
    return (
      <Form onSubmit={this.handleSubmit} style={{ marginTop: 50 }}>

        <FormItem
          {...formItemLayout}
          label="机构名称"
          hasFeedback
        >
          {getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入机构名称!' }],
          })(
            <Input placeholder="请输入机构名称" maxLength="20" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="机构类型"
        >
          {getFieldDecorator('storeType',{
            initialValue: "配送中心",
            rules: [{ required: true}],
          })(
            <Input  maxLength="30"  disabled />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="上级机构"
        >
          {getFieldDecorator('storeProp',{
            initialValue: parent.tenName,
            rules: [{ required: true}],
          })(
            <Input  maxLength="30"  disabled/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="联系人"
          hasFeedback
        >
          {getFieldDecorator('contactMan', {
            rules: [{ required: true, message: '请输入联系人!' }],
          })(
            <Input placeholder="请输入联系人" maxLength="20"/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="联系方式"
        >
          {getFieldDecorator('contactNumber', {
            validateTrigger: 'onBlur',
            rules: [{ required: true, message: '请输入联系方式!' },{
              validator: this.checkPhone,
            }],
          })(
            <Input addonBefore={prefixSelector} maxLength="11" />
          )}
        </FormItem>
        <FormItem
            {...formItemLayout}
            help={getFieldError('province') || getFieldError('city') || getFieldError('district')}
            validateStatus={
              classnames({
                error: !!getFieldError('province') || !!getFieldError('city') || !!getFieldError('district'),
              })}
            label="配送中心地址"
        >
          { getFieldDecorator('province', {
            rules: [
              { required: true, message: '请选择省份!' },
            ],
            onChange: this.provinceChange,
          })(
              <Select placeholder="请选择"
                      style={{ width: '35%' }}>
                <Option key="province" value="">请选择</Option>
                {
                  provinceList && provinceList.map((data) => {
                    return <Option key={data.id} value={data.id}>{data.areaName}</Option>;
                  })
                }
              </Select>
          )}
          {getFieldDecorator('city', {
            rules: [
              { required: true, message: '请选择城市!' },
            ],
            onChange: this.cityChange,
          })(
              <Select placeholder="请选择" style={{ width: '30%', marginLeft: '2%' }} >
                <Option key="city" value="">请选择</Option>
                {
                  cityList && cityList.map((data) => {
                    return <Option key={data.id} value={data.id}>{data.areaName}</Option>;
                  })
                }
              </Select>
          )}
          {getFieldDecorator('district', {
            rules: [
              { required: true, message: '请选择区域!' },
            ],
            onChange: this.districtChange,
          })(
              <Select placeholder="请选择" style={{ width: '30%', marginLeft: '2%' }} >
                <Option key="district" value="">请选择</Option>
                {
                  areaList && areaList.map((data) => {
                    return <Option key={data.id} value={data.id}>{data.areaName}</Option>;
                  })
                }
              </Select>
          )}
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          {getFieldDecorator('address', {
            rules: [{ required: true, message: '请输入详细地址!' }],
          })  (
            <Input type="textarea" maxLength="120" placeholder="详细地址"  />
          )}
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" size="large" loading={this.props.submitBtnLoading}>保存</Button>
        </FormItem>
      </Form>
    );
  }
}

function mapStateToProps(state) {
  const { provinceList, cityList, areaList, circleList, submitBtnLoading, cuisine, parent } = state.deliverySet;

  return {
    provinceList,
    cityList,
    areaList,
    circleList,
    submitBtnLoading,
    cuisine,
    parent,
  };
}
export default connect(mapStateToProps)(Form.create()(DeliverySetForm));


