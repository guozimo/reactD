import React,{PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {Input, Row, Col, Tree, Select, Button, Tooltip, Modal, message, Table, Card } from 'antd';
import _ from 'lodash';
const Option = Select.Option;
const TreeNode = Tree.TreeNode;


class inEditStatusCell extends React.Component {
  state = {
    value: this.props.inValue,
    data: [],
    inEditStatus: this.props.inEditStatus,
    field: this.props.field,
    rowIndex: this.props.rowIndex,
    options: [],
    dataTree: [],
    scmInGoodsList: [],
    visible: false,
    loading: false,
    keyValues: {},
    selectedRowKeys: [],
    addNewsTransmitData: [], // 开始时数据
    content: [], // 全部数据
  }
  handleChange(e, rowKey, type) {
    let value = e.target.value;
    const maxLength = this.props.configurations.maxLength;
    let isValidated = true;
    // console.log("rowKey", rowKey, "type", type);
    if (value) {
      switch (type) {
        case 'number': // 只提取包含小数类型的数值
          value = value.replace(/。/g, '.').replace(/[^\d\.]/g, '');
          if (!value) {
            return false;
          }
          if (value.indexOf('.') < value.length-1) { // 转数值
            value = Math.round(parseFloat(value) * 10000) / 10000; // 保留4位小数
          }
          if (value > 999999999) {
            message.error('可输入的最大数值是999999999，已超出范围！');
          }
          break;
        default:
        if (maxLength && value.toString().length > maxLength) {
            message.error(`最多允许填写${maxLength}个字`);
          isValidated = false;
        }
      }
    }
    if (!isValidated) {
      return false;
    }
    this.props.configurations.updateValue(value, rowKey);
    this.setState({ value });

  }
  selectChange(value) {
    // if(this.state.field=='goodsCode')
    //   console.log("set value as ",value, " in selectChange");
    this.setState({ value });
    let options;
    if (!value) {
      options = [];
    } else {
    //  console.log("---------------我是全部数据",value)
     this.props.configurations.onChange(value);

   }
   this.setState({ options });
  }
  clickToEdit() {

    let { field } = this.state;
    this.state.inEditStatus[field] = !this.state.inEditStatus[field];
    this.forceUpdate();
  }
  keyPress(event) {
    let targetField = "",
        newTargetField = "",
        currField = this.state.field,
        fields = Object.keys(this.state.inEditStatus);
    let currFieldIndex = _.findIndex(fields, item => item === currField);
    let rowIndex = this.props.rowIndex;
    // console.log("---------------我是数据",fields[currFieldIndex], "currFieldIndex", currFieldIndex, "hideField", this.props.configurations.hideField);

    if (event.key == 'Enter' && currFieldIndex >= -1) {
      if (currFieldIndex == (fields.length - 1)) {
        newTargetField = fields[currFieldIndex];
        this.state.inEditStatus[newTargetField] = false;
        currFieldIndex = -1;
        rowIndex = rowIndex + 1;
      }
      // console.log("我是数据",fields[currFieldIndex], "currFieldIndex", currFieldIndex, "this.props.configurations.hideField", this.props.configurations.hideField);
      if (this.props.configurations.hideField) { // hideField=true，不显示文本框，越过
        currFieldIndex = currFieldIndex + 1;
        // console.log("我是测试数据数据");
      }
      targetField = fields[currFieldIndex + 1];
      // console.log("targetField",targetField);
      this.props.focusField(targetField, rowIndex);
    } else {
      return true;
    }
  }
  changeSelect() {
    // console.log("你好");
    this.props.openModel(this.props.configurations.rowIdent);
    this.setState({
      visible: true,
    });
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
  onSelectMenu =(value) => { // 选择菜单跳转
    // console.log("---------------value",value);
    this.props.onModalChange('selectMenu', value);
  }
  onPageChange =(value) => { // 分页跳转
    // console.log("---------------value",value);
    let content=this.state.content||[];
    // console.log("我是编辑的内容",this.state.content,"hhthis.state.addNewsTransmitData",this.state.addNewsTransmitData);
    // console.log("我是合并之后",this.state.content.concat(this.state.addNewsTransmitData));
    content = content.concat(this.state.addNewsTransmitData);
    content = _.uniqBy(content, 'id');
    this.state.content=content;
    // console.log("内容",content)
    this.forceUpdate();
    this.props.onModalChange('page', value);
  }
  goodsModalExport  =(value) => {
    // console.log("---------------value",value);
    this.props.onModalChange('page', value);
  }
  paginationGoods() {

  }
  onCheck(){

  }
  handleOk() {
    let content=this.state.content||[];
    // console.log("我是编辑的内容",this.state.content,"hhthis.state.addNewsTransmitData",this.state.addNewsTransmitData);
    // console.log("我是合并之后",this.state.content.concat(this.state.addNewsTransmitData));
    content = content.concat(this.state.addNewsTransmitData);
    content = _.uniqBy(content,"id");
    this.state.content=content;
    // console.log("内容",content)
    this.forceUpdate();
    this.props.onModalChange('handleOk' , this.state.content)
     this.setState({
       visible: false,
     });
   }

 handleCancel () {

   this.setState({
     visible: false,
   });
 }
 onCancel () {

   this.setState({
     visible: false,
   });
 }
  componentDidUpdate(prevProps, prevState) {
    if(prevProps.field==Object.keys(this.state.inEditStatus)[0]){
    let domOfSelect=ReactDOM.findDOMNode(this.refs.mySelectInput);
    let inputOfSelect=domOfSelect&&domOfSelect.querySelector('input');
      if (inputOfSelect) {
        inputOfSelect.focus();
      }
    }
  }
  componentDidMount() {

    if (this.props.configurations && this.props.configurations.transValue) {
      let value=this.props.configurations.transValue
      this.setState({value});
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
      // if(this.state.field=='goodsCode')
      this.setState({value:nextProps.configurations.transValue});
    }
    if (nextProps.inValue&&nextProps.configurations.type=='select') {
      if(this.state.field=='goodsCode')
      this.setState({value:nextProps.inValue});
    }
  }
  render() {
    const {value, inEditStatus, field} = this.state;
    let newValue=value;
    // if(field=='goodsAmtNotax'){
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
      }, {
        title: '规格型号',
        dataIndex: 'goodsSpec',
        key: 'goodsSpec',
      }, {
        title: '标准单位',
        dataIndex: 'unitName',
        key: 'unitName',
      }, {
        title: '辅助单位',
        dataIndex: 'dualUnitName',
        key: 'dualUnitName',
      }, {
        title: '订货单位',
        dataIndex: 'purcUnitName',
        key: 'purcUnitName',
      },
      {
        title: '库存数量',
        dataIndex: 'wareQty',
        key: 'wareQty',
      // }, {
      //   title: '类别',
      //   dataIndex: 'cateName',
      //   key: 'cateName',
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        width: '150',
        render: text => <Tooltip placement="leftTop" title={text}>
          <div className="ellipsed-line width-150">{text}</div>
        </Tooltip>,
     },
    ];

  //   const rowSelection = {
  //    onChange: (selectedRowKeys, selectedRows) => {
  //     //  console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  //    },
  //    getCheckboxProps: record => ({
  //      disabled: record.name === 'Disabled User',    // Column configuration not to be checked
  //    }),
  //  };
  //  handleOk() {
  //      okHideModal();
  //  }
  //  console.log("visible",visible);

   const rowSelection = {
     selectedRowKeys: this.state.addNewsTransmitData.map( item => item.id),
     onChange: (selectedRowKeys, selectedRows) => {
       // goodsChoose = selectedRows[0];
       this.state.addNewsTransmitData = selectedRows;
       this.forceUpdate();
      //  goodsModalExport(selectedRowKeys,selectedRows);
     },
     onSelect: (record, selected, selectedRows) => {
      // console.log(record, selected, selectedRows);
      if (selected==false) {
           //取消选择
           _.remove(this.state.data.content,item=>{
             item.id==record.id;
           });
         }
         this.forceUpdate();
     },
     onSelectAll: (selected, selectedRows, changeRows) => {
       // console.log(selected, selectedRows, changeRows);
     },
     getCheckboxProps: record => ({
       disabled: _.includes(this.props.configurations.disabledList, record.goodsCode),    // Column configuration not to be checked
     }),
     //selectedRowKeys : [queryRowId]
   };
   const loop = data => data.map((item) => {
     if (item.children && item.children.length) {
       return <TreeNode key={item.id} title={item.name}>{loop(item.children)}</TreeNode>;
     }
     return <TreeNode key={item.id} title={item.name} />;
   });
    //  console.log("inEditStatus",inEditStatus)
    //  console.log("AAAAAAA")
    return (

      <div className="editable-td">
        {inEditStatus[field]
          ? <div className="editing-field">{
      (()=>{
        // console.log("BBBBBBBB")
        let controller=null;

           if (this.props.configurations && this.props.configurations.type === 'select') {
             controller=<div onKeyUp = {this.keyPress.bind(this)}>

                <Select
                  mode="combobox"
                  style={{width:100}}
                  onChange={(theValue)=>this.selectChange(theValue)}
                  ref="mySelectInput"
                  filterOption={false}
                  onSelect={(theValue)=>this.props.configurations.selectItem(theValue, this.props.configurations.rowIdent)}
                  placeholder="请填写编码">
                  {
                     this.state.keyValues[this.props.field] && this.state.keyValues[this.props.field].map(
                       store => <Option disabled={this.props.configurations.disabledList.includes(store.id)} value={store.goodsCode} key={store.id}>{store.goodsName}</Option>)
                   }
                </Select>
                 <Button   onClick={this.changeSelect.bind(this)} size="small" shape="circle" icon="search" />
                 <Button   onClick={this.changeClose.bind(this)} size="small" shape="circle" icon="close" />
              </div>
           } else if (this.props.configurations.type === 'InputNumber') {
              // console.log("我是这三个",inEditStatus[field],"this.props.configurations.hideField",this.props.configurations.hideField);
              if (!this.props.configurations.isShow) {
                controller=<Input
                  ref={(input) =>{if (input != null) { input.focus() } } }
                  value={newValue}
                  // type="number"
                  onFocus={() => {
                    // 选中文字，注意 type="number" 时不支持
                    let elem = ReactDOM.findDOMNode(this).querySelectorAll("input")[0];
                    // console.log("elem",elem)
                    if (elem.setSelectionRange) {
                      elem.setSelectionRange(0, 1000);
                    } else if (elem.createTextRange) {
                      let range = elem.createTextRange();
                      range.collapse(true);
                      range.moveEnd('character', 1000);
                      range.moveStart('character', 0);
                      range.select();
                    }
                  }}
                  onBlur={this.outBlur.bind(this)}
                  onChange={e => this.handleChange(e,this.props.configurations.rowIdent)}
                  onKeyUp={this.keyPress.bind(this)}
                  />
              } else {
                controller =<span>{newValue}</span>
              }
              } else {
                // console.log("我什么也不是",inEditStatus[field]);
                controller=<Input
                  ref={(input) =>{if (input != null) {input.focus()}}}
                  value={newValue}
                  onBlur={this.outBlur.bind(this)}
                  onChange={e => this.handleChange(e,this.props.configurations.rowIdent)}
                  onKeyUp={this.keyPress.bind(this)}
                  />
                // console.log("DDDDDDDD")
            }

        return controller;
      })()
            }
            </div>
          : <div className="inEditStatus-row-text" style={{
            cursor: "pointer", minHeight: 25
          }} onClick={this.clickToEdit.bind(this)}>
          {((newValue || newValue === 0) && ((values)=>{
            values = values.toString();
            if (values.length>18) {
              values = <Tooltip placement="leftTop" title={values}>
                <div className="ellipsed-line width-150">{values}</div>
              </Tooltip>;
            }
            return values;
          })(newValue)) || ' '}
          </div>
}
        <Modal
          width="1000"
          title='请选择数据'
          visible={this.state.visible}
          onOk={this.handleOk.bind(this)}
          onCancel={this.onCancel.bind(this)}
          wrapClassName='vertical-center-modal'
          confirmLoading={this.state.loading}
        >
            <div className="components-modal">
          <Row gutter={16}>
            <Col span={6}>
              <Card title="物资类别" >
              <Tree
                onSelect={this.onSelectMenu.bind(this)}
                onCheck={this.onCheck.bind(this)}
              >
                {loop(this.props.modalList.findTreeList)}
              </Tree>
              </Card>
            </Col>
            <Col span={18}>
              <div>
                <Table
                  size="small"
                  className="table"
                  rowSelection={rowSelection}
                  bordered
                  type = "radio"
                  columns={columns}
                  dataSource={this.props.modalList.scmInGoodsList}
                  //loading={loading}
                  pagination ={this.props.modalList.paginationGoods}
                  onChange={this.onPageChange.bind(this)}
                  rowKey={record => record.id}
                />
              </div>
            </Col>
          </Row>
          </div>
        </Modal>
      </div>
    );
  }
}
module.exports = inEditStatusCell;
