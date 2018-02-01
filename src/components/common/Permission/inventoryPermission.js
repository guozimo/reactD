module.exports = {
  PRICE_LIST: {
    PAGE: {
      code: '615012',
      description: '配送售价单',
    },
    VIEW: {
      code: '61501201',
      description: '配送售价单_查看',
    },
    EDIT: {
      code: '61501202',
      description: '配送售价单_编辑',
    },
    ABOLISH: {
      code: '61501203',
      description: '配送售价单_整单作废',
    },
    DELETE: {
      code: '61501204',
      description: '配送售价单_删除',
    },
    CREATE: {
      code: '61501205',
      description: '配送售价单_新增',
    },
    VERIFY: {
      code: '61501206',
      description: '配送售价单_审核',
    },
  },
  DEPOT_RELATION: {
    PAGE: {
      code: '611005',
      description: '仓库配送关系设置',
    },
    CREATE: {
      code: '61100501',
      description: '仓库配送关系设置_新增',
    },
    BATCH_DELETE: {
      code: '61100502',
      description: '仓库配送关系设置_批量删除',
    },
    DELETE: {
      code: '61100503',
      description: '仓库配送关系设置_删除',
    },
  },
  SUPPLIER_TYPE: {
    PAGE: {
      code: '611006',
      description: '供应商类型',
    },
    CREATE: {
      code: '61100601',
      description: '供应商类型_添加',
    },
    EDIT: {
      code: '61100602',
      description: '供应商类型_编辑',
    },
    DELETE: {
      code: '61100603',
      description: '供应商类型_删除',
    },
  },
  DISPATCH_CHECK: {
    PAGE: {
      code: '614013',
      description: '配送验收',
    },
    VIEW: {
      code: '61401301',
      description: '配送验收_查看',
    },
    CHECK: {
      code: '61401302',
      description: '配送验收_验收',
    },
  },
  DISPATCH_ORDERS: {
    PAGE: {
      code: '615010',
      description: '配送订单',
    },
    VIEW: {
      code: '61501001',
      description: '配送订单_查看',
    },
    EXPORT: {
      code: '61501002',
      description: '配送订单_导出',
    },
    EDIT: {
      code: '61501003',
      description: '配送订单_编辑',
    },
    CLOSE: {
      code: '61501004',
      description: '配送订单_关闭',
    },
    SUBMIT: {
      code: '61501005',
      description: '配送订单_提交',
    },
  },
  DISPATCH_OUT: {
    PAGE: {
      code: '615011',
      description: '配送出库',
    },
    VIEW: {
      code: '61501101',
      description: '配送出库_查看',
    },
    EXPORT: {
      code: '61501102',
      description: '配送出库_导出',
    },
    OUT: {
      code: '61501103',
      description: '配送出库_出库',
    },
  },
  DELIVERY_PRICE_LIST: {
    PAGE: {
      code: '615013',
      description: '配送售价综合查询',
    },
    ABOLISH: {
      code: '61501301',
      description: '配送售价综合查询_作废',
    },
  },
  GLOBAL_INOUT_DETAILS: {
    PAGE: {
      code: '615014',
      description: '进销存明细报表',
    },
    EXPORT: {
      code: '61501401',
      description: '进销存明细报表_导出表格',
    },
  },
  CHECK_INOUT_DETAILS: {
    PAGE: {
      code: '615015',
      description: '盘存明细表',
    },
    EXPORT: {
      code: '61501501',
      description: '盘存明细表_导出表格',
    },
  },
  DISTRIBUTION_DETAILS: {
    PAGE: {
      code: '615016',
      description: '配送明细报表',
    },
    EXPORT: {
      code: '61501601',
      description: '配送明细报表_导出表格',
    },
  },
  PURCHASE_DETAILS: {
    PAGE: {
      code: '615017',
      description: '采购明细报表',
    },
    EXPORT: {
      code: '61501701',
      description: '采购明细报表_导出表格',
    },
  },
  CANN_MANAGE: {
    ADD: {
      code: '61500501',
      description: '总部调拨管理_新增调拨单',
    },
    DELETE: {
      code: '61500504',
      description: '总部调拨管理_删除',
    },
    SUBMIT: {
      code: '61500505',
      description: '总部调拨管理_调单',
    },
    VIEW: {
      code: '61500502',
      description: '总部调拨管理_查看',
    },
    EXPORT: {
      code: '61500503',
      description: '总部调拨管理_导出',
    },
  },
  TAX_RATE: {
    PAGE: { code: '611001', description: '税率设置' },
    CREATE: { code: '61100101', description: '税率设置_添加' },
    EDIT: { code: '61100102', description: '税率设置_编辑' },
    DELETE: { code: '61100103', description: '税率设置_删除' },
  },
  SUPPLY_RELATION: {
    PAGE: { code: '611002', description: '供货关系设置' },
    CREATE: { code: '61100201', description: '供货关系设置_新增供货关系' },
    PRIORITY: { code: '61100202', description: '供货关系设置_设置供货优先级' },
    EDIT: { code: '61100203', description: '供货关系设置_修改' },
    DELETE: { code: '61100204', description: '供货关系设置_删除' },
  },
  UNIT: {
    PAGE: { code: '611003', description: '单位管理' },
    CREATE: { code: '61100301', description: '单位管理_新增' },
    EDIT: { code: '61100302', description: '单位管理_编辑' },
    DELETE: { code: '61100303', description: '单位管理_删除' },
  },
  DEPOT: {
    PAGE: { code: '611004', description: '仓库档案' },
    CREATE: { code: '61100401', description: '仓库档案_新增' },
    EDIT: { code: '61100402', description: '仓库档案_编辑' },
    DELETE: { code: '61100403', description: '仓库档案_删除' },
    WRITE_DOWNS: { code: '61100404', description: '仓库档案_设置冲减物品' },
    DEFAULT: { code: '61100405', description: '仓库档案_默认仓库' },
  },
  ITEM_TYPE: {
    PAGE: { code: '612001', description: '物品管理物品类别' },
    CREATE: { code: '61200101', description: '物品管理物品类别_新增类别' },
    EDIT: { code: '61200102', description: '物品管理物品类别_编辑' },
    DELETE: { code: '61200103', description: '物品管理物品类别_删除' },
  },
  ITEM_LIST: {
    PAGE: { code: '612002', description: '物品管理物品档案' },
    CREATE: { code: '61200201', description: '物品管理物品档案_新增物品' },
    IMPORT: { code: '61200202', description: '物品管理物品档案_批量导入' },
    EDIT: { code: '61200203', description: '物品管理物品档案_编辑' },
    DELETE: { code: '61200204', description: '物品管理物品档案_删除' },
    TEMPLATE: { code: '61200205', description: '物品管理物品档案_模板下载' },
  },
  SUPPLIER: {
    PAGE: { code: '613001', description: '供应商档案' },
    CREATE: { code: '61300101', description: '供应商档案_添加' },
    EDIT: { code: '61300102', description: '供应商档案_编辑' },
    DELETE: { code: '61300103', description: '供应商档案_删除' },
  },
  REQUISITION: {
    PAGE: { code: '614001', description: '门店进销存管理门店请购' },
    CREATE: { code: '61400101', description: '门店进销存管理门店请购_新增请购单' },
    VIEW: { code: '61400102', description: '门店进销存管理门店请购_查看' },
    EXPORT: { code: '61400103', description: '门店进销存管理门店请购_导出' },
    EDIT: { code: '61400104', description: '门店进销存管理门店请购_编辑' },
    DELETE: { code: '61400105', description: '门店进销存管理门店请购_删除' },
  },
  DIRECT_CHECK: {
    PAGE: { code: '614002', description: '门店进销存管理直运验收' },
    VERIFY: { code: '61400201', description: '门店进销存管理直运验收_验收' },
    VIEW: { code: '61400202', description: '门店进销存管理直运验收_查看' },
  },
  STOCK_IN: {
    PAGE: { code: '614003', description: '门店进销存管理入库管理' },
    CREATE: { code: '61400301', description: '门店进销存管理入库管理_新增入库单' },
    VIEW: { code: '61400302', description: '门店进销存管理入库管理_查看' },
    EXPORT: { code: '61400303', description: '门店进销存管理入库管理_导出' },
    EDIT: { code: '61400304', description: '门店进销存管理入库管理_编辑' },
    DELETE: { code: '61400305', description: '门店进销存管理入库管理_删除' },
    ANTI_VERIFY: { code: '61400306', description: '门店进销存管理入库管理_反审核' },
  },
  STOCK_OUT: {
    PAGE: { code: '614004', description: '门店进销存管理出库管理' },
    CREATE: { code: '61400401', description: '门店进销存管理出库管理_新增出库单' },
    VIEW: { code: '61400402', description: '门店进销存管理出库管理_查看' },
    TRANSFER: { code: '61400403', description: '门店进销存管理出库管理_调单' },
    ANTI_VERIFY: { code: '61400404', description: '门店进销存管理出库管理_反审核' },
    DELETE: { code: '61400405', description: '门店进销存管理出库管理_删除' },
    EXPORT: { code: '61400406', description: '门店进销存管理出库管理_导出' },
  },
  STOCK_TRANSFER: {
    PAGE: { code: '614005', description: '门店进销存管理调拨管理' },
    CREATE: { code: '61400501', description: '门店进销存管理调拨管理_新增调拨单' },
    VIEW: { code: '61400502', description: '门店进销存管理调拨管理_查看' },
    TRANSFER: { code: '61400503', description: '门店进销存管理调拨管理_调单' },
    DELETE: { code: '61400505', description: '门店进销存管理调拨管理_删除' },
    EXPORT: { code: '61400506', description: '门店进销存管理调拨管理_导出' },
  },
  STOCK_CHECK: {
    PAGE: { code: '614006', description: '门店进销存管理盘点管理' },
    CREATE: { code: '61400601', description: '门店进销存管理盘点管理_新增盘点单' },
    VIEW: { code: '61400602', description: '门店进销存管理盘点管理_查看' },
    TRANSFER: { code: '61400603', description: '门店进销存管理盘点管理_调单' },
    DELETE: { code: '61400605', description: '门店进销存管理盘点管理_删除' },
    EXPORT: { code: '61400606', description: '门店进销存管理盘点管理_导出' },
    EDIT: { code: '61400607', description: '门店进销存管理盘点管理_编辑' },
  },
  STOCK_MONTH_CHECK: {
    PAGE: { code: '614007', description: '门店进销存管理门店月结' },
    MONTH_CHECK: { code: '61400701', description: '门店进销存管理门店月结_月结' },
  },
  STOCK_REPORT: {
    PAGE: { code: '614008', description: '门店进销存管理库存报表' },
    EXPORT: { code: '61400801', description: '门店进销存管理库存报表_导出表格' },
  },
  STOCK_INOUT_SUMMARY: {
    PAGE: { code: '614009', description: '门店进销存管理进销存汇总表' },
    EXPORT: { code: '61400901', description: '门店进销存管理进销存汇总表_导出表格' },
  },
  STOCK_INOUT_DETAIL: {
    PAGE: { code: '614010', description: '门店进销存管理进销存明细' },
    EXPORT: { code: '61401001', description: '门店进销存管理进销存明细_导出表格' },
  },
  STOCK_CHECK_DETAIL: {
    PAGE: { code: '614011', description: '门店进销存管理盘存明细表' },
    EXPORT: { code: '61401101', description: '门店进销存管理盘存明细表_导出表格' },
  },
  ORDER_LIB: {
    PAGE: { code: '615001', description: '订单中心' },
    GENERATE: { code: '61500101', description: '订单中心_一键生成订单' },
    VIEW: { code: '61500102', description: '订单中心_查看' },
    ROLL_BACK: { code: '61500103', description: '订单中心_退回' },
    EXPORT: { code: '61500104', description: '订单中心_导出' },
  },
  SUPPLY_ORDER: {
    PAGE: { code: '615002', description: '直运采购' },
    CREATE: { code: '61500201', description: '直运采购_新增直运订单' },
    VIEW: { code: '61500202', description: '直运采购_查看' },
    EXPORT: { code: '61500203', description: '直运采购_导出' },
  },
  OFFICIAL_IN: {
    PAGE: { code: '615003', description: '入库管理' },
    CREATE: { code: '61500301', description: '入库管理_新增入库单' },
    VIEW: { code: '61500302', description: '入库管理_查看' },
    ANTI_VERIFY: { code: '61500303', description: '入库管理_反审核' },
    EXPORT: { code: '61500304', description: '入库管理_导出' },
    EDIT: { code: '61500305', description: '入库管理_编辑' },
    DELETE: { code: '61500306', description: '入库管理_删除' },
  },
  OFFICIAL_OUT: {
    PAGE: { code: '615004', description: '出库管理' },
    CREATE: { code: '61500401', description: '出库管理_新增出库单' },
    VIEW: { code: '61500402', description: '出库管理_查看' },
    ANTI_VERIFY: { code: '61500403', description: '出库管理_反审核' },
    EXPORT: { code: '61500404', description: '出库管理_导出' },
    DELETE: { code: '61500405', description: '出库管理_删除' },
    TRANSFER: { code: '61500406', description: '出库管理_调单' },
  },
  OFFICIAL_CHECK: {
    PAGE: { code: '615006', description: '盘点管理' },
    CREATE: { code: '61500601', description: '盘点管理_新增盘点单' },
    VIEW: { code: '61500602', description: '盘点管理_查看' },
    EXPORT: { code: '61500603', description: '盘点管理_导出' },
    EDIT: { code: '61500604', description: '盘点管理_编辑' },
    DELETE: { code: '61500605', description: '盘点管理_删除' },
  },
  OFFICIAL_MONTH_CHECK: {
    PAGE: { code: '615007', description: '总部月结' },
    MONTH_CHECK: { code: '61500701', description: '总部月结_月结' },
  },
  OFFICIAL_STOCK_REPORT: {
    PAGE: { code: '615008', description: '库存报表' },
    EXPORT: { code: '61500801', description: '库存报表_导出表格' },
  },
  OFFICIAL_INOUT_SUMMARY: {
    PAGE: { code: '615009', description: '进销存汇总表' },
    EXPORT: { code: '61500901', description: '进销存汇总表_导出表格' },
  },
  UTILITIES: {
    PAGE: { code: '616001', description: '水电气设置' },
    CREATE: { code: '61600101', description: '水电气设置_添加' },
    DETAILS: { code: '61600102', description: '水电气设置_详情' },
    EDIT: { code: '61600103', description: '水电气设置_编辑' },
    DELETE: { code: '61600104', description: '水电气设置_删除' },
  },
  CUT: {
    PAGE: { code: '616002', description: '核减明细查询' },
    EXPORT: { code: '61600202', description: '核减明细查询_导出核减明细' },
  },
  REPORT_DIFF: {
    PAGE: { code: '616004', description: '物资差异分析' },
    EXPORT: { code: '61600401', description: '物资差异分析_导出差异分析' },
  },
  REPORT_DISH: {
    PAGE: { code: '616005', description: '单菜毛利分析' },
    EXPORT: { code: '61600501', description: '单菜毛利分析_导出' },
  },
  FORECAST: {
    PAGE: { code: '617001', description: '营业预估' },
    EXPORT: { code: '61700101', description: '营业预估_导出营业预估' },
    CREATE: { code: '61700102', description: '营业预估_添加' },
    EDIT: { code: '61700103', description: '营业预估_编辑' },
  },
  DISH_RATES: {
    PAGE: { code: '617002', description: '菜品点击率' },
    EXPORT: { code: '61700201', description: '菜品点击率_导出菜品点击率' },
    COMPUTE: { code: '61700202', description: '菜品点击率_计算' },
    EDIT: { code: '61700203', description: '菜品点击率_编辑' },
  },
  POS_PLANS: {
    PAGE: { code: '617003', description: '菜品销售计划' },
    EXPORT: { code: '61700301', description: '菜品销售计划_导出销售计划' },
    COMPUTE: { code: '61700302', description: '菜品销售计划_计算' },
    EDIT: { code: '61700303', description: '菜品销售计划_编辑' },
  },
};
