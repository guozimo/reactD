import React,{PropTypes} from 'react';
import ReactDOM from 'react-dom';
import { Input, InputNumber, DatePicker, Tooltip, message, Select, Button, Modal, Table} from 'antd';
import _ from 'lodash';
import moment from 'moment';
const Option = Select.Option;


class inEditStatusCell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.inValue,
      data: [],
      inEditStatus: this.props.inEditStatus,
      field: this.props.field,
      rowIndex: this.props.rowIndex,
      options: [],
      visible: false,
      isSelectBlur: true,
      keyValues: {}
    };
    this.keyPress = this.keyPress.bind(this);
    this.changeSelect = this.changeSelect.bind(this);
    this.changeClose = this.changeClose.bind(this);
    this.outBlur = this.outBlur.bind(this);
    this.whenChangeDate = this.whenChangeDate.bind(this);
    this.clickToEdit = this.clickToEdit.bind(this);
    this.outSelectBlur = this.outSelectBlur.bind(this);
    this.updateBlur = this.updateBlur.bind(this);
    this.removeBlur = this.removeBlur.bind(this);
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
          let lastPointPositon=value.lastIndexOf('.');
          if (lastPointPositon !== value.indexOf('.')) {
            value=value.substr(0,lastPointPositon)+value.substr(lastPointPositon+1);
          }
          if (!value.match(/[0-9]{0,}\.{1}0{0,4}$/g)) { // 转数值
            value = Math.round(parseFloat(value) * 10000) / 10000; // 保留4位小数
          }
          if (value > 999999999) {
            message.destroy();
            message.error('可输入的最大数值是999999999，已超出范围！');
            return false;
          }
          break;
        default:
        if (maxLength && value.toString().length > maxLength) {
          message.destory();
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
    if (value.toString().length > 20) {
      message.destory();
      message.error('最多允许填写20个字');
      return false;
    }
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
    // console.log("---------------我是数据",fields[currFieldIndex], "currFieldIndex", currFieldIndex, "hideField", this.props.configurations.hideField);

    if (event.key === 'Enter' && currFieldIndex >= -1) {
      // console.warn("我是执行了");
      if ((currFieldIndex == (fields.length - 1)) && (!this.props.isBillSourceAdd)) {
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
      if (this.props.field !== 'remarks' && this.props.field !== 'remark') {
        const value = this.state.value + '';
        if (value !== '' && (value.indexOf('.') === 0 || value.lastIndexOf('.') === value.length - 1)) { // 不允许只输入 0. 或者 .
          message.error('请输入有效数值');
          this.setState({ value: '0' });
        }
      }
    } else {
      return true;
    }
  }
  changeSelect() {
    // console.log("你好");
    this.props.openModel(this.props.configurations.rowIdent);
  //   this.setState({
  //    visible: true,
  //  });
  }
  whenChangeDate(date, rowKey, dateString) {
    this.props.configurations.updateValue(date, rowKey, dateString);
    this.setState({ value: dateString });
  }
  outBlur() {
      // console.log("-----------------22223333我是失去焦点");
    this.state.inEditStatus[this.props.field] = false;
    this.forceUpdate();
    if (this.props.field !== 'remarks' && this.props.field !== 'remark') {
      const value = this.state.value + '';
      if (value !== '' && (value.indexOf('.') === 0 || value.lastIndexOf('.') === value.length - 1)) { // 不允许只输入 0. 或者 .
        message.error('请输入有效数值');
        this.setState({ value: '0' });
      }
    }
  }
  updateBlur() {
    // console.log("-----------------22223333我是移入", this.state.isSelectBlur);
    this.state.isSelectBlur = false;
    this.forceUpdate();
  }
  removeBlur() {
    // console.log("-----------------22223333我是移出", this.state.isSelectBlur);
    this.state.isSelectBlur = true;
    this.forceUpdate();
  }
  changeClose() {
    this.state.inEditStatus[this.props.field] = false;
    this.forceUpdate();
  }
  outSelectBlur() {
    // console.log("-----------------我是失去焦点")
    if (this.state.isSelectBlur) {
      this.state.inEditStatus[this.props.field] = false;
      this.forceUpdate();
    }
  }
  handleOk (){

   this.setState({
     visible: false,
   });
 }
 handleCancel () {

   this.setState({
     visible: false,
   });
 }
  componentDidUpdate(prevProps, prevState) {
    if(prevProps.field == Object.keys(this.state.inEditStatus)[0]){
    let domOfSelect=ReactDOM.findDOMNode(this.refs.mySelectInput);
    let inputOfSelect=domOfSelect&&domOfSelect.querySelector('input');
      if (inputOfSelect) {
        inputOfSelect.focus();
      }
    }
  }
  componentDidMount() {

    if (this.props.configurations&&this.props.configurations.transValue) {
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
    if (!this.state.value && nextProps.configurations && nextProps.configurations.transValue) {
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
    // if(field=='dualUnitNum'){
        // console.log("测试不显示newValue",newValue);
    // }

    // if (this.props.configurations&&!this.state.isChangeNow) {
    //   newValue = this.props.configurations.newValue || newValue;
    // }
    // console.log("this.props.configurations.disabledList",this.props.configurations.disabledList);

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

    const rowSelection = {
     onChange: (selectedRowKeys, selectedRows) => {
      //  console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
     },
     getCheckboxProps: record => ({
       disabled: record.name === 'Disabled User',    // Column configuration not to be checked
     }),
   };
    //  console.log("inEditStatus",inEditStatus)
    //  console.log("AAAAAAA")
    return (
      <div className="editable-td">
        {inEditStatus[field]
          ? <div className="editing-field">{
      (()=>{
        // console.log("BBBBBBBB")
        let controller=null;
        if (!this.props.configurations.disabled) { // 根据条件判断是否能够搜索 true 不能搜索 false 能够搜索

          if (this.props.configurations && this.props.configurations.type === 'select') {

              //  console.log("cccccccc")
            controller=<div  onKeyDown={this.keyPress}>
              <Select
                mode="combobox"
                style={{ width: 100 }}
                onChange={theValue => this.selectChange(theValue)}
                ref={(input) => {
                  if (input) {
                    ReactDOM.findDOMNode(this).querySelectorAll('input')[0].focus(); // 定位光标
                  }
                  return 'mySelectInput'; // ref值
                }}
                onBlur={this.outSelectBlur}
                filterOption={false}
                onSelect={theValue => this.props.configurations.selectItem(theValue, this.props.configurations.rowIdent)}
                placeholder="请填写编码">
                {
                   this.state.keyValues[this.props.field] && this.state.keyValues[this.props.field].map(
                     store => <Option disabled={this.props.configurations.disabledList.includes(store.goodsCode)} value={store.goodsCode} key={store.id}>{store.goodsName}</Option>)
                 }
              </Select>
              <Button
                onClick={this.changeSelect}
                size="small"
                shape="circle"
                icon="search"
                onMouseOver={this.updateBlur}
                onMouseOut={this.removeBlur}
              />
              <Button  onClick={this.changeClose} style={{ display: 'none' }} size="small" shape="circle" icon="close" />
            </div>
          } else if (this.props.configurations && this.props.configurations.type === 'datepicker') {
            controller = <DatePicker
              ref={(input) => { if (input) {
                ReactDOM.findDOMNode(this).querySelectorAll('.ant-calendar-picker-input')[0].click(); // 呼出显示日历并且支持键盘选择
              } }}
              allowClear={false}
              defaultValue={this.props.configurations.transValue ? moment(this.props.configurations.transValue, 'YYYY-MM-DD') : null}
              onChange={(date, dateString) => this.whenChangeDate(date, this.props.configurations.rowIdent, dateString)}
              disabledDate={this.props.configurations.disabledDate || null}
              />;
          } else if (this.props.configurations && this.props.configurations.type === 'inputNumber') {
            // console.log("this.props.configurations.isShow", this.props.configurations.isShow);

            // console.log("我是这三个",this.props.configurations.isShow,inEditStatus[field],"this.props.configurations.hideField",this.props.configurations.hideField);
            if (!this.props.configurations.isShow) {
              controller = <Input
                ref={(input) =>{if (input != null) { input.focus() } } }
                value={newValue}
                onFocus={() => { // 选中文字，注意 type="number" 时不支持
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
                // type="number"
                onBlur={this.outBlur}
                onChange={e => this.handleChange(e, this.props.configurations.rowIdent, "number")}
                onKeyDown={this.keyPress}
                />
            } else {
              controller = <span>{newValue}</span>
            }
          } else {
              // console.log("我什么也不是",inEditStatus[field]);
            controller = <Input
              ref={(input) =>{if (input != null) {input.focus()}}}
              value={newValue}
              onBlur={this.outBlur}
              onChange={e => this.handleChange(e,this.props.configurations.rowIdent)}
              onKeyDown={this.keyPress}
              />
            // console.log("DDDDDDDD")
          }
        } else {
          // console.warn('最后的');
          controller = <span>{newValue}</span>
        }
        return controller;
      })()
            }
          </div>
          : <div className="inEditStatus-row-text" style={{
            cursor: "pointer",
          }} onClick={this.clickToEdit}>
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

      </div>
    );
  }
}
module.exports = inEditStatusCell;
