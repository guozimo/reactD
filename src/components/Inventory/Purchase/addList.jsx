import React, { PropTypes } from 'react';
import { Table, Popconfirm, Icon, message, Tooltip, Button } from 'antd';
import _ from 'lodash';
import EditableCell from '../_components/EditableCellStore.jsx';


const addList = ({ dataSource,
  depotId,
  goodsId,
  editDone,
  addData,
  onDelete,
  renderColumns,
  selectData,
  focusFieldByField,
  handleSearch,
  onSave,
  onSelect,
  selectHandleValue,
  handleChange,
  updateEditableMem,
  keyPress,
  editableMem,
  queryCoding,
  queryGoodsCoding,
  goodsList,
  openGoodsModel,
  openModel,
  setItem,
  cancel,
  storeId,
  changeValue,
  onUpdateAdd,
  resyncDataSource,
  dataSourceIndex,

 }) => {
  editDone = (index) => {

    addData(index);
  };
  focusFieldByField=(targetField,index)=>{
    updateEditableMem(targetField,index);
  // currEditStatus[targetField]=true;
  // this.forceUpdate();
  }
handleChange = (value) => {

};
 // 打开物资弹窗
  openModel = (value) => {
    openGoodsModel(value);
  };
  changeValue = (value,itemKey,fieldName) => {
  // 更新文本框
    let rowItem = _.find(dataSource,item=>item.key==itemKey  );
    rowItem[fieldName] = value;
  // 联动更新
    if (fieldName === "goodsAmtNotax") {
      // console.log("inot goodsAmtNotax!")
      rowItem.goodsQty=(value?value/rowItem.goodsPrice:0);
    }else if (fieldName=="goodsQty") {
      rowItem.goodsAmtNotax=(value?value*rowItem.goodsPrice:0);//含税金额 goodsAmtNotax
      // console.log(
      //   "rowItem.taxRatio税率",rowItem.taxRatio,
      //   "rowItem.goodsPrice含税价",rowItem.goodsPrice,Number(rowItem.taxRatio),
      //   "总结",rowItem.goodsPrice/(1+rowItem.taxRatio)
      // );
      rowItem.unitPrice=(value?(rowItem.goodsPrice/(1+Number(rowItem.taxRatio))).toFixed(2):0); //不含税价 unitPrice 含税入库价 goodsPrice/1+税率 taxRatio
      rowItem.goodsTaxAmt=(value?value*rowItem.goodsPrice*rowItem.taxRatio:0);//税额 goodsTaxAmt 数量*含税入库价*税率 taxRatio
      rowItem.goodsAmt=(value?value*rowItem.unitPrice:0);//不含税金额 goodsAmt 不含税价*入库数量
  }

  Object.assign(rowItem,{a:1});
  // console.log("after dataSource",dataSource);
  dataSource = _.cloneDeep(dataSource);
  resyncDataSource(dataSource);
};
// console.log("我是物资--------",goodsList);
queryCoding = (value) => {
  // console.log("我i是",value);
  if(depotId){
    queryGoodsCoding(value,depotId);
  }else {
    message.error('仓库不能为空');
  }
};
handleSearch = (value) => {

  selectHandleValue(value);
 };
  keyPress = (value) => {
  };
  setItem = (itemValue,itemKey) => {
    let selectedItem = _.find(goodsList, item => item.goodsCode == itemValue);
    let rowItem = _.find(dataSource, item => item.key == itemKey);
    Object.assign(rowItem, selectedItem);
   };
   onSelect = (value) => {
   };
  const columns = [
    {
      title: '',
      dataIndex: 'key',
      key: 'key',
      width: '30',
      // fixed: 'left',
      render: (text, record, index) => (parseInt(index) + 1),
    },
    {
      title: '物资编码',
      width: 180,
      dataIndex: 'goodsCode',
      key: 'goodsCode',
      className: 'editable-col',
      fixed: 'left',
      render: (text, record, index) => renderColumns(text, record, index, 'goodsCode',
        {
          rowIdent: record.key,
          type: 'select',
          onChange: queryCoding,
          selectItem: setItem,
          keyValues: goodsList,
          disabled: !depotId || !storeId, // 根据条件判断是否能够搜索 true 不能搜索 false 能够搜索
          disabledList: (() =>{
            return dataSource.map(item => item.id);
          })()
        },
    ),
    }, {
      title: '物资名称',
      width: 80,
      dataIndex: 'goodsName',
      key: 'goodsName',
      fixed: 'left',
    }, {
      title: '规格',
      width: 80,
      dataIndex: 'goodsSpec',
      key: 'goodsSpec',
    }, {
      title: '标准',
      children: [
        {
          title: '数量',
          dataIndex: 'dualGoodsQty',
          width: 80,
          key: '21',
          className: 'editable-col',
          render: (text, record, index) => renderColumns(text, record, index, 'dualGoodsQty',{
              rowIdent: record.key,
              type: 'inputNumber',
              disabled: !depotId || !storeId, // 根据条件判断是否能够搜索 true 不能搜索 false 能够搜索
              updateValue: (value,itemKey)=>changeValue(value,itemKey,"dualGoodsQty"),
              transValue: record.dualGoodsQty,
          }),
        }, {
          title: '单位',
          width: 80,
          dataIndex: 'dualUnitName',
          key: '22',
        },
      ],
      dataIndex: 'assist',
      key: 'assist',
    }, {
      title: '辅助',
      children: [
        {
          title: '数量',
          dataIndex: 'dualGoodsQty',
          width: 80,
          key: '21',
          className: 'editable-col',
          render: (text, record, index) => renderColumns(text, record, index, 'dualGoodsQty',{
              rowIdent: record.key,
              type: 'inputNumber',
              disabled: !depotId || !storeId, // 根据条件判断是否能够搜索 true 不能搜索 false 能够搜索
              updateValue: (value,itemKey)=>changeValue(value,itemKey,"dualGoodsQty"),
              transValue: record.dualGoodsQty,
          }),
        }, {
          title: '单位',
          width: 80,
          dataIndex: 'dualUnitName',
          key: '22',
        },
      ],
      dataIndex: 'assist',
      key: 'assist',
    }, {
      title: '采购',
      children: [
        {
          title: '数量',
          dataIndex: 'dualGoodsQty',
          width: 80,
          key: '21',
          className: 'editable-col',
          render: (text, record, index) => renderColumns(text, record, index, 'dualGoodsQty',{
              rowIdent: record.key,
              type: 'inputNumber',
              disabled: !depotId || !storeId, // 根据条件判断是否能够搜索 true 不能搜索 false 能够搜索
              updateValue: (value,itemKey)=>changeValue(value,itemKey,"dualGoodsQty"),
              transValue: record.dualGoodsQty,
          }),
        }, {
          title: '单价',
          width: 80,
          dataIndex: 'dualUnitName',
          key: '22',
        }, {
          title: '金额',
          width: 80,
          dataIndex: 'dualUnitName',
          key: '22',
        },
      ],
      dataIndex: 'assist',
      key: 'assist',
    }, {
      title: '税率',
      width: 80,
      dataIndex: 'goodsSpec',
      key: 'goodsSpec',
    }, {
      title: '含税金额',
      width: 80,
      dataIndex: 'goodsAmtNotax',
      key: 'goodsAmtNotax',
      render: (text, record, index) => renderColumns(text, record, index, 'goodsAmtNotax',{
        rowIdent: record.key,
        type: 'inputNumber',
        disabled: !depotId || !storeId, // 根据条件判断是否能够搜索 true 不能搜索 false 能够搜索
        updateValue: (value,itemKey)=>changeValue(value,itemKey,"goodsAmtNotax"),
        transValue: record.goodsAmtNotax,//(record.goodsQty?record.goodsQty*record.goodsPrice:0),
      }),
    }, {
      title: '备注',
      key: 'remarks',
      dataIndex: 'remarks',
      render: (text, record, index) => renderColumns(text, record, index, 'remarks',{
        rowIdent: record.key,
        disabled: !depotId || !storeId, // 根据条件判断是否能够搜索 true 不能搜索 false 能够搜索
        updateValue: (value,itemKey)=>changeValue(value,itemKey,"remarks"),
        transValue: record.remarks,//(record.goodsQty?record.goodsQty*record.goodsPrice:0),
      }),
    }, {
      title: '设置',
      key: 'operation',
      fixed: 'right',
      width: 80,
      render: (text, record, index) => {
          // const { editable } = text.goodsName;
          // console.log("editable",editable);
        return (
          <div>
          {
            <Tooltip placement="top" title="新增一行">
            <a onClick={
              ()=> editDone(index)
            }
            >
            <Icon type="plus" style={{ fontSize: 20, color: '#08c', cursor: 'pointer' }} />
            </a>
            </Tooltip>
          }
          <span className="ant-divider" />
          {
            dataSource.length > 1 ?
          (
            <Popconfirm title={<div><span style={{ color: '#f04134' }}>危险操作！</span><br /><span>删除后可能无法恢复，确定继续删除吗？</span></div>}
              okText="确认删除"
              onConfirm={() => onDelete(index)}>
              <a href="#">
              <Icon type="minus" style={{ fontSize: 20, color: 'red', cursor: 'pointer' }} />
              </a>
            </Popconfirm>
          ) : null
          }
          < /div>
        );
      },
    },
  ];
 renderColumns = (text, record, index, field,configurations) => {
    // const { editable, status } = data[index][field];
    // console.log("renderColumns_index",index,editableMem);
    let editable="",status=false,currEditStatus=editableMem[index];

    let fields=Object.keys(currEditStatus);
  // console.log("editableMem-a----",index,"fields",fields,"field",field);
  // console.log("editableMem-b----",index,"if",(!_.has(editableMem[index],field)),(index==editableMem.length-1&&field==fields[0]) );
  let newdataSourceIndex = 1;
  dataSourceIndex && dataSourceIndex.length ? (newdataSourceIndex = dataSourceIndex.length) : newdataSourceIndex;

    if (!_.has(editableMem[index],field)) {
      if (index==editableMem.length-1&&(field==fields[0]||fields.length==0)&& editableMem.length !== newdataSourceIndex) {

        currEditStatus[field]=true;
      }else{
      currEditStatus[field]=false;//默认不在编辑状态
    }}

    // resetEditableMem(editableMem);

    if (typeof editable === 'undefined') {
      return text;
    }
    // console.log("11111111111111111111currEditStatus",currEditStatus);
    return (<EditableCell
      configurations={configurations}
      inEditStatus={currEditStatus}
      field={field}
      inValue={text}
      onChange={value => this.handleChange(field, index, value)}
      status={status}
      openModel={openModel}
      goodsList={goodsList}
      focusField={focusFieldByField}
      rowIndex={index}
      clickToEdit={()=>{
        // console.log("22222currEditStatus",currEditStatus);
        currEditStatus[field]=!currEditStatus[field];
      }}
    />);
  };
  return (
    <div>
      <Table
        bordered
        size="small"
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        scroll={{ x: '140%'}}
        onRowClick={onUpdateAdd}
        rowClassName={() => 'editable-row'}
      />

      <Button type="primary" onClick={() => onSave(1)}>暂存</Button>  <Button type="primary" onClick={()=>onSave(0)}>确认</Button>   <Button onClick={cancel} type="primary">取消</Button>
    </div>
  );
};
addList.propTypes = {
  dataSource: PropTypes.array,
  editableMem: PropTypes.array,
  focusFieldByField: PropTypes.func,
  updateEditableMem: PropTypes.func,
  editDone: PropTypes.func,
  onSave: PropTypes.func,
  resyncDataSource: PropTypes.func,
  keyPress: PropTypes.func,
  handleSearch: PropTypes.func,
  queryCoding: PropTypes.func,
  queryGoodsCoding: PropTypes.func,
  handleChange: PropTypes.func,
  openGoodsModel: PropTypes.func,
  selectHandleValue: PropTypes.func,
  onSelect: PropTypes.func,
  addData: PropTypes.func,
  setItem: PropTypes.func,
  renderColumns: PropTypes.func,
  onDelete: PropTypes.func,
  cancel: PropTypes.func,
  addCount: PropTypes.func,
  count: PropTypes.number,
  changeValue: PropTypes.func,
};
export default addList;
