import React, { PropTypes, Component } from 'react';
import { connect } from 'dva';
import { Table, Input, Select, Modal, Form, Button, Radio, DatePicker, InputNumber, Popconfirm} from 'antd';
import moment from 'moment';
import { getUserInfo } from '../../../utils/';
import './rechargeRule.less';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

const { tenantId } = getUserInfo();


class RechargeRuleForm extends React.Component {

  constructor(props) {
    super(props);
    this.columns = [{
      title: '规则名称',
      dataIndex: 'name',
    },{
      title: '起始日期',
      dataIndex: 'startTimeStr',
    },{
      title: '截止日期',
      dataIndex: 'endTimeStr',
    },{
      title: '起始金额',
      dataIndex: 'minVol',
    },{
      title: '截止金额',
      dataIndex: 'maxVol',
    },{
      title: '赠送金额(元)',
      dataIndex: 'recharge',
    },{
      title: '赠送比例(%)',
      dataIndex: 'rate',
    },  {
      title: '操作',
      dataIndex: 'operation',
      render: (text, record, index) => {
        return (
              <div>
                <a onClick={() => this.handleEdit(record)} >编辑</a>
                <span> </span>
                <Popconfirm title="确定执行当前操作吗?" onConfirm={() => this.onDelete( record,index)}>
                  <a href="#">删除</a>
                </Popconfirm>
              </div>
        );
      },
    }];
    this.state = {
      loading: false,
      visible: false,
      modal: false,
      formLayout: 'horizontal',
      title:'',
      record:'',
      sure: true,  // true 添加，false 修改
      id:'',
      typeId:'',
      nowPage: 1,
      nowSize: 10,
      minVol:0,
      maxVol:Number.POSITIVE_INFINITY,
      startValue: null,
      endValue: null,
      endOpen: false,
    };
  }
  //气泡确认框

  onDelete = (record) => {
    const values = {
      memberTypeId: record.typeId,
      name: record.name,
      startTime: record.startTime,
      endTime: record.endTime,
      minVol: record.minVol,
      maxVol: record.maxVol,
      type: record.type,
      recharge: record.recharge,
      rate: record.rate,
      id: record.id,
    };
    this.props.dispatch({
      type: 'rechargeRule/deleteList',
      values,
    });
    this.props.dispatch({
      type: 'rechargeRule/fetchList',
      values:{
        memberTypeId:this.state.typeId,
        rows: this.state.nowSize,
        page: this.state.nowPage,
      },
    });
  };

  // 保存
  handleOk = (e) => {
    this.setState({
      loading: true,
    });
    e.preventDefault();
    if(this.state.sure){
      this.props.form.validateFields((err, fieldsValue) => {
        if (!err) {
          fieldsValue.maxVol *= 100;
          fieldsValue.minVol *= 100;
          if(fieldsValue.recharge){
            fieldsValue.recharge *= 100;
          }
          if( !fieldsValue.type ){
            fieldsValue.type = 0;
          }
          console.log(fieldsValue.type);
          const values = {
            ...fieldsValue,
            startTime: new Date(fieldsValue.startTime),
            endTime: new Date(fieldsValue.endTime),
            tenantId: tenantId,
          };
          this.props.dispatch({
            type: 'rechargeRule/addList',
            values,
          });
          this.state.typeId = fieldsValue.memberTypeId;
          console.log(fieldsValue.memberTypeId)
          console.log(this.state.typeId)
          setTimeout(() => {
            this.props.dispatch({
              type: 'rechargeRule/fetchList',
              values:{
                memberTypeId: fieldsValue.memberTypeId,
                rows: this.state.nowSize,
                page: this.state.nowPage,
              },
            });
            this.setState({ modal: false });
          }, 2000);
        }
      });
    }else{
      this.props.form.validateFields((err, fieldsValue) => {
        fieldsValue.maxVol *= 100;
        fieldsValue.minVol *= 100;
        if(fieldsValue.recharge){
          fieldsValue.recharge *= 100;
        }
        if(fieldsValue.type === 2){
          fieldsValue.rate = null;
        }
        if(fieldsValue.type === 1){
          fieldsValue.recharge =null;
        }
        if(!fieldsValue.type ){
          fieldsValue.type = 0;
        }
        console.log(fieldsValue.type);
        if (!err) {
          const values = {
            ...fieldsValue,
            id: this.state.id,
            startTime: new Date(fieldsValue.startTime),
            endTime: new Date(fieldsValue.endTime),
            tenantId: tenantId,
          };

          this.props.dispatch({
            type: 'rechargeRule/editList',
            values,
          });
          this.state.typeId = fieldsValue.memberTypeId;
          setTimeout(() => {
            this.props.dispatch({
              type: 'rechargeRule/fetchList',
              values:{
                memberTypeId: fieldsValue.memberTypeId,
                rows: this.state.nowSize,
                page: this.state.nowPage,
              },
            });
            this.setState({ modal: false });
          }, 2000);
        }
      });
    }
    setTimeout(() => {
      this.setState({ loading: false });
    }, 2000);
  };

