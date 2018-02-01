
export default true;

// 配送出库 stockOutDistribution
// 校验规则 在输入本次出库数量(currOutNum)时校验 本次出库数量(currOutNum)不为空，本次出库数量(currOutNum) + 已出库数量(outNum) 小于 订单数量(unitNum)，本次出库数量(currOutNum) 小于 当前库存数(wareNum)
// 在输入 辅助出库数(outDualNum)时校验 辅助出库数(outDualNum) 小于 辅助库存数量
//  || (rowItem.outNum !== rowItem.unitNum && (rowItem.currOutNum == 0 || rowItem.currOutNum == null)) 等于零的校验 保存
export function stockstockOutDistribution(listDataLine, field) {
  const rowItem = listDataLine;
  if ((rowItem.currOutNum + rowItem.outNum > rowItem.unitNum || rowItem.currOutNum > rowItem.wareNum) && field === 'currOutNum') {
    return false;
  } else if ((rowItem.currOutDualNum > rowItem.dualWareNum || rowItem.currOutDualNum > (rowItem.dualUnitNum - rowItem.outDualNum)) && field === 'currOutDualNum') {
    return false;
  }
  return true;
}

// 总部出库 stockOut
// 校验规则 在输入标准数量(goodsQty)时校验 标准数量(goodsQty)不为空，且不大于标准库存(wareQty)
// 在输入辅助数量(dualGoodsQty)时校验 辅助数量(dualGoodsQty)不为空，且不大于辅助库存(dualWareQty)
export function stockstockOut(listDataLine, field) {
  const rowItem = listDataLine;
  if ((rowItem.goodsCode == 0 || rowItem.goodsCode == null) && field === 'goodsCode') {
    return false;
  } else if ((rowItem.goodsQty == 0 || rowItem.goodsQty == null || rowItem.goodsQty > rowItem.wareQty) && field === 'goodsQty') {
    return false;
  } else if ((rowItem.dualGoodsQty == 0 || rowItem.dualGoodsQty == null || rowItem.dualGoodsQty > rowItem.dualWareQty) && field === 'dualGoodsQty') {
    return false;
  }
  return true;
}

// 配送验收 dispatchCheck
// 校验规则 在编辑本次验收(标准单位)(auditQty)时 本次验收(标准单位)(auditQty)不为空，且小于采购数量(ordUnitNum)
export function stockdispatchCheck(listDateLine, field) {
  const rowItem = listDateLine;
  if ((rowItem.auditQty == 0 || rowItem.auditQty > rowItem.unitNum) && field === 'auditQty') {
    return false;
  }
  return true;
}

// 门店请购 requisition
// 校验规则 在输入订货数量(purcUnitNum)时进行校验不为空
// 在有辅助 单位(dualUnitName)时，校验辅助数量(dualUnitNum)不为空
// 总体校验 物资编码(goodsCode),到货日期(arrivalDate) 不为空
export function stockrequisition(listDateLine, field) {
  const rowItem = listDateLine;
  if ((rowItem.goodsCode == 0 || rowItem.goodsCode == null) && field === 'goodsCode') {
    return false;
  } else if ((rowItem.arrivalDate == 0 || rowItem.arrivalDate == null) && field === 'arrivalDate') {
    return false;
  } else if ((rowItem.purcUnitNum == 0 || rowItem.purcUnitNum == null) && field === 'purcUnitNum') {
    return false;
  } else if ((rowItem.dualUnitName != 0 || rowItem.dualUnitName != null) && (rowItem.dualUnitNum == 0 || rowItem.dualUnitNum == null) && field === 'dualUnitNum') {
    return false;
  }
  return true;
}

// 直运验收 directCheck
// 校验规则 在编辑验收数量(auditNum)时 验收数量(auditNum)不为空
export function stockdirectCheck(listDateLine, field) {
  const rowItem = listDateLine;
  if (rowItem.auditNum == 0 && field === 'auditNum') {
    return false;
  }
  return true;
}
