import React, { PropTypes } from 'react'
import { Table, Icon, Button, message, Tooltip, Popconfirm, Pagination,Alert } from 'antd'
import EditableCell from '../_components/EditableCellStore2.jsx';
import _ from 'lodash';
const listAdd = ({
  loading,
  storeId,
  pagination,
  onPageSizeChange,
  dataList,
  editableMem, // 新增编码数组
  queryCoding, // 修改仓库
  queryGoodsCoding, //修改数据
  newData,
  dataSource,
  setItem,
  goodsList,
  changeValue, // 修改数量
  renderColumns, // 编辑数据
  focusFieldByField, // 回车跳转新的边框或者新增一行
  openModel,
  openGoodsModel,
  updateEditableMem, // 回车跳转新的边框或者新增一行
  addData, // 新增一行
  onDelete, // 删除一行
  onSave, // 暂存/调拨
  cancel, // 取消
  resyncDataSource, // 联动修改数量
  findTreeList, // modal编辑弹框物资类别
  scmInGoodsList, // modal编辑弹框物资全部
  paginationGoods, // modal物资分类分页
  onSelectMenu, // modal选择类别跳转
  onModalChange, // modal 修改
  onPageChange, // modal修改分页
  okHideModal, // modal提交全部
  outDepotId, // 新增调出仓库ID
  inDepotId, // 新增调入仓库ID
  goodsVisible,
}) => {
  const columns = [
    {
      title: '物资编码',
      dataIndex: 'goodsCode',
      key: 'goodsCode',
      className: 'editable-col',
      render: (text, record, index) => renderColumns(text, record, index, 'goodsCode',
        {
          rowIdent: record.key,
          type: 'select',
          onChange: queryCoding,
          selectItem: setItem,
          keyValues: goodsList,
          disabledList: (() => {
            return dataSource.map(item => item.id);
          })()
        },
      ),
    }, {
      title: '物资名称',
      dataIndex: 'goodsName',
      key: 'goodsName',
    }, {
      title: '规格型号',
      dataIndex: 'goodsSpec',
      key: 'goodsSpec',
    }, {
      title: '单位',
      dataIndex: 'unitName',
      key: 'unitName',
    }, {
      title: '数量',
      dataIndex: 'goodsQty',
      width: 80,
      key: 'goodsQty',
      className: 'editable-col',
      render: (text, record, index) => renderColumns(text, record, index, 'goodsQty', {
        rowIdent: record.key,
        type: 'InputNumber',
        updateValue: (value, itemKey) => changeValue(value, itemKey, 'goodsQty'),
        transValue: record.goodsQty, // (record.goodsAmtNotax?record.goodsAmtNotax/record.goodsPrice:0),
      }),
    }, {
      title: '库存数量',
      dataIndex: 'wareQty',
      width: 80,
      key: 'wareQty',
    }, {
      title: '单价',
      dataIndex: 'unitPrice',
      width: 80,
      key: 'unitPrice',
    }, {
      title: '金额',
      dataIndex: 'goodsAmt',
      width: 80,
      key: 'goodsAmt',
    }, {
      title: '备注',
      dataIndex: 'remarks',
      width: 100,
      key: 'remarks',
      className: 'editable-col',
      render: (text, record, index) => renderColumns(text, record, index, 'remarks', {
        rowIdent: record.key,
        maxLength: 25,
        updateValue: (value, itemKey) => changeValue(value, itemKey, 'remarks'),
        transValue: record.remarks, // (record.goodsQty?record.goodsQty*record.goodsPrice:0),
      }),
    }, {
      title: '设置',
      key: 'action',
      render: (text, record, index) => {
        return (
          <div>
            {
              <Tooltip placement="top" title="新增一行" onClick={() => addData(index)}>
                <a>
                  <Icon type="plus" style={{ fontSize: 20, color: '#08c', cursor: 'pointer' }} />
                </a>
              </Tooltip>
            }
            <span className="ant-divider" />
            {
              dataSource.length > 1 ?
            (
              <Popconfirm
              title={<div><span style={{ color: '#f04134' }}>危险操作！</span><br /><span>删除后可能无法恢复，确定继续删除吗？</span></div>}
              okText="确认删除"
              onConfirm={() => onDelete(index)}>
                <a>
                  <Icon type="minus" style={{ fontSize: 20, color: 'red', cursor: 'pointer' }} />
                </a>
              </Popconfirm>
            ) : null
            }
          < /div>
        );
      },
    }];
  focusFieldByField = (targetField, index) => { // 回车跳转新的边框或者新增一行
    updateEditableMem(targetField, index);
  // currEditStatus[targetField]=true;
  // this.forceUpdate();
  };
  changeValue = (value, itemKey, fieldName) => {
    // console.log('修改数量fieldName', fieldName, 'itemKey', itemKey, 'value', value)
  // 更新文本框
    const rowItem = _.find(dataSource, item => item.key === itemKey);
    rowItem[fieldName] = value;
    // console.log('修改数量rowItem[fieldName]', rowItem[fieldName])

  // 联动更新
    if (fieldName === 'goodsAmtNotax') {
      rowItem.goodsQty = (value ? value / rowItem.goodsPrice : 0);
    } else if (fieldName === 'goodsQty') {
      rowItem.goodsAmtNotax = (value ? value * rowItem.goodsPrice : 0); // 含税入库价 goodsPrice 含税金额 goodsAmtNotax
      // console.log(
      //   "rowItem.goodsAmtNotax含税金额",rowItem.goodsAmtNotax,
      //   "rowItem.taxRatio税率",rowItem.taxRatio,
      //   "rowItem.goodsPrice含税价",rowItem.goodsPrice,Number(rowItem.taxRatio),
      //   "总结",rowItem.goodsPrice/(1+rowItem.taxRatio)
      // );
      rowItem.unitPrice = (value ? (rowItem.goodsPrice / (1 + Number(rowItem.taxRatio))).toFixed(2) : 0); // 不含税价 unitPrice 含税入库价 goodsPrice/1+税率 taxRatio
      rowItem.goodsTaxAmt = (value ? value * rowItem.goodsPrice * rowItem.taxRatio : 0); // 税额 goodsTaxAmt 数量*含税入库价*税率 taxRatio
      rowItem.goodsAmt = (value ? value * rowItem.unitPrice : 0); // 不含税金额 goodsAmt 不含税价*入库数量
    }
    Object.assign(rowItem, {a : 1 });
    // console.log("after dataSource",dataSource);
    dataSource = _.cloneDeep(dataSource);
    resyncDataSource(dataSource);
  };
  onModalChange = (type, value) => {
    if (type === 'selectMenu') {
      onSelectMenu(value);
    } else if (type === 'page') {
      onPageChange(value);
    } else if (type === 'handleOk') {
      okHideModal(value);
    }
  }
  queryCoding = (value) => { // 编辑table搜索编码
    if (!storeId || !outDepotId) {
      message.error('调出仓库不能为空！');
      return false;
    } else if (!storeId || !inDepotId) {
      message.error('调入仓库不能为空！');
      return false;
    } else {
      queryGoodsCoding(value);
    }

  };
  setItem = (itemValue, itemKey) => { // 选择编码后赋值
    const selectedItem = _.find(goodsList, item => item.goodsCode === itemValue);
    const rowItem = _.find(dataSource, item => item.key === itemKey);
    console.log("rowItem", rowItem,"selectedItem", selectedItem);
    Object.assign(rowItem, selectedItem);
  };

  openModel =(value) => {
    if (!storeId || !outDepotId) {
      message.error('调出仓库不能为空！');
      return false;
    } else if (!storeId || !inDepotId) {
      message.error('调入仓库不能为空！');
      return false;
    } else {
      openGoodsModel(value);
    }

  };
  renderColumns = (text, record, index, field, configurations) => {
   // const { editable, status } = data[index][field];
  //  console.log("renderColumns_index",index,editableMem);
   let editable="", status = false, currEditStatus= editableMem[index];
  //  console.log("currEditStatus",index,editableMem[index],currEditStatus);
   let fields=Object.keys(currEditStatus);
 // console.log("editableMem-a----",index,"fields",fields,"field",field);
 // console.log("editableMem-b----",index,"if",(!_.has(editableMem[index],field)),(index==editableMem.length-1&&field==fields[0]) );
   if (!_.has(editableMem[index], field)) {
     if (index==editableMem.length-1&&(field==fields[0]||fields.length==0)&& editableMem.length !== 1) { // 第一条不能是自动选中状态

       currEditStatus[field]=true;
     }else{
     currEditStatus[field]=false; // 默认不在编辑状态
   }}

   // resetEditableMem(editableMem);

   if (typeof editable === 'undefined') {
     return text;
   }
  const modalList = { findTreeList, scmInGoodsList, paginationGoods}
   // console.log("11111111111111111111currEditStatus",currEditStatus);
   return (<EditableCell
     configurations={configurations}
     inEditStatus={currEditStatus}
     field={field}
     inValue={text}
     onChange={value => this.handleChange(field, index, value)}
     status={status}
     goodsList={goodsList}
     focusField={focusFieldByField}
     rowIndex={index}
     openModel={openModel}
     goodsVisible={goodsVisible}
     onModalChange={onModalChange}
     modalList={modalList}
     clickToEdit={()=>{
       // console.log("22222currEditStatus",currEditStatus);
       currEditStatus[field]=!currEditStatus[field];
     }}
   />);
 };
 //  scroll={{ x: '1500' }}
  return (
    <div className="components-listAdd">
      <br />
      <div>
        <Table
          size="small"
          columns={columns}
          loading={loading}
          dataSource={dataSource}
          rowClassName={() => 'editable-row'}
          pagination={false}
        />
        <br />
        <span> <Button type="primary" onClick={() => onSave(1)}>暂存</Button>
          <Button type="primary" style={{ marginLeft: 16 }} onClick={() => onSave(0)}>调拨</Button>
          <Button onClick={cancel} style={{ marginLeft: 16 }}  type="primary">取消</Button>
        </span>
      </div>
    </div>
  );
};

listAdd.propTypes = {
  loading: PropTypes.bool,
  storeId: PropTypes.string,
  onPageChange: PropTypes.func,
  onPageSizeChange: PropTypes.func,
  openModel: PropTypes.func,
  updateEditableMem: PropTypes.func,
};
export default listAdd;