  // 取消
  handleCancel = () => {
    this.setState({ endOpen:false,modal: false, });
  };


  // 添加
  handleAdd = () => {
    this.setState({
      modal: true,
      sure: true,
      startValue: null,
      endValue: null,
      endOpen: false,
    });
    this.props.form.setFieldsValue({
      memberTypeId: this.state.typeId,
      name:'',
      startTime:'',
      endTime:'',
      minVol:'',
      maxVol:'',
      type:'',
      recharge:'',
      rate:'',

    });
  };

  // 编辑
  handleEdit = (record) => {
    this.setState({
      modal: true,
      sure:false,
      id: record.id,
      value: record.type,
      startTimeStr: record.startTimeStr,
      endTimeStr: record.endTimeStr,
    });

    this.props.form.setFieldsValue({
      memberTypeId: this.state.typeId,
      name: record.name,
      minVol: record.minVol,
      maxVol: record.maxVol,
      type: record.type,
      recharge: record.recharge,
      startTime: moment(record.startTimeStr),
      endTime: moment(record.endTimeStr),
    });

    setTimeout(() => {
      this.props.form.setFieldsValue({
        rate: record.rate,
        recharge: record.recharge,
      });
    }, 200);
  };

  handleChange = (value) => {
    this.state.typeId = value;
    this.props.dispatch({
      type:"rechargeRule/fetchList",
      values:{
        memberTypeId: this.state.typeId,
        rows: this.state.nowSize,
        page: this.state.nowPage,
      },
    })
  };

  //最大金额 > 最小金额
  onChangeMin = (value) => {
    this.state.minVol = value;
  };
  onChangeMax = (value) => {
    this.state.maxVol = value;
  };
  //日期 起始日期 < 终止日期
  disabledStartDate = (startValue) => {
    const endValue = this.state.endValue;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  }

  disabledEndDate = (endValue) => {
    const startValue = this.state.startValue;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  }

  onChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  }

  onStartChange = (value) => {
    this.onChange('startValue', value);
  }

  onEndChange = (value) => {
    this.onChange('endValue', value);
  }

  handleStartOpenChange = (open) => {
    if (!open) {
      this.setState({ endOpen: true });
    }
  }

  handleEndOpenChange = (open) => {
    this.setState({ endOpen: open });
  };
  render() {

    let self = this;
    const table ={
      onChangeTable(page) {
        console.log(self.state)
        let values = {
          page: page,
          rows: self.state.nowSize,
          memberTypeId:self.state.typeId,
        };
        self.state.nowPage = page;
        self.props.dispatch({
          type: 'rechargeRule/fetchList',
          values
        });
      },
      onShowSizeChange(current, pageSize) {
        console.log(self.state)
        let values = {
          page: current,
          rows: pageSize,
          memberTypeId:self.state.typeId,
        };
        self.state.nowSize = pageSize;
        self.state.nowPage = current;
        console.log(self.state);
        self.props.dispatch({
          type: 'rechargeRule/fetchList',
          values
        });
      }
    }





    const columns = this.columns;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const { list,typeList } = this.props;
    const typeOptions = [];
    typeOptions.push(<Option key="" value="">请选择</Option>);
    if(typeList){
      typeList.forEach((item) => {
        typeOptions.push(<Option key={item.id} value={item.id} >{item.name}</Option>);
      });
    }
    const { startValue, endValue, endOpen } = this.state;
    return (
      <div>
        <div>
          <span>会员类型：</span>
          <Select  style={{ width: 200 }}  value={this.state.typeId} onChange={this.handleChange} >
            {typeOptions}
          </Select>
        </div>
        <Button className="editable-add-btn" type="primary" size="large" onClick={this.handleAdd} >新增规则明细</Button>
        <Modal
          title={this.state.sure ? '新增规则明细' : '修改规则明细'}
          visible={this.state.modal}
          okText="保存"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" size="large" onClick={this.handleCancel}>取消</Button>,
            <Button key="submit" type="primary" size="large" loading={this.state.loading} onClick={this.handleOk}>
              保存
            </Button>,
          ]}
        >
          <Form horizontal >
            <FormItem
              {...formItemLayout}
              label="会员类型"
            >{
              getFieldDecorator('memberTypeId', {
                rules: [{ required: true, message: '请选择会员类型' }],
              })( <Select  style={{ width: 200 }}  >
                {typeOptions}
              </Select>)
            }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="规则名称"
            >{
              getFieldDecorator('name', {
                rules: [{ required: true, message: '请选择规则名称' }],
              })(<Input />)
            }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="规则生效开始日期"
            >{
              getFieldDecorator('startTime',{
                rules: [{ required: true, message: '请选择规则生效开始日期' }],
              })(<DatePicker
                disabledDate={this.disabledStartDate}
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                value={startValue}
                placeholder="请选择日期"
                onChange={this.onStartChange}
                onOpenChange={this.handleStartOpenChange}
              />)
            }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="规则生效截止日期"
            >{
              getFieldDecorator('endTime', {
                rules: [{ required: true, message: '请选择规则生效截止日期' }],
              })(<DatePicker
                disabledDate={this.disabledEndDate}
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                value={endValue}
                placeholder="请选择日期"
                onChange={this.onEndChange}
                open={endOpen}
                onOpenChange={this.handleEndOpenChange}
              />)
            }
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="金额 ＞"
            >{getFieldDecorator('minVol', {
              rules: [{ required: true, message: '请选择最低金额' }],
            })(<InputNumber min={0} max={this.state.maxVol-0.01} step={0.01} onChange = {this.onChangeMin }/>)
            }
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="金额 ≤ "
            >{
              getFieldDecorator('maxVol', {
                rules: [{ required: true, message: '请选择最高金额', }],
              })(<InputNumber min={this.state.minVol+0.01} step={0.01} onChange = {this.onChangeMax }/>)
            }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="赠送方式"
            >
              {
                getFieldDecorator('type',{
                })(<RadioGroup>
                  <Radio value={1}>按比例</Radio>
                  <Radio value={2}>按金额</Radio>
                </RadioGroup>)
              }
            </FormItem>
            { this.props.form.getFieldValue('type') === 2 &&
            <FormItem
              {...formItemLayout}
              label="赠送金额"
            >
              {
                getFieldDecorator('recharge', {
                })(
                  <InputNumber
                    min="0.00"
                    step="0.01"
                  />)
              }
            </FormItem>
            }

            { this.props.form.getFieldValue('type') === 1 &&
            <FormItem
              {...formItemLayout}
              label="赠送比例"
            >
              {
                getFieldDecorator('rate', {
                })(
                  <InputNumber
                    min={0}
                    max={10000}
                    formatter={value => `${value}%`}
                    parser={value => value.replace('%', '')}
                  />)
              }
            </FormItem>
            }
          </Form>
        </Modal>
        <Table bordered
               className="member"
               dataSource={ list.data }
               columns={columns}
               pagination={{
                 onChange: table.onChangeTable,
                 total: list.totalCount,
                 pageSize:list.limit,
                 showSizeChanger: true,
                 onShowSizeChange: table.onShowSizeChange,
                 showQuickJumper:true,
               }}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { list, typeList, } = state.rechargeRule;

  return {
    list,
    typeList,
  };
}

export default connect(mapStateToProps)(Form.create()(RechargeRuleForm));
