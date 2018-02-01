import React, { PropTypes, Component } from 'react';
import { connect } from 'dva';
import MemberDetailsTable from './table';
import MemberDetailsModal from './modal';
import { Form, Row, Col, Input, Select, Button } from 'antd';
import './index.less';

const FormItem = Form.Item;
const Search = Input.Search;
const Option = Select.Option;



class MemberDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      expand: false,
      current: 1,
      order:'',
      type:'',
      nowPage:1,
      nowSize:10,
    };
  }
  showModal = () => {
    this.props.dispatch({
      type: 'memberDetails/modalShow'
    });
  }
  hideModal = () => {
    this.props.dispatch({
      type: 'memberDetails/modalHide'
    });
  }
  downloadTemplate = () => {
    this.props.dispatch({
      type: 'memberDetails/downloadTemplate'
    });
  }
  fetchList = () => {
    this.props.form.setFieldsValue({
      queryString: '',
    });
    this.setState({
      order:'',
      type:'',
      nowPage:1,
      nowSize:10,
    });
    let values ={
      orderProperty:this.state.order,
      memberTypeId:this.state.type,
      page: this.state.nowPage,
      rows: this.state.nowSize,
    }
    this.props.dispatch({
      type: 'memberDetails/fetchList',
      values
    });
  }
  toggle = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand });
  }

  handleChangeOrder = (value) => {
    this.setState({
      order: value,
    });
    this.props.form.setFieldsValue({
      queryString: '',
    });
    let values ={
      orderProperty:value,
      memberTypeId:this.state.type,
      page: this.state.nowPage,
      rows: this.state.nowSize,
    }
    this.props.dispatch({
      type: 'memberDetails/fetchList',
      values
    });
  }
  handleChangeType = (value) => {
    this.setState({
      type:value,
    });
    this.props.form.setFieldsValue({
      queryString: '',
    });
    let values ={
      page: this.state.nowPage,
      rows: this.state.nowSize,
      orderProperty:this.state.order,
      memberTypeId:value,
    }
    this.props.dispatch({
      type: 'memberDetails/fetchList',
      values
    });
  }

  Search = (value) => {
    let values = {
      queryString: value,
    };
    this.props.form.setFieldsValue({
      order: '',
      type: '',
    });
    this.props.dispatch({
      type: 'memberDetails/searchList',
      values
    });
  }
  render() {
    let self = this;
    const { list, typeList , modalVisible , dispatch , order, type, nowPage, nowSize } = this.props;
    const MemberDetailsModalProps = {
      modalVisible,
      hideModal: this.hideModal,
      downloadTemplate : this.downloadTemplate,
      fetchList : this.fetchList
    }
    const MemberDetailsTableProps = {
      list,
      onChangeTable(page) {
        let values = {
          page: page,
          rows: self.state.nowSize,
        }
        self.state.nowPage = page;
        if(self.state.order||self.state.type){
          values.orderProperty=self.state.order;
          values.memberTypeId=self.state.type;
        }
        self.props.dispatch({
          type: 'memberDetails/fetchList',
          values
        });
      },
      onShowSizeChange(current, pageSize) {
        let values = {
          page: current,
          rows: pageSize
        }
        self.state.nowSize = pageSize;
        if(self.state.order||self.state.type){
          values.orderProperty=self.state.order;
          values.memberTypeId=self.state.type;
        }
        self.props.dispatch({
          type: 'memberDetails/fetchList',
          values
        });
      }
    };
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
    };
    const typeOptions = [];
    typeOptions.push(<option key="" value="">请选择</option>);
    typeList.forEach((item) => {
      typeOptions.push(<option key={item.id} value={item.id} >{item.name}</option>);
    });

    return (
      <div>
        <Form
          className="ant-advanced-search-form"
        >
          <Row gutter={40}>
            <Col span={8} key={1}>
              <Button type="primary" size="large" style={{ marginBottom: 20 }} onClick={ this.showModal }>会员导入</Button>
            </Col>
          </Row>
        </Form>
        <Form
          className="ant-advanced-search-form"
        >
          <Row gutter={40}>
            <Col span={8} key={2}>
              <FormItem {...formItemLayout} label={`精准搜索 `}>
                {getFieldDecorator('queryString')(<Search
                  placeholder="请输入用户名/手机号/会员卡号"
                  style={{ width: 200 }}
                  onSearch={ this.Search }
                />)}
              </FormItem>
            </Col>
            <Col span={8} key={3}>
              <FormItem {...formItemLayout} label={`列表排序 `}>
                {getFieldDecorator('order', {})(
                  <Select
                    showSearch
                    style={{ width: 200 }}
                    placeholder="请选择"
                    optionFilterProp="children"
                    onChange={this.handleChangeOrder}
                    filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    <Option value="">请选择</Option>
                    <Option value="name">姓名</Option>
                    <Option value="sum">卡余额</Option>
                    <Option value="createTime">创建时间</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={8} key={4}>
              <FormItem {...formItemLayout} label={`会员类型 `}>
                {getFieldDecorator('type', { rules: [
                  { message: '请选择' },
                ],})(
                  <Select
                    showSearch
                    style={{ width: 200 }}
                    placeholder="请选择"
                    optionFilterProp="children"
                    onChange={this.handleChangeType}
                  >
                    {typeOptions}
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
        <MemberDetailsTable {...MemberDetailsTableProps} dispatch={dispatch} type={type} order={order} nowPage={nowPage} nowSize={nowSize}/>
        <MemberDetailsModal {...MemberDetailsModalProps}/>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { list, typeList, modalVisible } = state.memberDetails;

  return {
    list,
    typeList,
    modalVisible
  };
}

const MemberDetailsContent = Form.create()(MemberDetails);
export default connect(mapStateToProps)(MemberDetailsContent);
