import React, { PropTypes, Component } from 'react';
import { connect } from 'dva';
import { Table, Input, Modal, Form, InputNumber, Button, Popconfirm,} from 'antd';
import { getUserInfo } from '../../../utils/';
import './index.less';

const FormItem = Form.Item;

const { tenantId } = getUserInfo();


class MemberMainContent extends React.Component {

  constructor(props) {
    super(props);
    this.columns = [{
      title: '类型名称',
      dataIndex: 'name',
    },{
      title: '类型级别',
      dataIndex: 'level',
    },{
      title: '会员特权',
      dataIndex: 'memo',
      width: '30%',
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
      list:[],
      loading: false,
      visible: false,
      modal:false,
      formLayout: 'horizontal',
      title:'',
      record:'',
      sure:true,
      id:'',
    };
  }
  showModal = () => {
    this.setState({
      modal: true,
    });
    this.props.form.validateFields((err, values) => {
      console.log(values);
    });
  }
  handleOk = (e) => {
    e.preventDefault();
    this.setState({
      loading: true,
    });
    if(this.state.sure){
      this.props.form.validateFields((err, values) => {
      if (!err) {
        values.tenantId = tenantId;
         this.props.dispatch({
           type: 'memberType/addMemberType',
           values,
         });
        if (this.props.success === true){
          setTimeout(() => {
            this.setState({ modal: false });
          }, 2000);
        };
      }
    });
    }else{
      this.props.form.validateFields((err, values) => {
        if (!err) {
          values.id = this.state.id;
          console.log(values);
          this.props.dispatch({
            type: 'memberType/editMemberType',
            values,
          });
          setTimeout(() => {
            this.setState({ modal: false });
          }, 2000);
        }
      });
    }
    setTimeout(() => {
      this.setState({ loading: false });
    }, 2000);
  }
  handleCancel = () => {
    this.setState({ modal: false });
  }
  onDelete = (record) => {
    const values = {
      name:record.name,
      level:record.level,
      memo:record.memo,
      id:record.id,
    };
    this.props.dispatch({
      type: 'memberType/deleteMemberType',
      values,
    });
  }
  handleAdd = () => {
    this.setState({
      modal: true,
      sure:true,
    });
    this.props.form.setFieldsValue({
      name:'',
      level:'',
      memo:'',
    });
  }
  handleEdit = (record) => {
    this.setState({
      modal: true,
      sure:false,
      id:record.id,
    });
    this.props.form.setFieldsValue({
      name:record.name,
      level:record.level,
      memo:record.memo,
    });
  }
  onChange = (value) => {
    console.log('changed', value);
  }
  render() {
    const columns = this.columns;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const { list, success } = this.props;
    return (
      <div>
        <Button className="editable-add-btn" type="primary" size="large" onClick={this.handleAdd} >新增会员类型</Button>
        <Modal
          visible={this.state.modal}
          title={this.state.sure ? '新增会员类型' : '编辑会员类型'}
          onOk={ this.handleOk }
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" size="large" onClick={this.handleCancel}>取消</Button>,
            <Button key="submit" type="primary" size="large" loading={this.state.loading} onClick={this.handleOk}>
              保存
            </Button>,
          ]}
        >
          <Form >
            <FormItem
              {...formItemLayout}
              label="类型名称"
              hasFeedback
            >
              {getFieldDecorator('name', {
                rules: [
                  { required: true, max: 60, message: '请输入类型名称', },
                ],})(
                <Input placeholder="最多60个字,且类型名称不能重复"/>
              )}
            </FormItem>


            <FormItem
              {...formItemLayout}
              label="类型级别"
            >
              {getFieldDecorator('level', { rules: [
                { required: true, message: '请输入类型级别', },
              ],})(
                <InputNumber min={0} max={9999}/>
              )}
              <span className="ant-form-text">级别越高数字越大,最大为9999</span>
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="会员特权"
            >
              {getFieldDecorator('memo', { rules: [
                { required: true, max: 256, message: '请输入会员特权', },
              ],})(
                <Input type="textarea" rows={4} placeholder="最多256个字"/>
              )}
            </FormItem>
          </Form>
        </Modal>
        <Table rowKey={record => record.id} bordered dataSource={ list } columns={columns} className="member"/>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { list, success } = state.memberType;

  return {
    list,
    success,
  };
}

export default connect(mapStateToProps)(Form.create()(MemberMainContent));
