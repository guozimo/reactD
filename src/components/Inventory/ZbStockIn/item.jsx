import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Form, Input, Button, Select, Breadcrumb, DatePicker, Row, Col, message, Icon } from 'antd';
import moment from 'moment';
import numbro from 'numbro';
import HotTable from 'react-handsontable';
import { codeToArray } from '../../../utils';

const Option = Select.Option;
const FormItem = Form.Item;
const dateFormat = 'YYYY-MM-DD';
const document = window.document;

const search = ({
    loadingSave,
    loadingStock,
    pageType,
    id,
    storeId,
    depotId,
    busiId,
    goodsList,
    detailList,
    eidtGoodsId,
    baseInfo,
    busiName,
    bussDate,
    monthDate,
    depotName,
    billType,
    remarks,
    oldGoodsId,
    miniGoodsVisible,
    topMini,
    adaptRowHeight,
    hotTableHeight,
    cellValue,
    activeRow,
    goodsKeywords,
    chooseGoodsCode,
    isCodeChanging,
    validateList,
    onSupplierQuery,
    onDepotQuery,
    onBusiIdSave,
    onDepotIdSave,
    onChooseGoods,
    onSaveStockIn,
    onSelectGood,
    onDeleteGood,
    onDeleteGoods,
    onBack,
    onSelectMini,
    onHideMini,
    onShowMini,
    onGoodsListQuery,
    onMiniSelectInit,
    onAddRow,
    onChangeTopMini,
    onChangeOldGooodsId,
    onChangeRowHeight,
    onResizePage,
    onGoodsCodeChanging,
    onValidateListChange,
    form: {
      getFieldDecorator,
      validateFields,
      getFieldValue,
    },
  }) => {
  let hotRef; // hotTalbe引用
  let miniRef; // 下拉物资选项引用
  const initGoodsValue = cellValue || '';
  // let miniSelectGoods = [];
  // 单独添加事件
  // keyup事件，主要用于即时更新下拉自动选择物资
  document.addEventListener('keyup', (e) => {
    if (hotRef) {
      // const actCell = hotRef.hotInstance.getActiveEditor();
      // console.warn(actCell.TEXTAREA.value);
    }
  }, false);
  // 定义供应商、仓库、单据类型下拉选项
  const billTypeOptions = pageType === 'view' ? baseInfo.billTypeView.map(type => <Option value={type.code} key={type.code}>{type.name}</Option>)
    : baseInfo.billType.map(type => <Option value={type.code} key={type.code}>{type.name}</Option>);
  const warehouseOptions = baseInfo.warehouse.map(item => <Option value={item.depotName} key={item.id} title={item.id}>{item.depotName}</Option>);
  const supplierOptions = baseInfo.supplier.map(item => <Option value={item.suppName} key={item.id} title={item.id}>{item.suppName}</Option>);
  const goodsListOptions = goodsList.map((item) => {
    const codeName = `${item.goodsCode} | ${item.goodsName}| ${item.spelCode} | ${item.spelCode.toLowerCase()}`;
    return <Option value={codeName} key={item.goodsCode} title={item.goodsCode || item.goodsName}>{item.goodsCode} | {item.goodsName}</Option>;
  });
  // 切换标识变量，tabFlag、tabIndex、tabNext用于控制enter切换;
  // oldGoodsId用于记录改变之前的物资id用于更换物资后，需要在选择物资id数组里减去这个id
  let tabFlag = 'hand';
  let tabIndex = 0;
  let tabNext = 0;
  // 日期处理函数
  const disabledDate = date => date.isBefore(moment(monthDate)) || date.isAfter(moment());
  // 定义可编辑数组，用于enter切换
  const enterProps = ['goodsCode', 'goodsQty', 'dualGoodsQty', 'unitPrice', 'goodsAmt', 'remarks'];
  // 定义字段限定长度对象，根据设定限定长度,但是实际验证还需要在htBeforeChange中判断列号
  const maxLengthProps = [
    {
      type: 'number',
      name: 'goodsQty',
      max: 12,
    },
    {
      type: 'string',
      name: 'remarks',
      max: 10,
    },
  ];
  // 定义初始日期
  const bussDateInit = moment(bussDate);
  // 定义选物资前的验证
  const beforeChooseGoodsValue = () => {
    // 供应商、仓库、单据类型非空验证
    let isOk = true;
    const busiNameVal = getFieldValue('busiName');
    const depotNameVal = getFieldValue('depotName');
    const billTypeVal = getFieldValue('billType') !== '请选择类型' ? Number(getFieldValue('billType')) : '';
    if (!busiNameVal) {
      message.destroy();
      message.warn('请选择供应商');
      isOk = false;
    } else if (!depotNameVal) {
      message.destroy();
      message.warn('请选择入库仓库');
      isOk = false;
    } else if (!billTypeVal) {
      message.destroy();
      message.warn('请选择入单据类型');
      isOk = false;
    }
    return isOk;
  };
  // 定义单据表格头部数据，用于头部渲染
  const columuHearderProps = ['物资编码', '', '物资名称', '规格型号', '单位', '数量', '单位', '数量', '入库单价', '入库金额', '税率', '税额', '入库价', '金额', '备注', '操作'];
  const columuHearderPropsView = ['物资编码', '物资名称', '规格型号', '单位', '数量', '单位', '数量', '入库单价', '入库金额', '税率', '税额', '入库价', '金额', '备注'];
  const addGoodsCellRender = (instance, td, row, col, prop, value, cellProperties) => {
    td.innerHTML = '';
    const chooseBtn = document.createElement('p');
    chooseBtn.setAttribute('class', 'choose-icon');
    const chooseIcon = document.createElement('span');
    const chooseContent = '<button type="button" class="ant-btn ant-btn-dashed ant-btn-circle ant-btn-icon-only ant-btn-sm"><i class="anticon anticon-search"></i></button></i>';
    chooseIcon.innerHTML = chooseContent;
    chooseIcon.addEventListener('click', (e) => {
      e.preventDefault(); // prevent selection quirk
      const isOk = beforeChooseGoodsValue();
      if (isOk) {
        onChooseGoods(row);
      }
    });
    chooseBtn.appendChild(chooseIcon);
    td.appendChild(chooseBtn);
    td.setAttribute('class', 'bg-edit choose-code');
    return td;
  };
  // 入库数量render
  const goodsQtyRender = (instance, td, row, col, prop, value, cellProperties) => {
    let goodsQtyValue;
    if('number' == typeof value)
    goodsQtyValue = parseFloat(numbro(value).format('0.0000'));
    else
      goodsQtyValue = value;
    td.innerHTML = goodsQtyValue;
    if (validateList[row] && validateList[row].goodsQty && (isNaN(goodsQtyValue) || goodsQtyValue < 0 ||
      goodsQtyValue > 999999999 || Number(goodsQtyValue) === 0 || goodsQtyValue === '')) {
      td.setAttribute('class', 'bg-edit htRight htNumeric htInvalid htNoWrap');
    } else {
      td.setAttribute('class', 'bg-edit htRight htNumeric htNoWrap');
    }
    return td;
  };
  // 辅助数量render
  const dualGoodsQtyRender = (instance, td, row, col, prop, value, cellProperties) => {

    let dualGoodsQtyValue;
    if('number' == typeof value)
    dualGoodsQtyValue = parseFloat(numbro(value).format('0.0000'));
    else
      dualGoodsQtyValue = value;
    td.innerHTML = dualGoodsQtyValue;
    if (validateList[row] && validateList[row].dualGoodsQty && (isNaN(dualGoodsQtyValue) || dualGoodsQtyValue < 0 || dualGoodsQtyValue > 999999999 ||
      dualGoodsQtyValue === '' || (detailList[row] && detailList[row].dualUnitName && detailList[row].dualUnitName.length > 0 && Number(dualGoodsQtyValue) === 0))) {
      td.setAttribute('class', 'bg-edit htRight htNumeric htInvalid htNoWrap');
    } else {
      td.setAttribute('class', 'bg-edit htRight htNumeric htNoWrap');
    }
    return td;
  };
  // 入库单价render
  const unitPriceRender = (instance, td, row, col, prop, value, cellProperties) => {
    let unitPriceValue;
    if('number' == typeof value)
    unitPriceValue = parseFloat(numbro(value).format('0.00[00]'));
    else
      unitPriceValue = value;
    td.innerHTML = unitPriceValue;
    if (validateList[row] && validateList[row].unitPrice && (isNaN(unitPriceValue) || unitPriceValue < 0 || unitPriceValue === '')) {
      td.setAttribute('class', 'bg-edit htRight htNumeric htInvalid htNoWrap');
    } else {
      td.setAttribute('class', 'bg-edit htRight htNumeric htNoWrap');
    }
    return td;
  };
  // 入库金额render
  const goodsAmtRender = (instance, td, row, col, prop, value, cellProperties) => {
    let goodsAmtValue;
    if('number' == typeof value)
    goodsAmtValue = parseFloat(numbro(value).format('0.00[00]'));
    else
      goodsAmtValue = value;
    td.innerHTML = goodsAmtValue;
    if (validateList[row] && validateList[row].goodsAmt && (isNaN(goodsAmtValue) || goodsAmtValue < 0 || goodsAmtValue > 10000000 || goodsAmtValue === '')) {
      td.setAttribute('class', 'bg-edit htRight htNumeric htInvalid htNoWrap');
    } else {
      td.setAttribute('class', 'bg-edit htRight htNumeric htNoWrap');
    }
    return td;
  };
  // 备注render
  const remarksRender = (instance, td, row, col, prop, value, cellProperties) => {
    const remarksValue = value || '';
    td.innerHTML = remarksValue;
    if (validateList[row] && validateList[row].remarks && (remarksValue.length > 10)) {
      td.setAttribute('class', 'bg-edit htInvalid htNoWrap');
    } else {
      td.setAttribute('class', 'bg-edit htNoWrap');
    }
    return td;
  };
  const optCellRender = (instance, td, row, col, prop, value, cellProperties) => {
    td.innerHTML = '';
    const addBtn = document.createElement('p');
    addBtn.setAttribute('class', 'opt-icon');
    const plusIcon = document.createElement('span');
    const minusIcon = document.createElement('span');
    const plusContent = '<i class="glyphicon glyphicon-plus cmd-icons"></i>';
    const minusContent = '<i class="glyphicon glyphicon-minus cmd-icons"></i>';
    plusIcon.innerHTML = plusContent;
    minusIcon.innerHTML = minusContent;
    plusIcon.addEventListener('click', (e) => {
      e.preventDefault(); // prevent selection quirk
      onAddRow();
      // instance.alter('insert_row');
    });
    minusIcon.addEventListener('click', (e) => {
      e.preventDefault(); // prevent selection quirk
      const dataRow = hotRef.hotInstance.getSourceDataAtRow(row); // 删除之前就应该取得这个行的数据信息，删除之后就取不到了
      // 判断如果行数剩下1条，就不允许删除
      if (instance.countRows() > 1) {
        instance.alter('remove_row', row);
        // 判断如果有id，那么在已选物资编码数组删除该项,这里的goodsId就是原来物资的id
        if (dataRow.goodsId) {
          onDeleteGood(dataRow.goodsId);
        }
        // 修改验证数组,去除该项
        const tempValidateList = [];
        let validateIndex = 0;
        validateList.map((item) => {
          if (row !== validateIndex) {
            tempValidateList.push(item);
          }
          validateIndex += 1;
          return false;
        });
        onValidateListChange(tempValidateList);
        onResizePage(-1);
      } else if (instance.countRows() === 1) {
        message.warn('至少保留一行');
      }
    });
    addBtn.appendChild(plusIcon);
    addBtn.appendChild(minusIcon);
    td.appendChild(addBtn);
    return td;
  };

  // 单元格验证
  // 入库数量
  const validateGoodsQty = (value, callback) => {
    if (isNaN(value) && tabFlag === 'hand') {
      message.error('入库数量为数字');
      callback(false);
    } else if (value < 0 && tabFlag === 'hand') {
      message.error('入库数量不能小于0');
      callback(false);
    } else if (value > 999999999 && tabFlag === 'hand') {
      message.error('入库数量不能大于999999999');
      callback(false);
    } else if (Number(value) === 0 && tabFlag === 'hand') {
      message.error('入库数量不能为0');
      callback(false);
    } else if (value === '' && tabFlag === 'hand') {
      message.error('入库数量不能为空');
      callback(false);
    } else {
      callback(true);
    }
  };
  // 辅助数量
  const validateDualGoodsQty = (value, callback) => {
    if (isNaN(value) && tabFlag === 'hand') {
      message.error('辅助数量为数字');
      callback(false);
    } else if (value < 0 && tabFlag === 'hand') {
      message.error('辅助数量不能小于0');
      callback(false);
    } else if (value > 999999999 && tabFlag === 'hand') {
      message.error('辅助数量不能大于999999999');
      callback(false);
    } else if (value === '' && tabFlag === 'hand') {
      message.error('辅助数量不能为空');
      callback(false);
    } else {
      callback(true);
    }
  };
  // 入库单价
  const validateUnitPrice = (value, callback) => {
    if (isNaN(value) && tabFlag === 'hand') {
      message.error('价格为数字');
      callback(false);
    } else if (value < 0 && tabFlag === 'hand') {
      message.error('价格不能小于0');
      callback(false);
    } else if (value === '' && tabFlag === 'hand') {
      message.error('价格不能为空');
      callback(false);
    } else {
      callback(true);
    }
  };
  // 入库金额
  const validateGoodsAmt = (value, callback) => {
    if (isNaN(value) && tabFlag === 'hand') {
      message.error('入库金额为数字');
      callback(false);
    } else if (value < 0 && tabFlag === 'hand') {
      message.error('入库金额不能小于0');
      callback(false);
    } else if (value > 10000000 && tabFlag === 'hand') {
      message.error('入库金额不能大于10000000');
      callback(false);
    } else if (value === '' && tabFlag === 'hand') {
      message.error('入库金额不能为空');
      callback(false);
    } else {
      callback(true);
    }
  };
  // 备注
  const validateRemark = (value, callback) => {
    if (value.length <= 10) {
      callback(true);
    } else {
      // 顺便给出错误提示
      message.destroy();
      message.error('最长为10');
      callback(false);
    }
  };
  // 列创建方法
  const createColumns = (type) => {
    let columnArray = [];
    if (type === 'add' || type === 'edit') {
      columnArray = [
        {
          data: 'goodsCode',
          className: 'bg-edit border-right-no',

        },
        {
          data: 'chooseGoods',
          renderer: addGoodsCellRender,
          editor: false,
        },
        {
          data: 'goodsName',
          readOnly: true,
        },
        {
          data: 'goodsSpec',
          readOnly: true,
        },
        {
          data: 'unitName',
          readOnly: true,
        },
        {
          data: 'goodsQty',
          validator: validateGoodsQty,
          renderer: goodsQtyRender,
          className: 'bg-edit',
          type: 'numeric',
          maxLength: 10,
          format: '0.00',
        },
        {
          data: 'dualUnitName',
          readOnly: true,
        },
        {
          data: 'dualGoodsQty',
          validator: validateDualGoodsQty,
          renderer: dualGoodsQtyRender,
          className: 'bg-edit',
          type: 'numeric',
          format: '0.00',
        },
        {
          data: 'unitPrice',
          validator: validateUnitPrice,
          renderer: unitPriceRender,
          className: 'bg-edit',
          type: 'numeric',
          format: '0.00[00]',
        },
        {
          data: 'goodsAmt',
          validator: validateGoodsAmt,
          renderer: goodsAmtRender,
          className: 'bg-edit',
          type: 'numeric',
          format: '0.00[00]',
        },
        {
          data: 'taxRatio',
          type: 'numeric',
          format: '0.00',
          readOnly: true,
        },

        {
          data: 'goodsTaxAmt',
          type: 'numeric',
          format: '0.00',
          readOnly: true,
        },
        {
          data: 'unitPriceNotax',
          type: 'numeric',
          format: '0.00',
          readOnly: true,
        },
        {
          data: 'goodsAmtNotax',
          type: 'numeric',
          format: '0.00',
          readOnly: true,
        },
        {
          data: 'remarks',
          validator: validateRemark,
          renderer: remarksRender,
          className: 'bg-edit',
        },
        {
          data: 'opt',
          renderer: optCellRender,
          editor: false,
        },
      ];
    } else {
      columnArray = [
        {
          data: 'goodsCode',
          readOnly: true,
        },
        {
          data: 'goodsName',
          readOnly: true,
        },
        {
          data: 'goodsSpec',
          readOnly: true,
        },
        {
          data: 'unitName',
          readOnly: true,
        },
        {
          data: 'goodsQty',
          readOnly: true,
        },
        {
          data: 'dualUnitName',
          readOnly: true,
        },
        {
          data: 'dualGoodsQty',
          readOnly: true,
        },
        {
          data: 'unitPrice',
          readOnly: true,
        },
        {
          data: 'goodsAmt',
          readOnly: true,
        },
        {
          data: 'taxRatio',
          readOnly: true,
        },

        {
          data: 'goodsTaxAmt',
          readOnly: true,
        },
        {
          data: 'unitPriceNotax',
          readOnly: true,
        },
        {
          data: 'goodsAmtNotax',
          readOnly: true,
        },
        {
          data: 'remarks',
          readOnly: true,
        },
      ];
    }
    return columnArray;
  };
  // 定义单据列数组定义
  const columnBodyProps = createColumns(pageType);
  // 供应商、仓库、物资列表即时选择方法
  const handleSupplierChange = (value) => {
    onSupplierQuery(value);
  };
  const handleSupplierFocus = () => {
    onSupplierQuery();
  };
  const handleSupplierSelect = (value, option) => {
    onBusiIdSave(option.props.title);
  };
  const handleDepotChange = (value) => {
    onDepotQuery(value);
  };
  const handleDepotFocus = () => {
    onDepotQuery();
  };
  const handleDepotSelect = (value, option) => {
    onDepotIdSave(option.props.title);
  };
  const handleGoodsListChange = (value) => {
    onGoodsListQuery(value);
    onGoodsCodeChanging(true);
  };
  const handleGoodsListFocus = () => {
    if (tabFlag === 'hand') {
      hotRef.hotInstance.deselectCell();
      ReactDOM.findDOMNode(miniRef).querySelectorAll('input')[0].click();
      onGoodsListQuery();
    }
    onGoodsCodeChanging(false);
  };
  const handleGoodsListSelect = (value, option) => {
    const miniSelectGoods = goodsList.filter(item => item.goodsCode === option.props.title);
    const validGoods = detailList.filter(item => item.goodsId === miniSelectGoods[0].id);
    if (validGoods.length > 0) {
      message.error('编码不能重复');
    } else {
      message.destroy();
      hotRef.hotInstance.selectCellByProp(activeRow, enterProps[1]);
      onMiniSelectInit(miniSelectGoods, activeRow);
      const goodsSearch = {
        selectedCodes: codeToArray(miniSelectGoods, 'id'),
      };
      onSelectGood(goodsSearch);
      if (oldGoodsId) {
        // 判断是因为goodsCode导致的自动赋值的话，那么执行选择物资方法，如果有oldGoodsId，进行删除方法操作，
        // 这里的已选物资编码数组要重新计算，因为如果不增加新的id的话，那么在执行删除方法的时候，上面的选择物资方法还没执行完，
        // 拿到的就是旧的已选物资编码数组，已选物资数组也一样，这里把新的纪录传到删除方法，删除方法会进一步处理
        const paramChooseGoodsCode = chooseGoodsCode;
        paramChooseGoodsCode.push(miniSelectGoods[0].id);
        onDeleteGoods(oldGoodsId, paramChooseGoodsCode);
        onChangeOldGooodsId(null);
      }
    }
  };
  const handleGoodsListBlur = () => {
    onHideMini();
  };
  // onChangeGoodsQty，当goodsQty(物资数量)改变时的方法
  const onChangeGoodsQty = (changes, resource) => {
    const dataRow = hotRef.hotInstance.getSourceDataAtRow(changes[0][0]);
    // 如果输入值是数字，那么执行以下操作
    if (!isNaN(changes[0][3]) && !isNaN(dataRow.unitPrice) && changes[0][3] >= 0 && changes[0][3] < 999999999) {
      tabIndex = -3;
      tabFlag = 'auto';
      tabNext = 2;
      // 含税金额 = 含税入库价*入库数量
      // 不含税金额 = 不含税入库价 * 入库数量
      // 税额 = 含税金额 - 不含税金额
      const cntTaxAmt = dataRow.unitPrice * changes[0][3];
      const cntNoTaxAmt = dataRow.unitPriceNotax * changes[0][3];
      const cntTaxPay = cntTaxAmt - cntNoTaxAmt;

      hotRef.hotInstance.setDataAtRowProp(changes[0][0], 'goodsAmt', cntTaxAmt);
      hotRef.hotInstance.setDataAtRowProp(changes[0][0], 'goodsAmtNotax', cntNoTaxAmt);
      hotRef.hotInstance.setDataAtRowProp(changes[0][0], 'goodsTaxAmt', cntTaxPay);
    }
  };
  // onChangeUnitPrice，当unitPrice(含税入库价)改变时的方法
  const onChangeUnitPrice = (changes, resource) => {
    const dataRow = hotRef.hotInstance.getSourceDataAtRow(changes[0][0]);
    // 如果输入值是数字且输入数量是数字，那么执行以下操作
    if (!isNaN(changes[0][3]) && !isNaN(dataRow.goodsQty) && changes[0][3] >= 0 && dataRow.goodsQty > 0) {
      tabIndex = -4;
      tabFlag = 'auto';
      tabNext = 4;
      // 含税金额 = 含税入库价*入库数量
      // 不含税入库价 = 含税入库价 / （1+税率）
      // 不含税金额 = 不含税入库价 * 入库数量
      // 税额 = 含税金额 - 不含税金额
      const cntTaxAmt = changes[0][3] * dataRow.goodsQty;
      const cntNoTaxPrice = changes[0][3] / (1 + Number(dataRow.taxRatio));
      const cntNoTaxAmt = cntNoTaxPrice * dataRow.goodsQty;
      const cntTaxPay = cntTaxAmt - cntNoTaxAmt;

      hotRef.hotInstance.setDataAtRowProp(changes[0][0], 'goodsAmt', cntTaxAmt);
      hotRef.hotInstance.setDataAtRowProp(changes[0][0], 'unitPriceNotax', cntNoTaxPrice);
      hotRef.hotInstance.setDataAtRowProp(changes[0][0], 'goodsAmtNotax', cntNoTaxAmt);
      hotRef.hotInstance.setDataAtRowProp(changes[0][0], 'goodsTaxAmt', cntTaxPay);
    }
  };
  // onChangeGoodsAmt，当unitPrice(含税金额)改变时的方法
  const onChangeGoodsAmt = (changes, resource) => {
    const dataRow = hotRef.hotInstance.getSourceDataAtRow(changes[0][0]);
    // 如果输入值是数字且输入数量是数字，并且物资数量大于0（防止无穷大数字）那么执行以下操作
    if (!isNaN(changes[0][3]) && !isNaN(dataRow.goodsQty) && dataRow.goodsQty > 0 && changes[0][3] >= 0 && changes[0][3] < 10000000) {
      tabIndex = -4;
      tabFlag = 'auto';
      tabNext = 5;
      // 含税入库价 = 含税金额/入库数量
      // 不含税入库价 = 含税入库价 / （1+税率）
      // 不含税金额 = 不含税入库价 * 入库数量
      // 税额 = 含税金额 - 不含税金额
      const cntUnitPrice = changes[0][3] / dataRow.goodsQty;
      const cntNoTaxPrice = cntUnitPrice / (1 + Number(dataRow.taxRatio));
      const cntNoTaxAmt = cntNoTaxPrice * dataRow.goodsQty;
      const cntTaxPay = changes[0][3] - cntNoTaxAmt;

      hotRef.hotInstance.setDataAtRowProp(changes[0][0], 'unitPrice', cntUnitPrice);
      hotRef.hotInstance.setDataAtRowProp(changes[0][0], 'unitPriceNotax', cntNoTaxPrice);
      hotRef.hotInstance.setDataAtRowProp(changes[0][0], 'goodsAmtNotax', cntNoTaxAmt);
      hotRef.hotInstance.setDataAtRowProp(changes[0][0], 'goodsTaxAmt', cntTaxPay);
    }
  };
  // 修改验证数组
  const changeValidateList = (row, prop, oldValue, value) => {
    // 因为验证数组无法判断辅助单位存在情况下辅助数量为0的情况，所以错误提示在这里提示
    if (prop === 'dualGoodsQty') {
      if (detailList[row].dualUnitName && detailList[row].dualUnitName.length > 0 && value === 0) {
        message.error('辅助数量不可以是0');
      }
    }
    const cacheValidateList = [];
    let i = 0;
    validateList.map((item) => {
      if (i !== row) {
        cacheValidateList.push(item);
      } else if (i === row) {
        const cacheItem = item;
        cacheItem[prop] = true;
        cacheValidateList.push(cacheItem);
      }
      i += 1;
      return null;
    });
    onValidateListChange(cacheValidateList);
  };
  // enterTab切换方法，用于enter切换编辑单元格
  const onTabEnter = (changes, resource) => {
    if (tabIndex === 0) {
      // 如果当前值为自动，那么enter进入到手动改变值的下一个可编辑单元格，并且切换tabFlag 自动为手动
      if (tabFlag === 'auto') {
        hotRef.hotInstance.selectCellByProp(changes[0][0], enterProps[tabNext]);
        tabFlag = 'hand';
      } else if (tabFlag === 'hand') { // 如果是手动进入，那边就进入到正常的enter切换
        const lasRow = hotRef.hotInstance.countRows() - 1;
        const nextIndex = enterProps.indexOf(changes[0][1]) + 1;
        const lastIndex = enterProps.length - 1;
        // 如果当前列为最后一列，但当前行不是最后一行，那么跳至下一行第一个可编辑单元格
        if (changes[0][1] === enterProps[lastIndex] && changes[0][0] < lasRow) {
          hotRef.hotInstance.selectCellByProp(changes[0][0] + 1, enterProps[0]);
          onChangeRowHeight(activeRow);
          // 如果当前列为最后一列，且当前行是最后一行，那么增加新行
        } else if (changes[0][1] === enterProps[lastIndex] && changes[0][0] === lasRow) {
          // hotRef.hotInstance.alter('insert_row');
          onAddRow();
          // 如果行跟列都不是最后的并且改变的是可编辑行，那么跳转至当前行下一个可编辑单元格
        } else if (enterProps.indexOf(changes[0][1]) !== -1) {
          hotRef.hotInstance.selectCellByProp(changes[0][0], enterProps[nextIndex]);
        }
      }
    }
  };
  // 单元格值改变前，做一些验证等处理
  const htBeforeChange = (changes, resource) => {
    if (tabFlag === 'hand') {
      const row = changes[0][0];
      const col = changes[0][1];
      const meta = hotRef.hotInstance.getCellMeta(row, col);
      const data = changes[0][3];
      const props = meta.prop;
      // 对单元格设定长度的判断
      maxLengthProps.map((item) => {
        if (item.name === props && item.type === 'number' && data.toString().length > item.max) {
          changes[0][3] = Number(data.toString().substring(0, item.max));
        } else if (item.name === props && data.length > item.max && item.type === 'string') {
          changes[0][3] = data.substring(0, item.max);
        }
        return false;
      });
      // 调取修改验证数组
      changeValidateList(changes[0][0], changes[0][1], changes[0][2], changes[0][3]);
    }
  };
  // 单元格值改变事件，用于处理一些值的联动等
  const htAfterChange = (changes, resource) => {
    // 控制切换，如果tabFlag为auto，那么表示当前的改变是其他单元格的值引起的，此时tabIndex增加1
    if (tabFlag === 'auto') {
      tabIndex += 1;
    }
    // 如果是选择入库数量的列变化了，那么影响含税金额、税额、不含税金额
    if (changes[0][1] === 'goodsQty' && tabFlag === 'hand') {
      onChangeGoodsQty(changes, resource);
    }
    // 如果含税入库价改变，那么影响含税金额、税额、不含税入库价、不含税金额
    if (changes[0][1] === 'unitPrice' && tabFlag === 'hand') {
      onChangeUnitPrice(changes, resource);
    }
    // 如果含税入库金额改变，那么影响含税价、税额、不含税入库价、不含税金额
    if (changes[0][1] === 'goodsAmt' && tabFlag === 'hand') {
      onChangeGoodsAmt(changes, resource);
    }
    // 切换数据行，如果tabIndex增加到0，那么表示自动改变值结束，可以进入enter切换了
    onTabEnter(changes, resource);
  };
  // 选择单元格之后
  const htAfterSelectionByProp = (r, c, r2, c2, preventScrolling) => {
    const dataRow = hotRef.hotInstance.getSourceDataAtRow(r);
    const activeValue = hotRef.hotInstance.getDataAtCell(r, c);
    const isOk = beforeChooseGoodsValue();
    // 如果是物资编码列，显示选择弹窗
    if (c === 'goodsCode' && tabFlag === 'hand' && isOk) {
      const activeCell = hotRef.hotInstance.getCell(r, 8);
      onSelectMini({
        paramCellValue: activeValue,
        paramTopMini: activeCell.offsetTop,
        paramActiveRow: r,
        paramOldGoodsId: dataRow.goodsId,
      });
      // 先关闭，再显示，目的是为了下拉框的值即时更新
      onHideMini();
      onShowMini();
    }
    // 在hotRef存在的情况下，如果是选择操作列或者是选择物资的操作时，通过对控制蓝框的div的控制让其不出现蓝框
    if (hotRef) {
      const borderBoxDom = ReactDOM.findDOMNode(hotRef).querySelectorAll('.htBorders')[0];
      if ((c === 'opt' || c === 'chooseGoods') && tabFlag === 'hand') {
        borderBoxDom.style.display = 'none';
      } else {
        borderBoxDom.style.display = 'block';
      }
    }
    // 辅助数量是否可编辑
    if (c === 'dualGoodsQty' && !dataRow.dualUnitName) {
      const nextIndex = enterProps.indexOf(c) + 1;
      hotRef.hotInstance.setCellMeta(r, 7, 'editor', false);
      hotRef.hotInstance.selectCellByProp(r, enterProps[nextIndex]);
    }
  };
  // 按下键盘事件后
  const htAfterDocumentKeyDown = (e) => {
    // 如果enter回车的单元格是goodsCode，并且下拉选择的弹窗出现
    const activeCell = hotRef.hotInstance.getActiveEditor();
    if (e.key === 'Enter' && activeCell.prop === 'goodsCode' && miniGoodsVisible) {
      // 如果有oldGoodsId，那么在不选择其他物资的情况下(此时还需要进行判断没有其他下拉框)，可以跳转到下个可编辑单元格
      // isCodeChanging用于标识当前回车的时候，是否是重新搜索回车，如果没重新搜索直接跳到下一个，如果重新搜索，那么由另外一个完成到下一个
      if (oldGoodsId && !isCodeChanging) {
        hotRef.hotInstance.selectCellByProp(activeCell.row, enterProps[1]);
      } else if (!goodsKeywords) {
        message.destroy();
        message.warn('输入关键字才可搜索！');
      } else if (goodsKeywords) {
        message.destroy();
        message.warn('没有符合条件的物资！');
      }
    }
  };
  // 粘贴之前的操作
  const htBeforePaste = (data, coords) => {
    const meta = hotRef.hotInstance.getCellMeta(coords[0].endRow, coords[0].endCol);
    // 如果目标粘贴为物资编码的话
    if (meta.prop === 'goodsCode') {
      // return;
    }
  };
  // 暂存与保存操作
  const saveStockIn = (flag) => {
    message.destroy();
    // 暂存数据
    if (flag === 'no') {
      let isValid = true;
      let errorHtml = '';
      let index = 0;
      validateFields((errors) => {
        if (errors) {
          return;
        }
        const cacheOldIdsList = []; // 该数组用于保存编辑后还剩的id
        detailList.map((item) => {
          if (eidtGoodsId.indexOf(item.id) >= 0) {
            cacheOldIdsList.push(item.id);
          }
          return false;
        });
        // 取得表单数据
        const billData = {};
        // 显式字段
        billData.busiName = getFieldValue('busiName');
        billData.bussDate = getFieldValue('bussDate').format(dateFormat);
        billData.depotName = getFieldValue('depotName');
        billData.billType = getFieldValue('billType') !== '请选择类型' ? Number(getFieldValue('billType')) : '';
        billData.remarks = getFieldValue('remarks');
        // 隐式字段
        billData.depotId = depotId;
        billData.id = id;
        billData.busiId = busiId;
        billData.status = 961;
        billData.storeId = storeId;
        billData.delIdsList = eidtGoodsId.filter(item => cacheOldIdsList.indexOf(item) < 0);
        // 物资列表
        billData.detailList = detailList.filter(item => item.goodsCode && item.goodsId);  // 过滤没有物资编码和物资编码的行
        if (billData.detailList.length === 0) {
          message.warning('物资条数不能小于1');
          return;
        } else if (billData.detailList.length > 0) {
          billData.detailList.map((item) => {
            index += 1;
            if (item.goodsQty <= 0) {
              errorHtml += `第${index}行,入库数量不能小于等于0;`;
              isValid = false;
              return false;
            }
            if (item.unitPrice < 0) {
              errorHtml += `第${index}行,不含税入库价不能小于0;`;
              isValid = false;
              return false;
            }
            if (item.dualUnitName && item.dualUnitName.length > 0 && item.dualGoodsQty === 0) {
              errorHtml += `第${index}行，双单位物资的辅助数量不可以是0;`;
              isValid = false;
              return false;
            }
            if (item.unitPrice === '' || item.goodsQty === '' || item.goodsAmt === '' || (item.dualUnitName && item.dualUnitName.length > 0 && item.dualGoodsQty === '')) {
              if (item.dualUnitName && item.dualUnitName.length > 0) {
                errorHtml += `第${index}行,入库数量、辅助数量、入库单价、入库金额中存在空值;`;
              } else {
                errorHtml += `第${index}行,入库数量、入库单价、入库金额中存在空值;`;
              }
              isValid = false;
              return false;
            }
            if (isNaN(item.unitPrice) || isNaN(item.goodsQty) || isNaN(item.goodsAmt) || (item.dualUnitName && item.dualUnitName.length > 0 && isNaN(item.dualGoodsQty))) {
              if (item.dualUnitName && item.dualUnitName.length > 0) {
                errorHtml += `第${index}行,入库数量、辅助数量、入库单价、入库金额中有非数字值;`;
              } else {
                errorHtml += `第${index}行,入库数量、入库单价、入库金额中有非数字值;`;
              }
              isValid = false;
              return false;
            }
          });
        }
        message.error(errorHtml, 3 + (index * 0.2));
        if (!isValid) {
          return;
        }
        onSaveStockIn(flag, billData);
      });
    } else if (flag === 'yes') {
      let isValid = true;
      let errorHtml = '';
      let index = 0;
      validateFields((errors) => {
        if (errors) {
          return;
        }
        const cacheOldIdsList = []; // 该数组用于保存编辑后还剩的id
        detailList.map((item) => {
          if (eidtGoodsId.indexOf(item.id) >= 0) {
            cacheOldIdsList.push(item.id);
          }
          return false;
        });
        // 取得表单数据
        const billData = {};
        // 显式字段
        billData.busiName = getFieldValue('busiName');
        billData.bussDate = getFieldValue('bussDate').format(dateFormat);
        billData.depotName = getFieldValue('depotName');
        billData.billType = getFieldValue('billType') !== '请选择类型' ? Number(getFieldValue('billType')) : '';
        billData.remarks = getFieldValue('remarks');
        // 隐式字段
        billData.depotId = depotId;
        billData.id = id;
        billData.busiId = busiId;
        billData.status = 962;
        billData.storeId = storeId;
        billData.delIdsList = eidtGoodsId.filter(item => cacheOldIdsList.indexOf(item) < 0);
        // 物资列表
        billData.detailList = detailList.filter(item => item.goodsCode);  // 过滤没有物资编码的行
        if (billData.detailList.length === 0) {
          message.warning('物资条数不能小于1');
          return;
        } else if (billData.detailList.length > 0) {
          billData.detailList.map((item) => {
            index += 1;
            if (item.goodsQty <= 0) {
              errorHtml += `第${index}行,入库数量不能小于等于0;`;
              isValid = false;
              return false;
            }
            if (item.unitPrice < 0) {
              errorHtml += `第${index}行,不含税入库价不能小于0;`;
              isValid = false;
              return false;
            }
            if (item.dualUnitName && item.dualUnitName.length > 0 && item.dualGoodsQty === 0) {
              errorHtml += `第${index}行，双单位物资的辅助数量不可以是0;`;
              isValid = false;
              return false;
            }
            if (item.unitPrice === '' || item.goodsQty === '' || item.goodsAmt === '' || (item.dualUnitName && item.dualUnitName.length > 0 && item.dualGoodsQty === '')) {
              if (item.dualUnitName && item.dualUnitName.length > 0) {
                errorHtml += `第${index}行,入库数量、辅助数量、入库单价、入库金额中存在空值;`;
              } else {
                errorHtml += `第${index}行,入库数量、入库单价、入库金额中存在空值;`;
              }
              isValid = false;
              return false;
            }
            if (isNaN(item.unitPrice) || isNaN(item.goodsQty) || isNaN(item.goodsAmt) || (item.dualUnitName && item.dualUnitName.length > 0 && isNaN(item.dualGoodsQty))) {
              if (item.dualUnitName && item.dualUnitName.length > 0) {
                errorHtml += `第${index}行,入库数量、辅助数量、入库单价、入库金额中有非数字值;`;
              } else {
                errorHtml += `第${index}行,入库数量、入库单价、入库金额中有非数字值;`;
              }
              isValid = false;
              return false;
            }
          });
        }
        message.error(errorHtml, 3 + (index * 0.2));
        if (!isValid) {
          return;
        }
        onSaveStockIn(flag, billData);
      });
    }
    // 提交后所有验证项都设为true
    const tempValidateList = [];
    validateList.map((item) => {
      const cacheItem = item;
      cacheItem.goodsQty = true;
      cacheItem.dualGoodsQty = true;
      cacheItem.unitPrice = true;
      cacheItem.goodsAmt = true;
      cacheItem.remarks = true;
      tempValidateList.push(cacheItem);
      return false;
    });
    onValidateListChange(tempValidateList);
  };
  const valBillType = (rule, value, callback) => {
    if (value) {
      if (value === '请选择类型') {
        callback('请选择类型！');
      } else {
        callback();
      }
    } else {
      callback();
    }
  };


  return (
    <div className="components-search">
      <Breadcrumb separator=">">
        <Breadcrumb.Item>供应链</Breadcrumb.Item>
        <Breadcrumb.Item>集团总部管理</Breadcrumb.Item>
        <Breadcrumb.Item>入库管理</Breadcrumb.Item>
        {pageType === 'add' && <Breadcrumb.Item>新增入库单</Breadcrumb.Item>}
        {pageType === 'edit' && <Breadcrumb.Item>编辑入库单</Breadcrumb.Item>}
        {pageType === 'view' && <Breadcrumb.Item>查看入库单</Breadcrumb.Item>}
      </Breadcrumb>
      <div>
        <Form layout="inline">
          <FormItem label="入库仓库" className="require-item">
            {getFieldDecorator('depotName', {
              initialValue: depotName || '',
              rules: [
                { required: true, message: '请选择仓库!' },
              ],
            })(
              <Select
                placeholder="请选择入库仓库"
                mode="combobox"
                style={{ width: 140 }}
                onChange={handleDepotChange}
                onFocus={handleDepotFocus}
                onSelect={handleDepotSelect}
                disabled={pageType === 'view'}
              >
                {warehouseOptions}
              </Select>,
            )}
          </FormItem>
          <FormItem label="入库日期">
            {getFieldDecorator('bussDate', {
              initialValue: bussDateInit,
            })(
              <DatePicker
                style={{ width: 140 }}
                disabledDate={disabledDate}
                disabled={pageType === 'view'}
                allowClear={false}
              />,
            )}
          </FormItem>
          <FormItem label="单据类型:" className="require-item">
            {getFieldDecorator('billType', {
              initialValue: billType || '请选择类型',
              rules: [
                { required: true, message: '请选择单据类型!' },
                { validator: valBillType },
              ],
            })(
              <Select
                style={{ width: 140 }}
                placeholder="请选择类型"
                disabled={pageType === 'view'}
              >
                {billTypeOptions}
              </Select>,
            )}
          </FormItem>
          <FormItem label="供应商">
            {getFieldDecorator('busiName', {
              initialValue: busiName || '',
              rules: [
                { required: true, message: '请选择供应商!' },
              ],
            })(
              <Select
                placeholder="请选择供应商"
                mode="combobox"
                style={{ width: 140 }}
                onChange={handleSupplierChange}
                onFocus={handleSupplierFocus}
                onSelect={handleSupplierSelect}
                disabled={pageType === 'view'}
              >
                {supplierOptions}
              </Select>,
            )}
          </FormItem>
          <FormItem label="备注" className="require-item">
            {getFieldDecorator('remarks', {
              initialValue: remarks || '',
              rules: [
                { max: 25, message: '最长为25字' },
              ],
            })(
              <Input placeholder="备注" style={{ width: 140 }} maxLength="25" disabled={pageType === 'view'} />,
            )}
          </FormItem>
          <div className="handson-table">
            {miniGoodsVisible && <div style={{ top: topMini - adaptRowHeight }} className="miniGoods">
              <Select
                ref={(e) => {
                  if (e) {
                    ReactDOM.findDOMNode(e).querySelectorAll('input')[0].focus(); // 定位光标
                  }
                  miniRef = e;
                }}
                mode="combobox"
                defaultValue={initGoodsValue}
                className="mini-goods-select"
                onChange={handleGoodsListChange}
                onFocus={handleGoodsListFocus}
                onSelect={handleGoodsListSelect}
                onBlur={handleGoodsListBlur}
                dropdownClassName="mini-goods-select-dropdown"
              >
                {goodsListOptions}
              </Select>
            </div>}
            {(pageType === 'add' || pageType === 'edit') && <div>
              <div className="tip-info">注：淡蓝色框可输入</div>
            <HotTable
              className="table-container"
              ref={e => (hotRef = e)}
              settings={{
                data: detailList,
                colHeaders: (index) => {
                  let backHtml = '';
                  switch (index) {
                    case 0:
                      backHtml = `<div class="common-th border-right-no"><p>&nbsp;</p><p><span class="txt">${columuHearderProps[index]}</span><i class="anticon anticon-edit" style="margin-left: 0.5em; position: relative;top: -10px ;"></i></p></div>`;
                      break;
                    case 1:
                      backHtml = '<div class="common-th"><p>&nbsp;</p><p><span class="txt">&nbsp;</span></p></div>';
                      break;
                    case 4:
                      backHtml = `<div class="merge-th-left"><p>标</p><p class="handsontable-br">${columuHearderProps[index]}</p></div>`;
                      break;
                    case 5:
                      backHtml = `<div class="merge-th-right"><p>准</p><p class="handsontable-br">${columuHearderProps[index]}<i class="anticon anticon-edit" style="margin-left: 0.5em;"></i></p></div>`;
                      break;
                    case 6:
                      backHtml = `<div class="merge-th-left"><p>辅</p><p class="handsontable-br">${columuHearderProps[index]}</p></div>`;
                      break;
                    case 7:
                      backHtml = `<div class="merge-th-right"><p>助</p><p class="handsontable-br">${columuHearderProps[index]}<i class="anticon anticon-edit" style="margin-left: 0.5em;"></i></p></div>`;
                      break;
                    case 8:
                      backHtml = `<div class="common-th"><p>&nbsp;</p><p><span class="txt">${columuHearderProps[index]}<i class="anticon anticon-edit" style="margin-left: 0.5em;"></i></span></p></div>`;
                      break;
                    case 9:
                      backHtml = `<div class="common-th"><p>&nbsp;</p><p><span class="txt">${columuHearderProps[index]}<i class="anticon anticon-edit" style="margin-left: 0.5em;"></i></span></p></div>`;
                      break;
                    case 12:
                      backHtml = `<div class="merge-th-left"><p>不含</p><p class="handsontable-br">${columuHearderProps[index]}</p></div>`;
                      break;
                    case 13:
                      backHtml = `<div class="merge-th-right"><p>税</p><p class="handsontable-br">${columuHearderProps[index]}</p></div>`;
                      break;
                    case 14:
                      backHtml = `<div class="common-th"><p>&nbsp;</p><p><span class="txt">${columuHearderProps[index]}<i class="anticon anticon-edit" style="margin-left: 0.5em;"></i></span></p></div>`;
                      break;
                    default:
                      backHtml = `<div class="common-th"><p>&nbsp;</p><p><span class="txt">${columuHearderProps[index]}</span></p></div>`;
                      break;
                  }
                  return backHtml;
                },
                columns: columnBodyProps,
                colWidths: [72, 25, 72, 50, 40, 50, 40, 50, 70, 72, 58, 72, 50, 72, 75, 60],
                wordWrap: false,
                rowHeights: 27,
                rowHeaderWidth: 30,
                enterMoves: { row: 0, col: 0 },
                width: 958,
                height: hotTableHeight > 100 ? hotTableHeight : 100,
                allowInvalid: true,
                afterChange: (changes, source) => {
                  if (source !== 'loadData') {
                    htAfterChange(changes, source);
                  }
                },
                beforeChange: (changes, source) => {
                  if (source !== 'loadData') {
                    htBeforeChange(changes, source);
                  }
                },
                afterSelectionByProp: (r, c, r2, c2, preventScrolling) => {
                  htAfterSelectionByProp(r, c, r2, c2, preventScrolling);
                },
                beforePaste: (data, coords) => {
                  htBeforePaste(data, coords);
                },
                afterScrollHorizontally: () => {
                  // 判断如果出现水平滚动条没有在最左侧，那么需要关闭下拉选择
                  const scrollObjArray = ReactDOM.findDOMNode(hotRef).querySelectorAll('.innerBorderLeft');
                  if (scrollObjArray.length > 0) {
                    onHideMini();
                  }
                },
                afterDocumentKeyDown: (e) => {
                  // 当按下键盘事件发生时
                  htAfterDocumentKeyDown(e);
                },
                afterScrollVertically: () => {
                  // scrollTop为出现垂直滚动条卷曲的高度，用于计算下拉物资选择的定位
                  const scrollTop = ReactDOM.findDOMNode(hotRef).querySelectorAll('.wtHolder')[0].scrollTop;
                  onChangeTopMini(((activeRow * 28) + 44) - scrollTop);
                },
                // 在鼠标点下之后，如果是物资行，那么就禁用本身事件
                afterOnCellMouseDown: (e, c) => {
                  if (c.col === 0) {
                    e.stopImmediatePropagation();
                    e.preventDefault();
                  }
                },
                beforeOnCellMouseDown: (e, c) => {
                  if (c.col === 0) {
                    hotRef.hotInstance.selectCellByProp(c.row, enterProps[0]);
                  }
                },
                // stretchH: 'last',
                rowHeaders: true,
                fillHandle: false,
              }}
            /></div>}
            {pageType === 'view' && <HotTable
              className="table-container"
              ref={e => (hotRef = e)}
              settings={{
                data: detailList,
                colHeaders: (index) => {
                  let backHtml = '';
                  switch (index) {
                    case 3:
                      backHtml = `<div class="merge-th-left"><p>标</p><p class="handsontable-br">${columuHearderPropsView[index]}</p></div>`;
                      break;
                    case 4:
                      backHtml = `<div class="merge-th-right"><p>准</p><p class="handsontable-br">${columuHearderPropsView[index]}</p></div>`;
                      break;
                    case 5:
                      backHtml = `<div class="merge-th-left"><p>辅</p><p class="handsontable-br">${columuHearderPropsView[index]}</p></div>`;
                      break;
                    case 6:
                      backHtml = `<div class="merge-th-right"><p>助</p><p class="handsontable-br">${columuHearderPropsView[index]}</p></div>`;
                      break;
                    case 11:
                      backHtml = `<div class="merge-th-left"><p>不含</p><p class="handsontable-br">${columuHearderPropsView[index]}</p></div>`;
                      break;
                    case 12:
                      backHtml = `<div class="merge-th-right"><p>税</p><p class="handsontable-br">${columuHearderPropsView[index]}</p></div>`;
                      break;
                    default:
                      backHtml = `<div class="common-th"><p>&nbsp;</p><p><span class="txt">${columuHearderPropsView[index]}</span></p></div>`;
                      break;
                  }
                  return backHtml;
                },
                columns: columnBodyProps,
                // colWidths: [80, 120, 60, 60, 60, 60, 60, 60, 60, 60, 60, 80, 80, 60],
                enterMoves: { row: 0, col: 0 },
                rowHeights: 27,
                rowHeaderWidth: 30,
                width: 958,
                height: hotTableHeight > 100 ? hotTableHeight : 100,
                allowInvalid: true,
                stretchH: 'all',
                rowHeaders: true,
                fillHandle: false,
              }}
            />}
            <div className="form-act">
              {(pageType === 'add' || pageType === 'edit') && <span><Button loading={loadingSave} onClick={() => saveStockIn('no')}>暂存</Button>&nbsp;&nbsp;</span>}
              {(pageType === 'add' || pageType === 'edit') && <span><Button type="primary" loading={loadingStock} onClick={() => saveStockIn('yes')}>入库</Button>&nbsp;&nbsp;</span>}
              <Button onClick={onBack}>返回</Button>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
};

search.propTypes = {
  storeId: PropTypes.string,
};
export default Form.create()(search);
