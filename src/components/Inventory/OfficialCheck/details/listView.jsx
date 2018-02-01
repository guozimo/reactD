import React, { PropTypes } from 'react';
import moment from 'moment';
import _ from 'lodash';
import { Table, Icon, Button, Tag, Tooltip, Popconfirm, message, Modal } from 'antd';
import EditableCell from '../../_components/EditableCell2';

const OfficialCheckDetailsList = ({
  // module state
  reposId,
  opType,
  loadingList,
  pageDetail,
  editableMem,
  goodsList,
  pageStatus,
  savingStatus,
  bussDate,
  checkTypes,

  goodsPopListModel, // 弹窗数据
  popupListPagination,
  foundTreeList,
  popupListLoading,

  // module 方法
  switchType,
  resyncDataSource,
  getGoodsListByTyping,
  syncMem,
  openGoodsModel,
  syncSeletedItemIntoRow,
  insertNewRowAfterIndex,
  removeRowAtIndex,
  saveDetails,
  cancelDetailPage,
  switchEditingStatus,
  toNextMem,
  toggleMemStatus,

  getGoodsListdata,
  onPopupPageChange,
  onPopupPageSizeChange,
  onSelectedTreeItem,
  selectModalSearch,

  // 私有方法
  renderColumns,
  refreshList,
  selectedAGoods,
  selectedListGoods,
  openModel,
  showGoodsListByTyping,
  savePageData,
  checkEditable,
  onCloseModel,
  dataSourceIndex,
}) => {
  // 序号 物资编码 物资名称 规格型号 订货单位 订货数量 标准单位 标准数量 备注 操作
  let columnsConfig = [];
  let listData = pageDetail;
  let editableColName = [];
  checkEditable = () => {
    if (!reposId && !checkTypes) {
      message.error('请先选择盘点仓库和盘点类型！');
      return false;
    }
    if (!reposId) {
      message.error('请先选择盘点仓库！');
      return false;
    }
    if (!checkTypes) {
      message.error('请先选择盘点类型！');
      return false;
    }
    return true;
  };
  // pageDetail = pageDetail.results ? pageDetail.results : {};
  // console.log('pageDetail', pageDetail);
  // if (Object.keys(pageDetail).length) {
  //   listData = pageDetail.detailList;
  // console.log('listData', listData);
  // }
  // console.log("test moment",checkTypes,"checkTypes", checkTypes == '942')
  if (opType === 'view') {
    columnsConfig = [{
      title: '',
      dataIndex: 'index',
      key: 'index',
      width: 40,
      render: (text, record, index) => (parseInt(index) + 1),
    }, {
      title: '物资编码',
      dataIndex: 'goodsCode',
      key: 'goodsCode',
      width: 140,
    }, {
      title: '名称',
      dataIndex: 'goodsName',
      key: 'goodsName',
      width: 70,
      render: (text, record) =>(
        <div>
        {
          record.status === 0 ? <Tooltip placement="left" title="已停用">
            <Tag color='orange'>{text}</Tag>
          </Tooltip>: text
        }
        </div>
      ) ,
    }, {
      title: '规格',
      dataIndex: 'goodsSpec',
      key: 'goodsSpec',
      width: 70,
    }, {
      title: '标准',
      children: [{
        title: '账面',
        dataIndex: 'accQty',
        key: 'accQty',
        width: 70,
      }, {
        title: '实盘',
        dataIndex: 'checkQty',
        key: 'checkQty',
        width: 70,
      }, {
        title: '单位',
        dataIndex: 'checkUnitName',
        key: 'checkUnitName',
        width: 70,
      }, {
        title: '单价',
        dataIndex: 'profitPrice',
        key: 'profitPrice',
        width: 70,
      }]
    }, {
      title: '辅助',
      children: [{
        title: '账面',
        dataIndex: 'dualAccQty',
        key: 'dualAccQty',
        width: 70,
      }, {
        title: '实盘',
        dataIndex: 'dualGoodsQty',
        key: 'dualGoodsQty',
        width: 70,
      }, {
        title: '单位',
        dataIndex: 'dualUnitName',
        key: 'dualUnitName',
        width: 70,
      }],
    // }, {
    //   title: '库存',
    //   children: [{
    //     title: '单价',
    //     dataIndex: 'profitPrice',
    //     key: 'profitPrice',
    //   }, {
    //     title: '数量',
    //     dataIndex: 'goodsQty',
    //     key: 'goodsQty',
    //   }],
    }, {
      title: '盈亏',
      children: [{
        title: '数量',
        dataIndex: 'profLossQty',
        key: 'profLossQty',
        width: 70,
        render: text => text && text !== '0' ? Number(text).toFixed(2) : text,
      }, {
        title: '金额',
        dataIndex: 'profLossAmt',
        key: 'profLossAmt',
        width: 70,
        render: text => text && text !== '0' ? Number(text).toFixed(2) : text,
      }]
    }, {
      title: '备注',
      dataIndex: 'remarks',
      key: 'remarks',
      width: 150,
      render: text => <Tooltip placement="leftTop" title={text}>
        <div className="ellipsed-line width-150">{text}</div>
      </Tooltip>
    }];
  } else if (opType === 'create' && checkTypes !== '942') {
    columnsConfig = [{
      title: '',
      dataIndex: 'index',
      key: 'index',
      width: 40,
      render: (text, record, index) => (parseInt(index) + 1),
    }, {
      title: '物资编码',
      dataIndex: 'goodsCode',
      key: 'goodsCode',
      width: 140,
      className: 'editable-col',
      render: (text, record, index) => renderColumns(text, record, index, 'goodsCode', {
        rowIdent: record.id,
        type: 'select',
        onKeyEnter: () => {
          // if (parseInt(record.dualUnitFlag, 10)) { // 默认跳到下一列编辑框
          toNextMem(index, 'goodsCode');
          // } else { // 是双单位物资，越过下一列dualGoodsQty辅助实盘的编辑
          //   toNextMem(index, 'goodsCode', 2);
          // }
        },
        disabled: !reposId || !checkTypes, // 根据条件判断是否能够使用 true 不能使用 false 能够使用

        onChange: showGoodsListByTyping, // 手动输入的回调
        selectItem: (itemValue, itemId) => {
          toNextMem(index, 'goodsCode');
          selectedAGoods(itemValue, itemId, index, 'goodsCode');
        }, // 选择手动输入后列表的一个项目
        keyValues: goodsList, // 显示响应手动输入的列表数据
        disabledList: (() => listData.map(item => item.goodsCode))(), // 指定下拉列表中和弹窗列表中已显示的不让其可选，暂时实现只匹配ID

        getPopListData: getGoodsListdata, // 第一次显示列表时触发获取数据的方法
        popListData: goodsPopListModel, // getPopListData 获取的 table 里的数据
        cbReceiveChoose: (data) => { // 选择的几条数据
          const selectedList = _.cloneDeep(data);
          selectedListGoods(selectedList, index, 'goodsCode', true);
        },

        foundTreeList, // tree 数据
        onSelectTreeItem: value => onSelectedTreeItem(value), // 选择tree的类别节点
        onModalSearch: value => selectModalSearch(value), // modal的模糊搜索
        onCloseModel: value => onCloseModel(value), // modal的关闭触发
        goodsListLoading: popupListLoading,

        popListPagination: popupListPagination, // 翻页配置
        onPopPageChange: onPopupPageChange, // 翻页方法
        onPopPageSizeChange: onPopupPageSizeChange, // 修改页尺寸
        originalProps: {
          // onFocusInput: () => toggleMemStatus(index, 'goodsCode'), // 修改其他的编辑状态为非编辑状态
        },
      }),
    }, {
      title: '名称',
      dataIndex: 'goodsName',
      key: 'goodsName',
      width: 70,
      render: (text, record) =>(
        <div>
        {
          record.status === 0 ? <Tooltip placement="left" title="已停用">
            <Tag color='orange'>{text}</Tag>
          </Tooltip>: text
        }
        </div>
      ) ,
    }, {
      title: '规格',
      dataIndex: 'goodsSpec',
      key: 'goodsSpec',
      width: 70,
    }, {
      title: '标准',
      children: [{
        title: '账面',
        dataIndex: 'wareQty',
        key: 'wareQty',
        width: 70,
      }, {
        title: '实盘',
        dataIndex: 'checkQty',
        key: 'checkQty',
        width: 70,
        className: 'editable-col',
        render: (text, record, index) => renderColumns(text, record, index, 'checkQty', {
          type: 'number',
          rowIdent: record.id,
          updateValue: (value, itemKey) => refreshList(value, itemKey, 'checkQty', index),
          transValue: record.checkQty,
          disabled: !reposId || !checkTypes, // 根据条件判断是否能够使用 true 不能使用 false 能够使用
          originalProps: {
            style: { width: 50 },
            min: 0,
            onPressEnter: () => toNextMem(index, 'checkQty', (record.dualUnitName ? false : true)), // 跳转到下一个编辑状态
            // onFocusInput: () => toggleMemStatus(index, 'checkQty'), // 修改其他的编辑状态为非编辑状态
          },
        }),
      }, {
        title: '单位', // 表格显示时用unitName
        dataIndex: 'unitName',
        key: 'unitName',
        width: 70,
      }, {
        title: '单价',
        dataIndex: 'averPrice',
        key: 'averPrice',
        width: 70,
      }]
    }, {
      title: '辅助',
      children: [{
        title: '账面',
        dataIndex: 'dualWareQty',
        key: 'dualWareQty',
        width: 70,
      }, {
        title: '实盘',
        dataIndex: 'dualGoodsQty',
        key: 'dualGoodsQty',
        width: 70,
        className: 'editable-col',
        render: (text, record, index) => renderColumns(text, record, index, 'dualGoodsQty', {
          type: 'number',
          rowIdent: record.id,
          updateValue: (value, itemKey) => refreshList(value, itemKey, 'dualGoodsQty', index),
          transValue: record.dualGoodsQty,
          disabled: !reposId || !checkTypes || parseInt(record.dualUnitFlag, 10) !== 1, // 根据条件判断是否能够使用 true 不能使用 false 能够使用
          originalProps: {
            style: { width: 50 },
            min: 0,
            onPressEnter: () => toNextMem(index, 'dualGoodsQty'), // 跳转到下一个编辑状态
            // onFocusInput: () => toggleMemStatus(index, 'dualGoodsQty'), // 修改其他的编辑状态为非编辑状态
          },
        }),
      }, {
        title: '单位',
        dataIndex: 'dualUnitName',
        key: 'dualUnitName',
        width: 70,
      }],
    }, {
      title: '盈亏',
      children: [{
        title: '数量',
        dataIndex: 'profLossQty', // 标准实盘-标准账面
        key: 'profLossQty',
        width: 70,
        render: text => text && text !== '0' ? Number(text).toFixed(2) : text,
      }, {
        title: '金额',
        dataIndex: 'profLossAmt', // 盈亏数量*标准单价
        key: 'profLossAmt',
        width: 70,
        render: text => text && text !== '0' ? Number(text).toFixed(2) : text,
      }]
    }, {
      title: '备注',
      dataIndex: 'remarks',
      width: 150,
      key: 'remarks',
      className: 'editable-col',
      render: (text, record, index) => renderColumns(text, record, index, 'remarks', {
        rowIdent: record.id,
        updateValue: (value, itemKey) => refreshList(value, itemKey, 'remarks', index),
        transValue: record.remarks,
        disabled: !reposId || !checkTypes, // 根据条件判断是否能够使用 true 不能使用 false 能够使用
        maxLength: 25,
        originalProps: {
          style: { width: 80 },
          onPressEnter: () => toNextMem(index, 'remarks'), // 跳转到下一个编辑状态
          // onFocusInput: () => toggleMemStatus(index, 'remarks'), // 修改其他的编辑状态为非编辑状态
        },
      }),
    }, {
      title: '操作',
      dataIndex: 'options',
      key: 'options',
      fixed: 'right',
      width: 80,
      render: (text, record, index) => <div>
        <Tooltip placement="top" title="新增一行">
          {((checkTypes && checkTypes.toString() === '941') || !checkTypes) && <Icon
            type="plus"
            style={{ fontSize: 20, color: '#08c', cursor: 'pointer' }}
            onClick={() => insertNewRowAfterIndex(index)}
          />}
        </Tooltip>
        {
          listData.length > 1
          ? record.goodsCode ? <Popconfirm
            title={<div><span style={{ color: '#f04134' }}>危险操作！</span><br /><span>删除后可能无法恢复，确定继续删除吗？</span></div>}
            onConfirm={() => removeRowAtIndex(record.id, index)}
            okText="确认删除"
            >
            <Icon type="minus" style={{ fontSize: 20, color: 'red', cursor: 'pointer' }} />
          </Popconfirm> : <Icon type="minus" onClick={() => removeRowAtIndex(record.id, index)} style={{ fontSize: 20, color: 'red', cursor: 'pointer' }} />
          : null
        }
      </div>,
    }];
  } else if (opType === 'create' && checkTypes === '942') { // 判断周盘时不能添加和修改数据
    columnsConfig = [{
      title: '',
      dataIndex: 'index',
      key: 'index',
      width: 40,
      render: (text, record, index) => (parseInt(index) + 1),
    }, {
      title: '物资编码',
      dataIndex: 'goodsCode',
      key: 'goodsCode',
      width: 140,
    }, {
      title: '名称',
      dataIndex: 'goodsName',
      key: 'goodsName',
      width: 70,
    }, {
      title: '规格',
      dataIndex: 'goodsSpec',
      key: 'goodsSpec',
      width: 70,
    }, {
      title: '标准',
      children: [{
        title: '账面',
        dataIndex: 'wareQty',
        key: 'wareQty',
        width: 70,
      }, {
        title: '实盘',
        dataIndex: 'checkQty',
        key: 'checkQty',
        width: 70,
        className: 'editable-col',
        render: (text, record, index) => renderColumns(text, record, index, 'checkQty', {
          type: 'number',
          rowIdent: record.id,
          updateValue: (value, itemKey) => refreshList(value, itemKey, 'checkQty', index),
          transValue: record.checkQty,
          disabled: !reposId || !checkTypes, // 根据条件判断是否能够使用 true 不能使用 false 能够使用
          originalProps: {
            min: 0,
            onPressEnter: () => toNextMem(index, 'checkQty', (record.dualUnitName ? false : true)), // 跳转到下一个编辑状态
            // onFocusInput: () => toggleMemStatus(index, 'checkQty'), // 修改其他的编辑状态为非编辑状态
          },
        }),
      }, {
        title: '单位', // 表格显示时用unitName
        dataIndex: 'unitName',
        key: 'unitName',
        width: 70,
      }, {
        title: '单价',
        dataIndex: 'averPrice',
        key: 'averPrice',
        width: 70,
      }]
    }, {
      title: '辅助',
      children: [{
        title: '账面',
        dataIndex: 'dualWareQty',
        key: 'dualWareQty',
        width: 70,
      }, {
        title: '实盘',
        dataIndex: 'dualGoodsQty',
        key: 'dualGoodsQty',
        width: 70,
        className: 'editable-col',
        render: (text, record, index) => renderColumns(text, record, index, 'dualGoodsQty', {
          type: 'number',
          rowIdent: record.id,
          updateValue: (value, itemKey) => refreshList(value, itemKey, 'dualGoodsQty', index),
          transValue: record.dualGoodsQty,
          disabled: !reposId || !checkTypes || parseInt(record.dualUnitFlag, 10) !== 1, // 根据条件判断是否能够使用 true 不能使用 false 能够使用
          originalProps: {
            min: 0,
            onPressEnter: () => toNextMem(index, 'dualGoodsQty'), // 跳转到下一个编辑状态
            // onFocusInput: () => toggleMemStatus(index, 'dualGoodsQty'), // 修改其他的编辑状态为非编辑状态
          },
        }),
      }, {
        title: '单位',
        dataIndex: 'dualUnitName',
        key: 'dualUnitName',
        width: 70,
      }],
    }, {
      title: '盈亏',
      children: [{
        title: '数量',
        dataIndex: 'profLossQty', // 标准实盘-标准账面
        key: 'profLossQty',
        width: 70,
        render: text => text && text !== '0' ? Number(text).toFixed(2) : text,
      }, {
        title: '金额',
        dataIndex: 'profLossAmt', // 盈亏数量*标准单价
        key: 'profLossAmt',
        width: 70,
        render: text => text && text !== '0' ? Number(text).toFixed(2) : text,
      }]
    }, {
      title: '备注',
      dataIndex: 'remarks',
      width: 150,
      key: 'remarks',
      className: 'editable-col',
      render: (text, record, index) => renderColumns(text, record, index, 'remarks', {
        rowIdent: record.id,
        updateValue: (value, itemKey) => refreshList(value, itemKey, 'remarks', index),
        transValue: record.remarks,
        disabled: !reposId || !checkTypes, // 根据条件判断是否能够使用 true 不能使用 false 能够使用
        maxLength: 25,
        originalProps: {
          style: { width: 80 },
          onPressEnter: () => toNextMem(index, 'remarks'), // 跳转到下一个编辑状态
          // onFocusInput: () => toggleMemStatus(index, 'remarks'), // 修改其他的编辑状态为非编辑状态
        },
      }),
    }, {
      title: '操作',
      dataIndex: 'options',
      key: 'options',
      fixed: 'right',
      width: 80,
      render: (text, record, index) => <div>
        <Tooltip placement="top" title="新增一行">
          {((checkTypes && checkTypes.toString() === '941') || !checkTypes) && <Icon
            type="plus"
            style={{ fontSize: 20, color: '#08c', cursor: 'pointer' }}
            onClick={() => insertNewRowAfterIndex(index)}
          />}
        </Tooltip>
        {
          listData.length > 1
          ? record.goodsCode ? <Popconfirm
            okText="确认删除"
            title={<div><span style={{ color: '#f04134' }}>危险操作！</span><br /><span>删除后可能无法恢复，确定继续删除吗？</span></div>} onConfirm={() => removeRowAtIndex(record.id, index)}>
            <Icon type="minus" style={{ fontSize: 20, color: 'red', cursor: 'pointer' }} />
          </Popconfirm> : <Icon type="minus" onClick={() => removeRowAtIndex(record.id, index)} style={{ fontSize: 20, color: 'red', cursor: 'pointer' }} />
          : null
        }
      </div>,
    }];
  } else if (checkTypes == '942') { // 判断周盘时不能添加和修改数据
    // console.warn("我进来了");
    columnsConfig = [{
      title: '',
      dataIndex: 'index',
      key: 'index',
      width: 40,
      render: (text, record, index) => (parseInt(index) + 1),
    }, {
      title: '物资编码',
      dataIndex: 'goodsCode',
      key: 'goodsCode',
      width: 140,
    }, {
      title: '名称',
      dataIndex: 'goodsName',
      key: 'goodsName',
      width: 70,
    }, {
      title: '规格',
      dataIndex: 'goodsSpec',
      key: 'goodsSpec',
      width: 70,
    }, {
      title: '标准',
      children: [{
        title: '账面',
        dataIndex: 'accQty',
        key: 'accQty',
        width: 70,
      }, {
        title: '实盘',
        dataIndex: 'checkQty',
        key: 'checkQty',
        width: 70,
        className: 'editable-col',
        render: (text, record, index) => renderColumns(text, record, index, 'checkQty', {
          type: 'number',
          rowIdent: record.id,
          updateValue: (value, itemKey) => refreshList(value, itemKey, 'checkQty', index),
          transValue: record.checkQty,
          disabled: !reposId || !checkTypes, // 根据条件判断是否能够使用 true 不能使用 false 能够使用
          originalProps: {
            min: 0,
            onPressEnter: () => toNextMem(index, 'checkQty', (record.dualUnitName ? false : true)), // 跳转到下一个编辑状态
            // onFocusInput: () => toggleMemStatus(index, 'checkQty'), // 修改其他的编辑状态为非编辑状态
          },
        }),
      }, {
        title: '单位',
        dataIndex: 'checkUnitName',
        key: 'checkUnitName',
        width: 70,
      }, {
        title: '单价',
        dataIndex: 'profitPrice',
        key: 'profitPrice',
        width: 70,
      }]
    }, {
      title: '辅助',
      children: [{
        title: '账面',
        dataIndex: 'dualAccQty',
        key: 'dualAccQty',
        width: 70,
      }, {
        title: '实盘',
        dataIndex: 'dualGoodsQty',
        key: 'dualGoodsQty',
        width: 70,
        className: 'editable-col',
        render: (text, record, index) => renderColumns(text, record, index, 'dualGoodsQty', {
          type: 'number',
          rowIdent: record.id,
          updateValue: (value, itemKey) => refreshList(value, itemKey, 'dualGoodsQty', index),
          transValue: record.dualGoodsQty,
          disabled: !reposId || !checkTypes || parseInt(record.dualUnitFlag, 10) !== 1, // 根据条件判断是否能够使用 true 不能使用 false 能够使用
          originalProps: {
            min: 0,
            onPressEnter: () => toNextMem(index, 'dualGoodsQty'), // 跳转到下一个编辑状态
            // onFocusInput: () => toggleMemStatus(index, 'dualGoodsQty'), // 修改其他的编辑状态为非编辑状态
          },
        }),
      }, {
        title: '单位',
        dataIndex: 'dualUnitName',
        key: 'dualUnitName',
        width: 70,
      }],
    }, {
      title: '盈亏',
      children: [{
        title: '数量',
        dataIndex: 'profLossQty', // 标准实盘-标准账面
        key: 'profLossQty',
        width: 70,
        render: text => text && text !== '0' ? Number(text).toFixed(2) : text,
      }, {
        title: '金额',
        dataIndex: 'profLossAmt', // 盈亏数量*标准单价
        key: 'profLossAmt',
        width: 70,
        render: text => text && text !== '0' ? Number(text).toFixed(2) : text,
      }]
    }, {
      title: '备注',
      dataIndex: 'remarks',
      width: 150,
      key: 'remarks',
      className: 'editable-col',
      render: (text, record, index) => renderColumns(text, record, index, 'remarks', {
        rowIdent: record.id,
        updateValue: (value, itemKey) => refreshList(value, itemKey, 'remarks', index),
        transValue: record.remarks,
        disabled: !reposId || !checkTypes, // 根据条件判断是否能够使用 true 不能使用 false 能够使用
        maxLength: 25,
        originalProps: {
          style: { width: 80 },
          onPressEnter: () => toNextMem(index, 'remarks'), // 跳转到下一个编辑状态
          // onFocusInput: () => toggleMemStatus(index, 'remarks'), // 修改其他的编辑状态为非编辑状态
        },
      }),
    }, {
      title: '操作',
      dataIndex: 'options',
      key: 'options',
      fixed: 'right',
      width: 80,
      render: (text, record, index) => <div>
        <Tooltip placement="top" title="新增一行">
          {((checkTypes && checkTypes.toString() === '941') || !checkTypes) && <Icon
            type="plus"
            style={{ fontSize: 20, color: '#08c', cursor: 'pointer' }}
            onClick={() => insertNewRowAfterIndex(index)}
          />}
        </Tooltip>
        {
          listData.length > 1
          ? record.goodsCode ? <Popconfirm
            okText="确认删除"
            title={<div><span style={{ color: '#f04134' }}>危险操作！</span><br /><span>删除后可能无法恢复，确定继续删除吗？</span></div>} onConfirm={() => removeRowAtIndex(record.id, index)}>
            <Icon type="minus" style={{ fontSize: 20, color: 'red', cursor: 'pointer' }} />
          </Popconfirm> : <Icon type="minus" onClick={() => removeRowAtIndex(record.id, index)} style={{ fontSize: 20, color: 'red', cursor: 'pointer' }} />
          : null
        }
      </div>,
    }];
  } else {
    columnsConfig = [{
      title: '',
      dataIndex: 'index',
      key: 'index',
      width: 40,
      render: (text, record, index) => (parseInt(index) + 1),
    }, {
      title: '物资编码',
      dataIndex: 'goodsCode',
      key: 'goodsCode',
      width: 140,
      className: 'editable-col',
      render: (text, record, index) => renderColumns(text, record, index, 'goodsCode', {
        rowIdent: record.id,
        type: 'select',
        onKeyEnter: () => {
          // if (parseInt(record.dualUnitFlag, 10)) { // 默认跳到下一列编辑框
          toNextMem(index, 'goodsCode');
          // } else { // 是双单位物资，越过下一列dualGoodsQty辅助实盘的编辑
          //   toNextMem(index, 'goodsCode', 2);
          // }
        },
        disabled: !reposId || !checkTypes, // 根据条件判断是否能够使用 true 不能使用 false 能够使用

        onChange: showGoodsListByTyping, // 手动输入的回调
        selectItem: (itemValue, itemId) => {
          toNextMem(index, 'goodsCode');
          selectedAGoods(itemValue, itemId, index, 'goodsCode');
        }, // 选择手动输入后列表的一个项目
        keyValues: goodsList, // 显示响应手动输入的列表数据
        disabledList: (() => listData.map(item => item.goodsCode))(), // 指定下拉列表中和弹窗列表中已显示的不让其可选，暂时实现只匹配ID

        getPopListData: getGoodsListdata, // 第一次显示列表时触发获取数据的方法
        popListData: goodsPopListModel, // getPopListData 获取的 table 里的数据
        cbReceiveChoose: (data) => { // 选择的几条数据
          // console.log('cbReceiveChoose',data);
          const selectedList = _.cloneDeep(data);
          // 选择物资后，根据选择的物资同步编辑列表显示列
          selectedList.map((item) => {
            item.dualAccQty = item.dualWareQty;
            if (parseInt(item.dualUnitFlag, 10) === 1) { // 双单位物资不用显示辅助实盘数
              item.dualGoodsQty = item.dualWareQty;
            }
            // item.dualUnitName =item.dualUnitName
            // item.dualGoodsQty = item.dualWareQty;
            item.checkQty = item.wareQty;
            item.accQty = item.wareQty;
            item.checkUnitName = item.unitName;
            item.profitPrice = item.goodsPrice;
          });
          selectedListGoods(selectedList, index, 'goodsCode', true);
        },

        foundTreeList, // tree 数据
        onSelectTreeItem: value => onSelectedTreeItem(value), // 选择tree的类别节点
        onModalSearch: value => selectModalSearch(value), // modal的模糊搜索
        onCloseModel: value => onCloseModel(value), // modal的关闭触发
        goodsListLoading: popupListLoading,

        popListPagination: popupListPagination, // 翻页配置
        onPopPageChange: onPopupPageChange, // 翻页方法
        onPopPageSizeChange: onPopupPageSizeChange, // 修改页尺寸
        originalProps: {
          // onFocusInput: () => toggleMemStatus(index, 'goodsCode'), // 修改其他的编辑状态为非编辑状态
        },
      }),
    }, {
      title: '名称',
      dataIndex: 'goodsName',
      key: 'goodsName',
      width: 70,
    }, {
      title: '规格',
      dataIndex: 'goodsSpec',
      key: 'goodsSpec',
      width: 70,
    }, {
      title: '标准',
      children: [{
        title: '账面',
        dataIndex: 'accQty',
        key: 'accQty',
        width: 70,
      }, {
        title: '实盘',
        dataIndex: 'checkQty',
        key: 'checkQty',
        width: 70,
        className: 'editable-col',
        render: (text, record, index) => renderColumns(text, record, index, 'checkQty', {
          type: 'number',
          rowIdent: record.id,
          updateValue: (value, itemKey) => refreshList(value, itemKey, 'checkQty', index),
          transValue: record.checkQty,
          disabled: !reposId || !checkTypes, // 根据条件判断是否能够使用 true 不能使用 false 能够使用
          originalProps: {
            style: { width: 50 },
            min: 0,
            onPressEnter: () => toNextMem(index, 'checkQty', (record.dualUnitName ? false : true)), // 跳转到下一个编辑状态
            // onFocusInput: () => toggleMemStatus(index, 'checkQty'), // 修改其他的编辑状态为非编辑状态
          },
        }),
      }, {
        title: '单位',
        dataIndex: 'checkUnitName',
        key: 'checkUnitName',
        width: 70,
      }, {
        title: '单价',
        dataIndex: 'profitPrice',
        key: 'profitPrice',
        width: 70,
      }]
    }, {
      title: '辅助',
      children: [{
        title: '账面',
        dataIndex: 'dualAccQty',
        key: 'dualAccQty',
        width: 70,
      }, {
        title: '实盘',
        dataIndex: 'dualGoodsQty',
        key: 'dualGoodsQty',
        width: 70,
        className: 'editable-col',
        render: (text, record, index) => renderColumns(text, record, index, 'dualGoodsQty', {
          type: 'number',
          rowIdent: record.id,
          updateValue: (value, itemKey) => refreshList(value, itemKey, 'dualGoodsQty', index),
          transValue: record.dualGoodsQty,
          disabled: !reposId || !checkTypes || parseInt(record.dualUnitFlag, 10) !== 1, // 根据条件判断是否能够使用 true 不能使用 false 能够使用
          originalProps: {
            style: { width: 50 },
            min: 0,
            onPressEnter: () => toNextMem(index, 'dualGoodsQty'), // 跳转到下一个编辑状态
            // onFocusInput: () => toggleMemStatus(index, 'dualGoodsQty'), // 修改其他的编辑状态为非编辑状态
          },
        }),
      }, {
        title: '单位',
        dataIndex: 'dualUnitName',
        key: 'dualUnitName',
        width: 70,
      }],
    }, {
      title: '盈亏',
      children: [{
        title: '数量',
        dataIndex: 'profLossQty', // 标准实盘-标准账面
        key: 'profLossQty',
        width: 70,
        render: text => text && text !== '0' ? Number(text).toFixed(2) : text,
      }, {
        title: '金额',
        dataIndex: 'profLossAmt', // 盈亏数量*标准单价
        key: 'profLossAmt',
        width: 70,
        render: text => text && text !== '0' ? Number(text).toFixed(2) : text,
      }]
    }, {
      title: '备注',
      dataIndex: 'remarks',
      width: 150,
      key: 'remarks',
      className: 'editable-col',
      render: (text, record, index) => renderColumns(text, record, index, 'remarks', {
        rowIdent: record.id,
        updateValue: (value, itemKey) => refreshList(value, itemKey, 'remarks', index),
        transValue: record.remarks,
        disabled: !reposId || !checkTypes, // 根据条件判断是否能够使用 true 不能使用 false 能够使用
        maxLength: 25,
        originalProps: {
          style: { width: 80 },
          onPressEnter: () => toNextMem(index, 'remarks'), // 跳转到下一个编辑状态
          // onFocusInput: () => toggleMemStatus(index, 'remarks'), // 修改其他的编辑状态为非编辑状态
        },
      }),
    }, {
      title: '操作',
      dataIndex: 'options',
      key: 'options',
      fixed: 'right',
      width: 80,
      render: (text, record, index) => <div>
        <Tooltip placement="top" title="新增一行">
          {((checkTypes && checkTypes.toString() === '941') || !checkTypes) && <Icon
            type="plus"
            style={{ fontSize: 20, color: '#08c', cursor: 'pointer' }}
            onClick={() => insertNewRowAfterIndex(index)}
          />}
        </Tooltip>
        {
          listData.length > 1
          ? record.goodsCode ? <Popconfirm
            okText="确认删除"
            title={<div><span style={{ color: '#f04134' }}>危险操作！</span><br /><span>删除后可能无法恢复，确定继续删除吗？</span></div>} onConfirm={() => removeRowAtIndex(record.id, index)}>
            <Icon type="minus" style={{ fontSize: 20, color: 'red', cursor: 'pointer' }} />
          </Popconfirm> : <Icon type="minus" onClick={() => removeRowAtIndex(record.id, index)} style={{ fontSize: 20, color: 'red', cursor: 'pointer' }} />
          : null
        }
      </div>,
    }];
  }

  refreshList = (value, itemKey, fieldName, rowIndex) => {
    // 更新文本框
    const rowItem = _.find(listData, item => item.id === itemKey);
    rowItem[fieldName] = value;
    // 联动更新
    // console.log('rowItem',rowItem);
    if (fieldName === 'checkQty') {
      /*
        盈亏数量（profLossQty） = 标准实盘-标准账面
        盈亏金额（profLossAmt） = 盈亏数量*标准单价
      */
      if (rowItem.accQty) {
        // console.log('value,rowItem.accQty,rowItem.profitPrice',value,',', rowItem.accQty,',',rowItem.profitPrice);
        rowItem.profLossQty = value - rowItem.accQty;
        rowItem.profLossAmt = Math.round((value - rowItem.accQty) * rowItem.profitPrice * 10000) / 10000; // 四舍五入
      } else {
        // console.log('value,rowItem.wareQty,rowItem.averPrice',value,',', rowItem.wareQty,',',rowItem.averPrice);
        rowItem.profLossQty = value - rowItem.wareQty;
        rowItem.profLossAmt = Math.round((value - rowItem.wareQty) * rowItem.averPrice * 10000) / 10000; // 四舍五入
      }
    }

    listData = _.cloneDeep(listData);
    resyncDataSource(listData);
  };

  openModel = (value) => { // 打开物资弹窗
    openGoodsModel(value);
  };

  selectedAGoods = (itemValue, itemId, index, fieldName) => {
    const selectedItem = _.find(goodsList, item => item.goodsCode === itemValue);
    // const rowItem =warn _.find(listData, item => item.id === itemId);
    // console.log('-----------------00000000000selectedItem', selectedItem, itemValue, itemId, index);
    // toNextMem(index, 'goodsCode');
    // if (selectedItem.dualUnitFlag) { // 默认跳到下一列编辑框
    //   toNextMem(index, 'goodsCode');
    // } else { // 是双单位物资，越过下一列dualGoodsQty辅助实盘的编辑
      // toNextMem(index, 'goodsCode', 2);
    // }
    selectedItem.dualAccQty = selectedItem.dualWareQty;
    if (parseInt(selectedItem.dualUnitFlag, 10) === 1) { // 双单位物资不用显示辅助实盘数
      selectedItem.dualGoodsQty = selectedItem.dualWareQty;
    }
    // item.dualUnitName =item.dualUnitName
    // item.dualGoodsQty = item.dualWareQty;
    selectedItem.checkQty = selectedItem.wareQty;
    selectedItem.accQty = selectedItem.wareQty;
    selectedItem.checkUnitName = selectedItem.unitName;
    selectedItem.profitPrice = selectedItem.goodsPrice;
    syncSeletedItemIntoRow([selectedItem], index, fieldName);
    // Object.assign(rowItem, selectedItem);
  };
  selectedListGoods = (selectedList, index, fieldName, isModal) => {
    // console.log('11111111111111111isModal', isModal);
    syncSeletedItemIntoRow(selectedList, index, fieldName, isModal);
  };
  savePageData = (status) => {
    const today = moment().format('YYYY-MM-DD');
    const lastDayOfMonth = moment().endOf('month').format('YYYY-MM-DD');
    if (checkTypes.toString() === '943' && today !== lastDayOfMonth) {
      Modal.confirm({
        title: '危险操作',
        content: '当前不是月末最后一天，你确认要月盘吗？',
        okText: '继续盘点',
        okType: 'danger',
        cancelText: '取消盘点',
        onOk() {
          saveDetails(status);
        },
        onCancel() {
          message.info('已经取消盘点，请知晓');
        },
      });
    } else {
      saveDetails(status);
    }
  };
  renderColumns = (text, record, index, field, configurations) => {
    // console.log("field",field);
    // if (!editableColName[index].includes(field)) {
    //   editableColName[index][field];
    // }
    // editableColName[index][field];
    // editableMem[index][field] = false;
    const editable = '';
    const status = false;
    const currEditStatus = editableMem[index];
    let fields = Object.keys(currEditStatus);
    // console.log("currEditStatus",currEditStatus);
    // if (!currEditStatus || (currEditStatus && !(currEditStatus.hasOwnProperty(field)))) {
      // syncMem(field); // 生成编辑内容行列信息
      // return false;
    // }
    let newdataSourceIndex = 1;
    dataSourceIndex && dataSourceIndex.length ? (newdataSourceIndex = dataSourceIndex.length) : newdataSourceIndex;
    if (!_.has(editableMem[index], field)) {
      if (index == editableMem.length-1 && (field==fields[0] || fields.length==0) && editableMem.length !== newdataSourceIndex) { // 第一条不能是自动选中状态
      //  console.log('fixed field is configurations.hideField', configurations.hideField);
        currEditStatus[field] = true;
      } else {
        currEditStatus[field] = false; // 默认不在编辑状态
      }
    }

    if (typeof editable === 'undefined') {
      return text;
    }

    return (<EditableCell
      configurations={configurations}
      inEditStatus={currEditStatus}
      field={field}
      inValue={text}
      onChange={value => this.handleChange(field, index, value)}
      status={status}
      openModel={openModel}
      goodsList={goodsList}
      rowIndex={index}
      clickToEdit={() => {
        currEditStatus[field] = !currEditStatus[field];
      }}
    />);
    // console.log('editableMem',editableMem);
  };
  showGoodsListByTyping = (value) => {
    getGoodsListByTyping(value);
  };
  /*
  962(pin): "已完成"
  961(pin): "待处理"
  962(pin): "已提交"
  */
  return (
    <div>
      <br />
      <Table
        bordered
        size="small"
        columns={columnsConfig}
        loading={loadingList}
        dataSource={listData}
        pagination={false}
        scroll={opType === 'view' ? { x: '1100' } : { x: '1180' }}
        rowKey={record => record.id}
        onRowClick={checkEditable}
        rowClassName={() => 'editable-row'}
      />
      <br />
      {((opType === 'edit' && pageStatus !== 962) || opType === 'create')
        && <span><Button onClick={() => savePageData(961)} disabled={savingStatus}>暂存</Button>&nbsp;&nbsp;&nbsp;&nbsp;</span>}
      {((opType === 'edit' && pageStatus !== 962) || opType === 'create')
        && <span><Button type="primary" onClick={() => savePageData(962)} disabled={savingStatus}>盘点</Button>&nbsp;&nbsp;&nbsp;&nbsp;</span>}
      <Button onClick={cancelDetailPage}>返回</Button>&nbsp;&nbsp;&nbsp;&nbsp;
      {opType === 'view' && pageStatus === 961 && <a href="javacript:void(0);" style={{ display: 'none' }} onClick={() => switchType('edit')}>启用编辑</a>}
      <div style={{ display: 'none' }}>{JSON.stringify(editableMem)}</div>
    </div>
  );
};

OfficialCheckDetailsList.propTypes = {
  opType: PropTypes.string,
  pageStatus: PropTypes.string,
  switchType: PropTypes.func,
  resyncDataSource: PropTypes.func,
  getGoodsListByTyping: PropTypes.func,
  syncSeletedItemIntoRow: PropTypes.func,
  insertNewRowAfterIndex: PropTypes.func,
  saveDetails: PropTypes.func,
  removeRowAtIndex: PropTypes.func,
  openGoodsModel: PropTypes.func,
  switchEditingStatus: PropTypes.func,
  syncMem: PropTypes.func,
  editableMem: PropTypes.array,
  renderColumns: PropTypes.func,
  refreshList: PropTypes.func,
  cancelDetailPage: PropTypes.func,
  toNextMem: PropTypes.func,
  toggleMemStatus: PropTypes.func,

  getGoodsListdata: PropTypes.func,
  goodsPopListModel: PropTypes.object,
  onPopupPageChange: PropTypes.func,
  onPopupPageSizeChange: PropTypes.func,

  foundTreeList: PropTypes.array,
  onSelectedTreeItem: PropTypes.func,
};
export default OfficialCheckDetailsList;
