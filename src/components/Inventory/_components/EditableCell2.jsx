import React from 'react';
import ReactDOM from 'react-dom';
import { Input, Icon, Select, Button, Modal, Table, DatePicker, InputNumber, message, Row, Col, Card, Tree, Tooltip } from 'antd';
import _ from 'lodash';
const Search = Input.Search;
import moment from 'moment';
import  * as Redrules from './renderErrorRules';
const TreeNode = Tree.TreeNode;

class InEditStatusCell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.inValue,
      listData: {},
      inEditStatus: this.props.inEditStatus,
      field: this.props.field,
      rowIndex: this.props.rowIndex,
      options: [],
      selectedRows: [],
      content: [], // 全部数据
      allData: [],  // 全部数据
      popupGoodsVisible: false,
      keyValues: {},
      isSelectBlur: true,
      selectValue: '',
      redFlag: {}, // 文字标红的处理集合
      classRedFlag: 'editable-td',  // 控制是否框变红的
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    // this.handleInputNumberChange = this.handleInputNumberChange.bind(this);
    this.whenChangeDate = this.whenChangeDate.bind(this);
    this.keyPress = this.keyPress.bind(this);
    this.outBlur = this.outBlur.bind(this);
    this.outSelectBlur = this.outSelectBlur.bind(this);
    this.updateBlur = this.updateBlur.bind(this);
    this.onModalSearch = this.onModalSearch.bind(this);
    this.onChangeSelect = this.onChangeSelect.bind(this);
    this.removeBlur = this.removeBlur.bind(this);
    this.changeClose = this.changeClose.bind(this);
    this.showPopListWithData = this.showPopListWithData.bind(this);
    this.clickToEdit = this.clickToEdit.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.selectRow = this.selectRow.bind(this);
    this.onSelectTreeMenu = this.onSelectTreeMenu.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
  }
  componentDidMount() {
    if (this.props.configurations && this.props.configurations.transValue) {
      const value = this.props.configurations.transValue;
      this.setState({ value });
    }
  }

  componentWillReceiveProps(nextProps) {
    // console.log("componentWillReceiveProps",nextProps)
    if (nextProps.inEditStatus !== this.state.inEditStatus) {
      this.setState({ inEditStatus: nextProps.inEditStatus });
    }
    if (nextProps.configurations && nextProps.configurations.keyValues) {
      this.state.keyValues[this.props.field] = nextProps.configurations.keyValues;
      this.forceUpdate();
    }
    if (!this.state.value && nextProps.configurations && nextProps.configurations.transValue) {
      this.setState({ value: nextProps.configurations.transValue });
    }
    if (nextProps.inValue && nextProps.configurations.type === 'select') {
      if (this.state.field === 'goodsCode') {
        this.setState({ value: nextProps.inValue });
      }
    }
    if (nextProps.configurations.type === 'select' && nextProps.configurations.popListData) {
      this.setState({
        listData: nextProps.configurations.popListData.data,
      });
    }
        //  判断标红区域
//
//     let arrayFlag = true;
//       console.log(nextProps.validation.size(),this.props.validation.size());
// if(nextProps.validation.length == this.props.validation){
//
//   let Arraylength = nextProps.validation.length;
//    for(let i = 0; i<Arraylength; i += 1){
//      if(nextProps.validation[i]!=this.props.validation[i]){
//        arrayFlag = false;
//        break;
//      }
//    }
// }
// console.log(arrayFlag);
// console.log(JSON.stringify(nextProps.validation) , JSON.stringify(this.props.validation));
    if (this.props.validation != null && nextProps.validation != null) {
      if (JSON.stringify(nextProps.validation) !== JSON.stringify(this.props.validation)){
    // 循环判断是哪个改变了
        for (let item in nextProps.validation) {
    // console.log(nextProps.validation[item],this.props.validation[item]);
          if (nextProps.validation[item] !== this.props.validation[item]) {
            if (item === nextProps.field || nextProps.validation.renderErrorRules === null){
                // 获取当前URL 根据URL寻找规则函数
              const nowUrl = window.document.location.href;
              const nowUrlMin = nowUrl.substring(nowUrl.indexOf('#') + 2);
              const nowUrlMinOne = nowUrlMin.substring(0, nowUrlMin.indexOf('/'));
              const nowUrlMinOneOut = nowUrlMin.substring(nowUrlMin.indexOf('/') + 1);
              const nowUrlMintwo = nowUrlMinOneOut.substring(0, nowUrlMinOneOut.indexOf('/'));
              const pageName = nowUrlMinOne + nowUrlMintwo;
              if (Redrules[pageName] != null) {
                //  if (nextProps.validation.renderErrorRules == null) {
                const flag = !Redrules[pageName](nextProps.validation, nextProps.field);
                // 开始更改样式
                if (flag) {
                  this.setState({
                    classRedFlag: 'editable-td editable-col-red',
                  });
                } else {
                  this.setState({
                    classRedFlag: 'editable-td',
                  });
                }
            //      }
              }
            }
          }
        }
      }


    //  判断标红区域
    // if(this.props.listDataLine && this.props.listDataLine.pageName === 'stockOutDistribution'){
    //   let rowItem=this.props.listDataLine;
    //   if ((rowItem.currOutNum + rowItem.outNum > rowItem.ordUnitNum || rowItem.currOutNum == 0) && this.props.field=='currOutNum' ){
    //     this.setState({
    //         classRedFlag : "editable-td editable-col-red",
    //     });
    //   }else if ((rowItem.outDualNum > rowItem.dualUnitNum)  && this.props.field=='outDualNum') {
    //     this.setState({
    //         classRedFlag : "editable-td editable-col-red",
    //     });
    //   }else{
    //     this.setState({
    //         classRedFlag : "editable-td",
    //     });
    //   }
    // }
    }
  }
  componentDidUpdate(prevProps) {
    if (prevProps.field === Object.keys(this.state.inEditStatus)[0]) {
      let domOfSelect = ReactDOM.findDOMNode(this.refs.mySelectInput);
      let inputOfSelect = domOfSelect && domOfSelect.querySelector('input');
      if (inputOfSelect) {
        inputOfSelect.focus();
      }
    }
  }
  handleInputChange(e, rowKey, type) {
    let value = e.target.value;
    const maxLength = this.props.configurations.maxLength;
    let isValidated = true;
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
    // console.log("set value as ",value, " in handleInputChange");
    if (!isValidated) {
      return false;
    }
    this.props.configurations.updateValue(value, rowKey);
    this.setState({ value });
  }
  // handleInputNumberChange(value, rowKey) {
  //   // console.log("set value as ",value, " in handleInputNumberChange");
  //   this.props.configurations.updateValue(value, rowKey);
  //   this.setState({ value });
  // }
  onSelectTreeMenu(value) {
    this.props.configurations.onSelectTreeItem(value);
  }
  onModalSearch(value) {
    this.props.configurations.onModalSearch(value);
    // this.setState({ selectValue: value });
  }
  onChangeSelect(value) {
    // this.setState({ selectValue: value });
    this.state.selectValue = value.target.value;
    this.forceUpdate();
  }
  whenChangeDate(rowKey, date, dateString) {
    this.props.configurations.updateValue(rowKey, date, dateString);
    this.setState({ value: dateString });
  }

  selectChange(value) {
    // if(this.state.field === 'goodsCode')
    // console.log("set value as ", value, " in selectChange");
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
      this.props.configurations.onChange(value);
    }
    this.setState({ options });
  }
  clickToEdit() {
    const { field } = this.state;
    this.state.inEditStatus[field] = !this.state.inEditStatus[field];
    if (this.props.configurations.originalProps && this.props.configurations.originalProps.onFocusInput) {
      this.props.configurations.originalProps.onFocusInput()
    }
    this.forceUpdate();
  }
  keyPress(event) {
    let targetField = '',
      newTargetField = '',
      currField = this.state.field,
      fields = Object.keys(this.state.inEditStatus);
    let currFieldIndex = _.findIndex(fields, item => item === currField);
    let rowIndex = this.props.rowIndex;
    if (event.key === 'Enter' && currFieldIndex >= -1) {
      if (currFieldIndex === (fields.length - 1)) {
        newTargetField = fields[currFieldIndex];
        this.state.inEditStatus[newTargetField] = false;
        currFieldIndex = -1;
        rowIndex = rowIndex + 1;
      }
      targetField = fields[currFieldIndex + 1];
      // console.log("targetField",targetField);
      this.props.configurations.onKeyEnter && this.props.configurations.onKeyEnter(rowIndex, targetField);
    } else {
      return true;
    }
  }
  showPopListWithData() {
    this.setState({
      popupGoodsVisible: true,
      selectedRows: [], // 清空已选择的物资项目
    });
    // this.props.openModel(this.props.configurations.rowIdent);
  }
  outBlur() {
    // console.log("-----------------22223333我是失去焦点");
    this.state.inEditStatus[this.props.field] = false;
    this.forceUpdate();
    if (this.props.field !== 'remarks' && this.props.field !== 'remark') {
      const value = this.state.value + '';
      if (value !== '' && (value.indexOf('.') === 0 || value.lastIndexOf('.') === value.length - 1)) { // 不允许只输入 0. 或者 .
        message.error('不允许只输入“0.”或者“.”');
        this.setState({ value: '0' });
      }
    }
  }
  enterOutBlur(event) {
    if (event.key === 'Enter') {
      if (this.props.field !== 'remarks' && this.props.field !== 'remark') {
        const value = this.state.value + '';
        if (value !== '' && (value.indexOf('.') === 0 || value.lastIndexOf('.') === value.length - 1)) { // 不允许只输入 0. 或者 .
          message.error('不允许只输入“0.”或者“.”');
          this.setState({ value: '0' });
        }
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
  outSelectBlur() {
    // console.log("-----------------22223333我是失去焦点", this.state.isSelectBlur);
    if (this.state.isSelectBlur) {
      this.state.inEditStatus[this.props.field] = false;
      this.forceUpdate();
    }
  }
  changeClose() {
    this.state.inEditStatus[this.props.field] = false;
    this.setState({ selectedRows: [], content: [], allData: [] }); // 清空已选择的物资项目
    this.state.allData = [];
    this.state.selectedRows = [];
    this.forceUpdate();
  }
  // outSelectBlur() {
  //   console.log("-----------------我是失去焦点")
  // // this.state.inEditStatus[this.props.field] = false;
  // // this.forceUpdate();
  // }
  handleOk() {
    this.setState({
      popupGoodsVisible: false,
      selectValue: '',
    });
    this.onPageChange();
    let content = this.state.content || [];
    content = content.concat(this.state.selectedRows);
    content = _.uniqBy(content, 'id');
    // console.warn("handleOk content", content);

    this.state.content = content;
    this.forceUpdate();
    this.props.configurations.cbReceiveChoose(content);
  }
  onPageChange(page) {
    const oldData = this.state.allData || [];
    const newData = this.state.selectedRows;
    // console.log("这是老的的oldData", oldData);
    // console.log('这是新的newData', newData);
    let allData = [];
    allData = oldData.concat(newData);
    allData = _.uniqBy(allData, 'id');
    this.state.selectedRows = allData;
    this.state.allData = allData;
    this.forceUpdate();
    if (page) {
      this.props.configurations.onPopPageChange(page);
    }
  }
  handleCancel() {
    this.setState({
      popupGoodsVisible: false,
      selectValue: '',
    });
    this.props.configurations.onCloseModel();
  }
  selectRow(record, index){
     // console.log("record, index",record, index);
     // console.log("this.props.configurations.disabledList",this.props.configurations.disabledList);
    if (_.includes(this.props.configurations.disabledList, record.goodsCode)) {
      return false; // 存在的话为不可选行，不作响应
    }
    let existsIndex = _.findIndex(this.state.selectedRows, item => item.id === record.id);
    if (existsIndex < 0) {
      this.state.selectedRows.push(record); // 不存在，添加
    } else {
      _.pullAt(this.state.selectedRows, existsIndex); // 已存在，删除
    }
    this.forceUpdate();
  }
  render() {
    const { value, inEditStatus, field } = this.state;
    const newValue = value;
    const isAllowedEdit = inEditStatus[field] && !this.props.configurations.disabled; // disabled: 根据条件判断是否能够搜索 true 不能搜索 false 能够搜索

    const that = this;
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
    ];
    if (this.props.configurations.hideFields && this.props.configurations.hideFields.length) {
      // 移除指定列
      _.remove(columns, item => this.props.configurations.hideFields.includes(item.key));
    }
    const tableData = (() => {
      const data = this.state.listData && this.state.listData.data;
      return data;
    })();
    const disabledStyle = (record , index) => {
      if (_.includes(this.props.configurations.disabledList, record.goodsCode)) {
        return 'disabled-row'; // 存在的话为不可选行，更换样式
      }
    }
    const rowSelection = {
      selectedRowKeys: that.state.selectedRows.length && that.state.selectedRows.map(item => item.id),
      onChange: (selectedRowKeys, selectedRows) => {
         // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        that.state.selectedRows = selectedRows;
        that.forceUpdate();
      },
      // onSelectAll: (selected, selectedRows, changeRows) => {
      //   // console.log("22222222222",selected, selectedRows, changeRows);
      //
      //     if (selected === false) { // 取消选择
      //       const goodsRowConcatListClone = _.cloneDeep(this.props.configurations.popListData.data.data);
      //       console.log("11111111allData",this.state.allData,"goodsRowConcatListClone",goodsRowConcatListClone);
      //
      //       this.state.allData.map((item) => {
      //         _.remove(goodsRowConcatListClone, data =>{
      //           console.log("333333333",data.id,data.id === item.id);
      //           return data.id === item.id;
      //         });
      //       });
      //       // this.state.allData = goodsRowConcatListClone;
      //       this.forceUpdate()
      //       console.log("2222222222allData",this.state.allData);
      //
      //     }
      // },
      getCheckboxProps: record => ({
        disabled: _.includes(this.props.configurations.disabledList, record.goodsCode),    // Column configuration not to be checked
      }),
    };

    const loop = data => data && data.length ? data.map((item) => {
      if (item.children && item.children.length) {
        return <TreeNode key={item.id} title={item.name}>{loop(item.children)}</TreeNode>;
      }
      return <TreeNode key={item.id} title={item.name} />;
    })
    : [];
    return (
      <div className={this.state.classRedFlag} style={{ display: (this.props.field === 'currOutDualNum' || this.props.field === 'dualUnitNum' || this.props.field === 'dualGoodsQty') && this.props.configurations.isShow ? 'none' : '' }}>
        {isAllowedEdit
          ? <div className="editing-field">{
            (() => {
              let controller = null;
              // console.log('最开始的', this.props.configurations.disabled);
              // console.log('开始的');
              // if (this.props.field === 'dualUnitNum' && this.props.configurations.isShow) {
              //   ReactDOM.findDOMNode(this).style(blueBorder); // editing-field
              //   // console.warn(ReactDOM.findDOMNode(this).style);
              // }
              if (this.props.configurations && this.props.configurations.type === 'select') {
                controller = <div onKeyDown={this.keyPress.bind(this)} style={{ display: 'inline-flex' }}>
                  <Select
                    mode="combobox"
                    ref={(input) => {
                      if (input) {
                        ReactDOM.findDOMNode(this).querySelectorAll('input')[0].focus(); // 定位光标
                      }
                      return 'mySelectInput'; // ref值
                    }}
                    style={{ width: 100 }}
                    onBlur={this.outSelectBlur}
                    onChange={theValue => this.selectChange(theValue)}
                    filterOption={false}
                    onSelect={theValue => this.props.configurations.selectItem(theValue, this.props.configurations.rowIdent)}
                    placeholder="模糊搜索"
                  >
                    {
                      this.state.keyValues[this.props.field] && this.state.keyValues[this.props.field].map(
                        item => (<Select.Option
                          disabled={this.props.configurations.disabledList.includes(item.goodsCode)}
                          value={item.goodsCode}
                          key={item.id}
                        >
                          {item.goodsName}
                        </Select.Option>)
                      )
                    }
                  </Select>
                  <Button
                    size="small"
                    shape="circle"
                    icon="search"
                    onMouseOver={this.updateBlur}
                    onMouseOut={this.removeBlur}
                    onClick={() => {
                      this.props.configurations.getPopListData();
                      this.showPopListWithData(this.props.configurations.popListData);
                    }}
                  />
                  <Button onClick={this.changeClose} size="small" style={{ display: 'none' }} shape="circle" icon="close" />
                </div>
              } else if (this.props.configurations && this.props.configurations.type === 'datepicker') {
                controller = <DatePicker
                    ref={(input) => { if (input) {
                      ReactDOM.findDOMNode(this).querySelectorAll('.ant-calendar-picker-input')[0].click(); // 呼出显示日历并且支持键盘选择
                    } }}
                    allowClear={false}
                    defaultValue={this.props.configurations.transValue ? moment(this.props.configurations.transValue, 'YYYY-MM-DD') : null}
                    onChange={(date, dateString) => this.whenChangeDate(this.props.configurations.rowIdent, date, dateString)}
                    disabledDate={this.props.configurations.disabledDate || null}
                  />;
              } else if(this.props.configurations && this.props.configurations.type === 'rangepicker') {
                controller = <DatePicker.RangePicker
                  ref={(input) => { if (input) {
                    ReactDOM.findDOMNode(this).querySelectorAll('.ant-calendar-picker-input')[0].click(); // 呼出显示日历并且支持键盘选择
                  } }}
                  allowClear={false}
                  format="YYYY-MM-DD"
                  defaultValue={this.props.configurations.transValue || null}
                  onChange={(date, dateString) => this.whenChangeDate(this.props.configurations.rowIdent, date, dateString)}
                  disabledDate={this.props.configurations.disabledDate || null}
                  renderExtraFooter={() => <div style={{ textAlign: 'center', color: '#bfbfbf' }}>请点选两个时间以确定一个时间范围</div>}
                  ranges={this.props.configurations.shortRanges || null}
                />
              } else if (this.props.configurations && this.props.configurations.type === 'number') {
                // console.warn('this.props.configurations.isShow', this.props.configurations.isShow, this.props.field);
                if (!this.props.configurations.isShow) { // isShow 判断是否能够编辑 比如双单位时可以编辑，isShow是undefind,或fals可编辑，
                  controller = <Input
                    ref={(input) => { if (input) { input.focus(); } }}
                    value={newValue}
                    onBlur={this.outBlur}
                    onFocus={() => {
                      // 选中文字，注意 type="number" 时不支持
                      let elem = ReactDOM.findDOMNode(this).querySelectorAll("input")[0];
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
                    onChange={e => this.handleInputChange(e, this.props.configurations.rowIdent, 'number')}
                    onKeyDown={this.enterOutBlur.bind(this)}
                    {...this.props.configurations.originalProps}
                  />;
                } else {
                  controller = <span>{newValue}</span>
                }
              } else {
                // console.log("备注一下");

                controller = <Input
                  ref={(input) => { if (input != null) { input.focus(); } }}
                  value={newValue}
                  onBlur={this.outBlur}
                  onChange={e => this.handleInputChange(e, this.props.configurations.rowIdent)}
                  {...this.props.configurations.originalProps}
                />
              }
              return controller;
            })()
          }
          </div>
          : <div className="inEditStatus-row-text" style={{ cursor: 'pointer' }} onClick={this.clickToEdit}>
            {((newValue || newValue === 0) && ((values) => {
              values = values.toString();
              if (this.props.configurations.type === 'rangepicker') {
                let pickedDate = values.split(',').map(item => moment(item).format('YYYY-MM-DD')).join(' ~ ');
                values = <Tooltip placement="leftTop" title={pickedDate}>
                  <div className="ellipsed-line width-150">{pickedDate}</div>
                </Tooltip>;
              } else if (values.length>18) {
                values = <Tooltip placement="leftTop" title={values}>
                  <div className="ellipsed-line width-150">{values}</div>
                </Tooltip>;
              }
              return values;
            })(newValue)) || ' '}
          </div>
        }
        <Modal
          title={<div>
            <span>请选择物资</span>
            <span style={{ marginRight: 50, float: 'right' }}><Search
              placeholder="请填写物资名称或编码"
              style={{ width: 200 }}
              value={this.state.selectValue}
              onChange={this.onChangeSelect}
              onSearch={this.onModalSearch}
            /></span>
          </div>}
          visible={this.state.popupGoodsVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width="1000"
          footer={[
            <Button key="back" size="large" onClick={this.handleCancel}>取消</Button>,
            <Button key="submit" type="primary" size="large" disabled={this.state.selectedRows.length === 0} onClick={this.handleOk}>
              选定
            </Button>,
          ]}
        >
          <Row gutter={16}>
            <Col span={6} style={{ }}>
              <Card title="物资类别" >
                <Tree
                  onSelect={this.onSelectTreeMenu}
                >
                  {loop(this.props.configurations.foundTreeList)}
                </Tree>
              </Card>
            </Col>
            <Col span={18}>
              <Table
                className="rows-clickable"
                size="small"
                rowKey={record => record.id}
                bordered={false}
                columns={columns}
                dataSource={tableData}
                rowSelection={rowSelection}
                onRowClick={this.selectRow}
                pagination={this.props.configurations.popListPagination}
                rowClassName={disabledStyle}
                // onChange={this.props.configurations.onPopPageChange}
                onChange={this.onPageChange}
                onShowSizeChange={this.props.configurations.onPopPageSizeChange}
                loading={this.props.configurations.goodsListLoading}
              />
            </Col>
          </Row>
        </Modal>
      </div>
    );
  }
}

InEditStatusCell.propTypes = {
  configurations: React.PropTypes.object.isRequired,
};
module.exports = InEditStatusCell;
