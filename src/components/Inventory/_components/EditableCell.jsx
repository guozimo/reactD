import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Input, InputNumber, Icon, Select, Button, Modal, Table } from 'antd';
import _ from 'lodash';
const Option = Select.Option;


class inEditStatusCell extends React.Component {
  state = {
    value: this.props.inValue,
    data: [],
    inEditStatus: this.props.inEditStatus,
    field: this.props.field,
    rowIndex: this.props.rowIndex,
    options: [],
    visible: false,
    keyValues: {}
  }
  handleChange(e, rowKey) {
    const value = e.target.value;
    this.props.configurations.updateValue(value, rowKey);
    this.setState({ value });
  }

  selectChange(value) {
    this.setState({ value });
    let options;
    if (!value) {
      options = [];
    } else {
    //  console.log("---------------我是全部数据",value)
     this.props.configurations.onChange(value);
    //  console.log("物资名称",this.state.goodsList);
    //  if(!!this.state.goodsList){
     //
    //   options =this.state.goodsList.map(store =>return <Option value={store.id} key={store.id}>{store.goodsName}</Option>);
     //
    //  }else {
    //    options=[];
    //  }

    //  options = ['gmail.com', '163.com', 'qq.com'].map((domain) => {
    //    const email = `${value}@${domain}`;
    //    return <Option key={email}>{email}</Option>;
    //  });
   }
   this.setState({ options });
  }
  clickToEdit() {

    let { field } = this.state;
    this.state.inEditStatus[field] = !this.state.inEditStatus[field];
    this.forceUpdate();
  }
  keyPress(event) {
    let targetField = '',
        newTargetField = '',
        currField = this.state.field,
        fields = Object.keys(this.state.inEditStatus);
    let currFieldIndex = _.findIndex(fields, item => item === currField);
    let rowIndex = this.props.rowIndex;

    if (event.key == 'Enter' && currFieldIndex >= -1) {
      if (currFieldIndex == (fields.length - 1)) {
        newTargetField = fields[currFieldIndex];
        this.state.inEditStatus[newTargetField] = false;
        currFieldIndex = -1;
        rowIndex = rowIndex + 1;
      }
      targetField = fields[currFieldIndex + 1];
      // console.log("targetField",targetField);
      this.props.focusField(targetField, rowIndex);
    } else {
      return true;
    }
  }
  changeSelect() {
    this.props.openModel(this.props.configurations.rowIdent);
  //   this.setState({
  //    visible: true,
  //  });
  }
  outBlur() {
      // console.log("-----------------22223333我是失去焦点");
  this.state.inEditStatus[this.props.field]=false;
  this.forceUpdate();
  }
  changeClose() {
  this.state.inEditStatus[this.props.field]=false;
  this.forceUpdate();
  }
  // outSelectBlur() {
  //   console.log("-----------------我是失去焦点")
  // // this.state.inEditStatus[this.props.field]=false;
  // // this.forceUpdate();
  // }
  handleOk (){

   this.setState({
     visible: false,
   });
 }
 handleCancel() {
   this.setState({
     visible: false,
   });
 }
  componentDidUpdate(prevProps, prevState) {
    if(prevProps.field == Object.keys(this.state.inEditStatus)[0]){
      let domOfSelect=ReactDOM.findDOMNode(this.refs.mySelectInput);
      let inputOfSelect = domOfSelect && domOfSelect.querySelector('input');
      if (inputOfSelect) {
        inputOfSelect.focus();
      }
    }
  }
  componentDidMount() {

    if (this.props.configurations && this.props.configurations.transValue) {
      let value = this.props.configurations.transValue
      this.setState({ value });
    }
  }

