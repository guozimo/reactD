import React, { PropTypes } from 'react'
import { Form, Input, Button, Select, DatePicker, Icon, Row, Col, TreeSelect, Breadcrumb } from 'antd'
const TreeNode = TreeSelect.TreeNode;
import moment from 'moment';
const dateFormat = 'YYYY-MM-DD';
const Option = Select.Option


const search = ({
  menuData,
  storeList,
  onSearch,
  changeStore,
  selectStore,
  shopId,
  onChoosePop,
  onTreeChange,
  searchMenu,
  queryGoodsCode,
  queryGoodsId,
  onChooseCode,
  onClearCode,
  disabledStartDate,
  disabledEndDate,
  onStartChange,
  onEndChange,
  handleStartOpenChange,
  handleEndOpenChange,
  startDateValue,
  endDateValue,
  endDateOpen,
  onDataChange,
  onExport,
  onExportData,
  serverTime,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    getFieldValue,
  },
}) => {
  const timeNow = serverTime ? moment(serverTime) : moment();
  let startDateInit = startDateValue ? moment(startDateValue) : timeNow;
  let endDateInit = endDateValue ? moment(endDateValue) : timeNow;

  function handleSubmit(e) {
    e.preventDefault();

    validateFields((errors) => {
      if (!!errors) {
        return
      }
      const searchParam = getFieldsValue();
      if(searchParam.startDate){
        searchParam.startDate = searchParam.startDate.format(dateFormat);
      }
      if(searchParam.endDate){
        searchParam.endDate = searchParam.endDate.format(dateFormat);
      }
      if(!searchParam.goodsCategory){
        delete searchParam.goodsCategory;
      }
      searchParam.goodsId = queryGoodsId;
      searchParam.rows = 10;
      searchParam.type = 0;
      delete searchParam.goodsCode;
      searchParam.storeId = shopId;
      delete searchParam.shopName;
      onSearch(searchParam)
    })
  }
  //let treeValue = [];
  onTreeChange = (value) => {
  };

  onChooseCode =() => {
    onChoosePop()
  };
  changeStore = (value) => {
    selectStore(value);
  };
  onExport = () =>{
    const param = {};
    param.startDate = getFieldValue('startDate').format(dateFormat);
    param.endDate = getFieldValue('endDate').format(dateFormat);
    onExportData(param);
  };
  //日期处理函数
  disabledStartDate = (startDate) => {
    const endDate =moment(endDateValue);
    if (!startDate || !endDate) {
      return false;
    }
    return startDate.valueOf() > endDate.valueOf();
  };

  disabledEndDate = (endDate) => {
    const startDate = moment(startDateValue);
    if (!endDate || !startDate) {
      return false;
    }
    return endDate.valueOf() <= startDate.valueOf();
  };


  onStartChange = (value) => {
    const param = {
      'startDateValue': value.format(dateFormat)
    };
    onDataChange(param);
  };

  onEndChange = (value) => {
    const param = {
      'endDateValue': value.format(dateFormat)
    };
    onDataChange(param);
  };
  handleStartOpenChange = (open) => {
    if (!open) {
      const param = {
        'endDateOpen': true
      };
      onDataChange(param);
    }
  };

  handleEndOpenChange = (open) => {
    const param = {
      'endDateOpen': open
    };
    onDataChange(param);
  };


  const loop = data => (data ? data: []).map((item) => {
    if (item.children && item.children.length) {
      return <TreeNode key={item.id} value={item.id} title={item.name}>{loop(item.children)}</TreeNode>;
    }
    return <TreeNode key={item.id} value={item.id} title={item.name} />;
  });

  const storeOptions = storeList.map(store => <Option value={store.id} key={store.id}>{store.name}</Option>);
  return (
    <div className="components-search">
      <Breadcrumb separator=">">
        <Breadcrumb.Item>供应链</Breadcrumb.Item>
        <Breadcrumb.Item>成本管理</Breadcrumb.Item>
        <Breadcrumb.Item>核减明细查询</Breadcrumb.Item>
      </Breadcrumb>
      <div className="shop-select">
        <Form inline >
          <Form.Item label="门店名称">
            {getFieldDecorator('shopName', {
              initialValue: shopId || '请选择门店名称',
            })(
              <Select
                style={{ width: 160 }}
                onChange={changeStore}
              >
                {storeOptions}
              </Select>
            )}
          </Form.Item>
        </Form>
        {shopId && menuData['list'].hasOwnProperty('61600202') && <div className="right-act">
          <a onClick={onExport}><Icon type="export" />&nbsp;导出核减明细</a>
        </div>}
      </div>
      {shopId && <div className="search">
        <Form inline onSubmit={handleSubmit}>
          <Form.Item label="开始时间：" fieldNames="startDate">
            {getFieldDecorator('startDate', {
              initialValue: startDateInit,
            })(<DatePicker
              format={dateFormat}
              disabledDate={disabledStartDate}
              onChange={onStartChange}
              placeholder="开始时间"
              onOpenChange={handleStartOpenChange}
            />)}
          </Form.Item>
          <Form.Item label="结束时间：" fieldNames="endDate">
            {getFieldDecorator('endDate', {
              initialValue: endDateInit,
            })(<DatePicker
              format={dateFormat}
              disabledDate={disabledEndDate}
              onChange={onEndChange}
              placeholder="结束时间"
              open={endDateOpen}
              onOpenChange={handleEndOpenChange}
            />)}
          </Form.Item>
          <Form.Item label="物资编码：" fieldNames="goodsCode" className="input-addon-primary">
            {getFieldDecorator('goodsCode', {
              initialValue: queryGoodsCode || ''
            })(<Input placeholder="物资编码" disabled  addonAfter={<Icon type="search" title="点击选择物资编码" onClick={() => onChooseCode()}/>} />)}
          </Form.Item>
          <a href="javascript:void(0);" onClick={() => onClearCode()}>清空</a>
          <Form.Item label="类别：" fieldNames="goodsCategory">
            {getFieldDecorator('goodsCategory', {
              initialValue: "" || '',
            })(
              <TreeSelect
                style={{ width: 180 }}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto'}}
                treeCheckable
                multiple
                showCheckedStrategy={TreeSelect.SHOW_ALL}
                placeholder="请选择类别"
                treeDefaultExpandAll
                onChange={onTreeChange}
              >
                {loop(searchMenu)}
              </TreeSelect>
            )}
          </Form.Item>
          <Button type="primary" htmlType="submit">搜索</Button>
        </Form>
      </div>}
    </div>
  )
}

search.propTypes = {
  form: PropTypes.object.isRequired,
  onSearch: PropTypes.func,
  onChooseCode: PropTypes.func,
  onClearCode: PropTypes.func,
  onChoosePop: PropTypes.func,
  onTreeChange: PropTypes.func,
  disabledStartDate: PropTypes.func,
  disabledEndDate: PropTypes.func,
  onStartChange: PropTypes.func,
  onEndChange: PropTypes.func,
  handleStartOpenChange: PropTypes.func,
  handleEndOpenChange: PropTypes.func,
  onDataChange: PropTypes.func,
  searchMenu: PropTypes.array,
  queryGoodsCode: PropTypes.string,
  startDateValue: PropTypes.string,
  endDateValue: PropTypes.string,
  endDateOpen: PropTypes.bool,
  storeList: PropTypes.array,
  changeStore: PropTypes.func,
  selectStore: PropTypes.func,
  shopId: PropTypes.string,
  queryGoodsId: PropTypes.string,
  onExport: PropTypes.func,
  onExportData: PropTypes.func,
  serverTime: PropTypes.string,
}

export default Form.create()(search)
