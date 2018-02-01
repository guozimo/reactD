import React, { PropTypes, Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Select, Button, Radio , Checkbox } from 'antd';
import classnames from 'classnames';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;


class RestaurantSetForm extends Component {
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
      const fields = {...values};

      if (!err) {
        if (fields.provCuisine && fields.provCuisine.length > 0) {
          fields.provCuisine = fields.provCuisine.join(',');
        }

        console.log('Received values of form: ', fields);

        this.props.dispatch({
          type: 'restaurantSet/submit',
          values: fields,
        });
      }
    });
  };

  provinceChange = (value) => {
    this.props.dispatch({
      type: 'restaurantSet/getDistrict',
      provinceId: value,
      getType: 'city'
    });

    this.props.form.resetFields(['city']);
    this.props.form.resetFields(['district']);
    this.props.form.resetFields(['circle']);
  };

  cityChange = (value) => {
    this.props.dispatch({
      type: 'restaurantSet/getDistrict',
      provinceId: value,
      getType: 'area'
    });

    this.props.form.resetFields(['district']);
    this.props.form.resetFields(['circle']);
  };

  districtChange = (value) => {
   /* this.props.dispatch({
      type: 'restaurantSet/getCircle',
      areaCode: value,
    });

    this.props.form.resetFields(['circle']);*/
  };

  formatChange = (value) => {
    this.props.dispatch({
      type: 'restaurantSet/getCookStyle',
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

    const { provinceList, cityList, areaList, circleList, YeTaiList, YeTai, } = this.props;
    console.log("meng",YeTai);

    return (
      <Form onSubmit={this.handleSubmit} style={{ marginTop: 50 }}>
        <FormItem
          {...formItemLayout}
          label="餐厅名称"
          hasFeedback
        >
          {getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入餐厅名称!' }],
          })(
            <Input placeholder="最多30个字" maxLength="30" />
          )}
        </FormItem>
        <FormItem
            {...formItemLayout}
            help={getFieldError('province') || getFieldError('city') || getFieldError('district')}
            validateStatus={
              classnames({
                error: !!getFieldError('province') || !!getFieldError('city') || !!getFieldError('district'),
              })}
            label="餐厅地址"
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

        {
          (circleList && circleList.length > 0) &&
          <FormItem
              {...formItemLayout}
              label="所属商圈"
          >
            {getFieldDecorator('circle')(
                <Select placeholder="请选择" style={{ width: '30%' }} >
                  {
                    this.props.circleList.map((data) => {
                      return <Option key={data.busiCode} value={data.id}>{data.busiName}</Option>;
                    })
                  }
                </Select>
            )}
          </FormItem>
        }


        {/*<FormItem
          {...formItemLayout}
          label="业态"
        >
          {getFieldDecorator('storeFormat', {
            initialValue: YeTai,
            rules: [
              { required: true, message: '请选择业态!' },
            ],
            onChange: this.formatChange,
          })(
            <Select placeholder="请选择" style={{ width: '30%' }} disabled>
              {
                YeTaiList && YeTaiList.map((data) => {
                  return <Option key={data.id} value={data.dictCode.toString()}>{data.dictName}</Option>;
                })
              }
            </Select>
          )}
        </FormItem>*/}
        {/*<FormItem
          {...formItemLayout}
          label="台位"
        >
          {getFieldDecorator('softVersion', {
            rules: [
              { required: true, message: '请选择台位版本!' },
            ],
          })(
            <Select placeholder="请选择">
              <Option value="401">界面有台位(扫码点餐可先支付后下单，也可先下单后结算)</Option>
              <Option value="402">界面无台位(扫码点餐必须先支付后下单)</Option>
            </Select>
          )}
        </FormItem>*/}
        <FormItem
          {...formItemLayout}
          label="联系人"
          hasFeedback
        >
          {getFieldDecorator('contactMan', {
            rules: [{ required: true, message: '请输入联系人!' }],
          })(
            <Input placeholder="请输入联系人" />
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
          label="投诉电话"
        >
          {getFieldDecorator('comptel', {
            validateTrigger: 'onBlur',
            rules: [{ required: true, message: '请输入投诉电话!' },{
            validator: this.checkPhone,
          }],
          })(
            <Input addonBefore={prefixSelector} maxLength="11" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="欢迎语"
          hasFeedback
        >
          {getFieldDecorator('latestNews')(
            <Input placeholder="请输入欢迎语！" maxLength={'50'}/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="备注"
        >
          {getFieldDecorator('storeIntroduction')(
            <Input type="textarea" rows={4}  maxLength="150"/>
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
  const { provinceList, cityList, areaList, circleList, submitBtnLoading, cuisine, YeTaiList, YeTai, } = state.restaurantSet;

  return {
    provinceList,
    cityList,
    areaList,
    circleList,
    submitBtnLoading,
    cuisine,
    YeTaiList,
    YeTai,
  };
}
export default connect(mapStateToProps)(Form.create()(RestaurantSetForm));