  componentWillReceiveProps(nextProps) {
    // let {field}=this.state;

    if (nextProps.inEditStatus !== this.state.inEditStatus) {
      this.setState({ inEditStatus: nextProps.inEditStatus });
    }
    if (nextProps.configurations && nextProps.configurations.keyValues) {
      // console.log("------nextProps.configurations.keyValues",nextProps.configurations.keyValues);
      this.state.keyValues[this.props.field] = nextProps.configurations.keyValues;
      this.forceUpdate();
    }
    if (nextProps.configurations && nextProps.configurations.transValue) {
      if(this.state.field == 'goodsCode')
      this.setState({ value: nextProps.configurations.transValue });
    }
    if (nextProps.inValue && nextProps.configurations.type == 'select') {
      if(this.state.field == 'goodsCode')
      this.setState({ value: nextProps.inValue });
    }
  }
  render() {
    const { value, inEditStatus, field } = this.state;
    let newValue = value;
    // if(field=='goodsCode'){
    //     console.log("测试不显示newValue",newValue);
    // }

    // if (this.props.configurations&&!this.state.isChangeNow) {
    //   newValue = this.props.configurations.newValue || newValue;
    // }
    // console.log("render newValue",newValue);

    const columns = [
      {
        title: '物资编码',
        dataIndex: 'goodsCode',
        key: 'goodsCode',
      }, {
        title: '物资名称',
        dataIndex: 'goodsName',
        key: 'goodsName',
      }
    ];
    const data = [{
      key: '1',
      goodsCode: '1008',
      goodsName: '洋葱',
    }, {
      key: '2',
      goodsCode: '1009',
      goodsName: '洋蒜',
    }, {
      key: '3',
      goodsCode: 'John Brown',
      goodsName: 32,
    }, {
      key: '4',
      goodsCode: 'John Brown',
      goodsName: 32,
    }];
    const rowSelection = {
     onChange: (selectedRowKeys, selectedRows) => {
      //  console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
     },
     getCheckboxProps: record => ({
       disabled: record.name === 'Disabled User',    // Column configuration not to be checked
     }),
   };
    //  console.log("inEditStatus",inEditStatus)
    return (
      <div className="editable-td">
        {inEditStatus[field]
          ? <div className="editing-field">{
      (()=>{
        let controller=null;
           if (this.props.configurations && this.props.configurations.type === 'select') {
                  controller=<div   onKeyUp={this.keyPress.bind(this)}>
                    <Select
                      mode="combobox"
                      style={{width:100}}
                      onChange={(theValue)=>this.selectChange(theValue)}
                      ref="mySelectInput"
                      filterOption={false}
                      onSelect={(theValue)=>this.props.configurations.selectItem(theValue,this.props.configurations.rowIdent)}
                      placeholder="Enter the account name">
                      {
                         this.state.keyValues[this.props.field] && this.state.keyValues[this.props.field].map(
                           store => <Option disabled={this.props.configurations.disabledList.includes(store.id)} value={store.goodsCode} key={store.id}>{store.goodsName}</Option>)
                       }
                    </Select>
                     <Button type="dashed" onClick={this.changeSelect.bind(this)} size="small" shape="circle" icon="search" />
                     <Button type="dashed" onClick={this.changeClose.bind(this)} size="small" shape="circle" icon="close" />
                  </div>
                }else{
                  // console.log("inEditStatus[field]",inEditStatus[field]);

                  if(['dualGoodsQty','goodsQty','goodsAmtNotax'].includes(field)){

                    controller=<Input
                      ref={(input) =>{if (input != null) {input.focus()}}}
                      value={newValue}
                      type="number"
                      onBlur={this.outBlur.bind(this)}
                      onChange={e => this.handleChange(e,this.props.configurations.rowIdent)}
                      onKeyUp={this.keyPress.bind(this)}
                      />
                  }else {
                    controller=<Input
                      ref={(input) =>{if (input != null) {input.focus()}}}
                      value={newValue}
                      onBlur={this.outBlur.bind(this)}
                      onChange={e => this.handleChange(e,this.props.configurations.rowIdent)}
                      onKeyUp={this.keyPress.bind(this)}
                      />
                  }
                    // console.log("DDDDDDDD")

                }

                return controller;
      })()
            }
            </div>
          : <div className="inEditStatus-row-text" style={{
            cursor: "pointer"
          }} onClick={this.clickToEdit.bind(this)}>
            {newValue&&newValue.toString() || ' '}<Icon type="edit" className="editable-cell-icon-check"/>
          </div>
}
<Modal
         title="请选择数据"
         visible={this.state.visible}
         onOk={this.handleOk.bind(this)}
         onCancel={this.handleCancel.bind(this)}
       >
         <Table rowSelection={rowSelection} columns={columns} dataSource={data} />
       </Modal>
      </div>
    );
  }
}
module.exports = inEditStatusCell;
