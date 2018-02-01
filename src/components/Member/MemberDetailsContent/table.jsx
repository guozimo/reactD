import React, { PropTypes, Component } from 'react';
import { Form, Input, Table, Button, Radio,  Modal, Select, Pagination } from 'antd';
import moment from 'moment'
import vipGender from '../../../common/All'

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const RadioButton = Radio.Button;


class MemberDetailsTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      formLayout: 'horizontal',
      value:'',
      status:'',
    }
  }
  operate = (record,index) => {
    console.log(record);
    if(record.status === 'effective'){
      this.state.status = 'notEffective';
    }else{
      this.state.status = 'effective';
    }
    let values ={
      id :record.id,
      status:this.state.status,
    }
    this.props.dispatch({
      type: 'memberDetails/updateStatus',
      values
    })
    let value ={
      page:1,
      rows:10,
    }
    // if(order||type){
    //   value.orderProperty=order;
    //   value.memberTypeId=type;
    // }
    this.props.dispatch({
      type: 'memberDetails/fetchList',
      values: value,
    })

  }
  showModal = (record,index) => {
    this.setState({
      visible: true,
    });
    this.state.value = record.sex;
    this.props.form.setFieldsValue({
      memberTypeName:record.memberTypeName,
      mobile:record.mobile,
      name:record.name,
      birthday:moment(record.birthday).format('YYYY-MM-DD'),
      storeName:record.storeName,
      sum:record.sum/100,
      email:record.email,
      address:record.address,
  });
  }
  handleCancel = () => {
    this.setState({ visible: false });
    this.props.form.validateFields((err, values) => {
       console.log(values);
    });
  }


  render() {
    const { getFieldDecorator } = this.props.form;
    const { list, onChangeTable, onShowSizeChange } = this.props;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const { formLayout } = this.state;

    const columns = [{
      title: '会员类型',
      dataIndex: 'memberTypeName',
      key: 'memberTypeName',
    },{
      title: '会员卡号',
      dataIndex: 'memberCard',
      key: 'memberCard',
    }, {
      title: '手机号',
      dataIndex: 'mobile',
      key: 'mobile',
    }, {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },{
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text, record, index)=> {
        return (
          <span>{record.status === 'effective' ? '正常' : '冻结'}</span>
        );
      },
    },{
      title: '性别',
      dataIndex: 'sex',
      key: 'sex',
      render: (text, record, index)=> {
        console.log(vipGender[record.sex]);
        return (
          <span>{vipGender[record.sex]}</span>
        );
      },
    },{
      title: '生日',
      dataIndex: 'birthday',
      key: 'birthday',
      render: (text, record, index)=> {
        return (
          <span>{ record.birthday ? moment(record.birthday).format('YYYY-MM-DD'):''}</span>
        );
      },
    },{
      title: '余额',
      dataIndex: 'sum',
      key: 'sum',
      render: (text, record, index)=> {
        return (
          <span>{ record.sum/100 }</span>
        );
      },
    },{
      title: '操作',
      dataIndex: 'operate',
      key: 'operate',
      render: (text, record, index) => {
        return (
          <div>
            <a  onClick={() => this.showModal(record,index)}>查看</a>
            <span> </span>
            <a onClick={() => this.operate(record,index)} >{record.status === 'effective' ? '停用' : '启用'}</a>
          </div>

        );
      },
    }];
    return(
      <div>
        <div className="search-result-list">
          <Table
            columns={columns}
            dataSource={list.data}
            bordered
            pagination={{
              onChange: onChangeTable,
              total: list.totalCount,
              pageSize:list.limit,
              showSizeChanger: true,
              onShowSizeChange: onShowSizeChange,
              showQuickJumper:true,
            }}
          />
          <Modal
            visible={this.state.visible}
            title="会员资料"
            onCancel={this.handleCancel}
            footer={[
              <Button key="back" size="large" onClick={this.handleCancel}>返回</Button>,
            ]}
          >

            <Form layout={formLayout}>
              <FormItem
                {...formItemLayout}
                label="会员类型"
              >
                {getFieldDecorator('memberTypeName', {
                })(
                  <Input readOnly/>
                )}
              </FormItem>

              <FormItem
                {...formItemLayout}
                label="手机号"
              >
                {getFieldDecorator('mobile', {
                })(
                  <Input readOnly/>
                )}
              </FormItem>

              <FormItem
                {...formItemLayout}
                label="姓名"
              >
                {getFieldDecorator('name',{ })(
                  <Input  readOnly />
                )}
              </FormItem>

              <FormItem
                {...formItemLayout}
                label="性别"
              >
                {getFieldDecorator('sex' , {initialValue: this.state.value})(
                  <RadioGroup disabled>
                    <Radio value='MALE' >男</Radio>
                    <Radio value='FEMALE' >女</Radio>
                  </RadioGroup>
                )}
              </FormItem>

              <FormItem
                {...formItemLayout}
                label="出生日期"
              >
                {getFieldDecorator('birthday')(
                  <Input readOnly />
                )}
              </FormItem>

              <FormItem
                {...formItemLayout}
                label="注册门店"
              >
                {getFieldDecorator('storeName')(
                  <Input readOnly />
                )}
              </FormItem>

              <FormItem
                {...formItemLayout}
                label="卡余额"
              >
                {getFieldDecorator('sum')(
                  <Input readOnly />
                )}
              </FormItem>

              <FormItem
                {...formItemLayout}
                label="邮箱"
              >
                {getFieldDecorator('email', {
                })(
                  <Input readOnly />
                )}
              </FormItem>

              <FormItem
                {...formItemLayout}
                label="邮寄地址"
              >
                  {getFieldDecorator('address', {
                  })(
                    <Input type="textarea" placeholder="input placeholder" readOnly />
                  )}
              </FormItem>
            </Form>
          </Modal>
        </div>
      </div>
    );
  }
}

export default Form.create()(MemberDetailsTable);
