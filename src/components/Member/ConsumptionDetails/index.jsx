import React, { PropTypes, Component } from 'react';
import { connect } from 'dva';
import ConsumeTable from './table';
import { Form, Row, Col, Input, Select, Button, TreeSelect, DatePicker  } from 'antd';
import { getUserInfo } from '../../../utils';

const { MonthPicker, RangePicker } = DatePicker;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
const FormItem = Form.Item;
const Option = Select.Option;


class MemberDetails extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      excelValue: {},
    };
  }

  checkPhone (rule, valuePhone, callback) {
    if (valuePhone && !(/^1[34578]\d{9}$/.test(valuePhone))) {
      callback('请输入正确的手机格式!');
    } else {
      callback();
    }
  }

  // 提交搜索
  handleSearch = (e) => {

    e.preventDefault();

    this.props.form.validateFields((err, fieldsValue) => {

      if (err) {
        return;
      }

      // 格式化数据格式
      const rangeValue = fieldsValue['range-picker'];

      const values = {
        ...fieldsValue,
        storeIds: fieldsValue['storeIds'] ? fieldsValue['storeIds'].join(',') : '',
        d: rangeValue[0].format('YYYY-MM-DD'),
        e: rangeValue[1].format('YYYY-MM-DD'),
      };

      this.excelValue = {
        d: rangeValue[0].format('YYYY-MM-DD'),
        e: rangeValue[1].format('YYYY-MM-DD'),
        storeIds: fieldsValue.storeIds ? fieldsValue.storeIds : [],
        memberType: fieldsValue.memberType ? fieldsValue.memberType : '',
        name: fieldsValue.name ? fieldsValue.name : '',
        mobile: fieldsValue.mobile ? fieldsValue.mobile : '',
        memberCard: fieldsValue.memberCard ? fieldsValue.memberCard : '',
      };


      delete values['range-picker'];

      this.props.dispatch({
        type: 'consumptionDetails/fetchRechargeReport',
        values,
      })
    });
  }

  // 门店数据处理
  aclStore = (list) => {
    let { tenName, id } = getUserInfo();
    let arr = [{
      label: tenName,
      value: null,
      key: id,
      children: []
    }];

    list.forEach((item) => {
      arr[0].children.push({
        label: item.name,
        value: item.id,
        key: item.id,
      })
    });
    return arr;
  };

  // 导出表格
  exportExcel = (excelValue) => {
    console.log(excelValue);
    if (excelValue) {
      this.props.dispatch({
        type: 'consumptionDetails/exportExcel',
        excelValue,
      });
    } else {
      console.log(2);
    }
  };
  onChange = (value) => {
    this.setState({ value });
  }
  render() {
    const { rechargeReportList, typeList, aclStoreList, loading } = this.props;

    const consumeRrcharge = {
      rechargeReportList,
      loading,
    };

    const typeOptions = [];
    typeList.forEach((item) => {
      typeOptions.push(<option key={item.id}>{item.name}</option>);
    });
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
    };

    // 获取门店数据
    const treeData = this.aclStore(aclStoreList);

    const tProps = {
      treeData,
      value: this.state.value,
      onChange: this.onChange,
      multiple: true,
      treeCheckable: true,
      showCheckedStrategy: SHOW_PARENT,
      searchPlaceholder: '请选择门店',
      style: {
        width: 300,
      },
    };

    return (
      <div>
        <Form
          onSubmit={this.handleSearch}
        >
          <Row>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label="消费门店"
              >{getFieldDecorator('storeIds', {
                // initialValue: initData.tenLinkman,
              })(
                <TreeSelect {...tProps} />
              )}
              </FormItem>
            </Col>
            <Col span={3} offset={13} >
              <FormItem {...formItemLayout}>
                <Button type="primary" htmlType="submit" size="large"  onClick={() => this.exportExcel(this.excelValue)}>导出表格</Button>
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label="消费日期"
              >{getFieldDecorator('range-picker', {
                rules: [{
                  type: 'array',
                  required: true,
                  message: '请选择时间！'
                }]
              })(
                <RangePicker />
              )}
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label="会员类型"
              >
                {getFieldDecorator('memberType', {
                  // initialValue: initData.tenLinkman,
                })(
                  <Select placeholder="请选择" >
                    <Option  value="">请选择</Option>
                    {typeOptions}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={8} >
              <FormItem
                {...formItemLayout}
                label="手机号"
              >
                {getFieldDecorator('mobile', {
                  // initialValue: initData.tenLinkman,
                  validateTrigger: 'onBlur',
                  rules: [{
                    validator: this.checkPhone,
                  }],
                })(
                  <Input placeholder="请输入手机号" maxLength="11" />
                )}
              </FormItem>
            </Col>
            <Col span={8} >
              <FormItem
                {...formItemLayout}
                label="姓名"
              >
                {getFieldDecorator('name', {
                  // initialValue: initData.tenLinkman,
                })(
                  <Input placeholder="请输入姓名" maxLength="10" />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={8} >
              <FormItem
                {...formItemLayout}
                label="会员卡号"
              >
                {getFieldDecorator('memberCard', {
                  // initialValue: initData.tenLinkman,
                })(
                  <Input placeholder="请输入会员卡号" maxLength="20" />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12} offset={21} >
              <FormItem {...formItemLayout}>
                <Button type="primary" htmlType="submit" size="large" loading={this.props.submitBtnLoading}>查询</Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
        <ConsumeTable { ...consumeRrcharge } />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { rechargeReportList, typeList, aclStoreList } = state.consumptionDetails;

  return {
    loading: state.loading.consumptionDetails,
    rechargeReportList,
    typeList,
    aclStoreList,
  };
}

const MemberDetailsContent = Form.create()(MemberDetails);
export default connect(mapStateToProps)(MemberDetailsContent);
