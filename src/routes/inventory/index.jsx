import RouterConfig from '../router';

const routes = [
  {
    path: '/stock/taxRate',
    component: require('./TaxRate'),
  },
  {
    path: '/stock/monthEnd',
    component: require('./MonthEnd'),
  },
  {
    path: '/stock/zbMonthEnd',
    component: require('./ZbMonthEnd'),
  },
  {
    path: '/stock/scrap',
    component: require('./Scrap'),
  },
  {
    path: '/stock/shelves',
    component: require('./Shelves'),
  },
  {
    path: '/stock/orderTemplate',
    component: require('./OrderTemplate'),
  },
  {
    path: '/stock/orderTemplate/details',
    component: require('./OrderTemplateDetails'),
  },
  {
    path: '/stock/forecast',
    component: require('./Forecast'),
  },
  {
    path: '/stock/cut',
    component: require('./Cut'),
  },
  {
    path: '/stock/utilities',
    component: require('./Utilities'),
  },
  {
    path: '/stock/utilities/:storeId',
    component: require('./Utilities'),
  }, // 详情页返回路由
  {
    path: '/stock/utilitiesItem/:itemId/:storeId/:utilitiesName',
    component: require('./UtilitiesItem'),
  },
  {
    path: '/stock/reportCost',
    component: require('./ReportCost'),
  },
  {
    path: '/stock/reportDish',
    component: require('./ReportDish'),
  },
  {
    path: '/stock/reportDiff',
    component: require('./ReportDiff'),
  },
  {
    path: '/stock/dishRates',
    component: require('./DishRates'),
  },
  {
    path: '/stock/posPlans',
    component: require('./PosPlans'),
  },
  {
    path: '/stock/purchase',
    component: require('./Purchase'),
  },
  {
    path: '/stock/purchase/purchaseAddNew',
    component: require('./PurchaseAddNew'),
  },
  {
    path: '/stock/purchase/purchaseFind',
    component: require('./PurchaseFind'),
  },
  {
    path: '/stock/requisition',
    component: require('./Requisition'),
  },
  {
    path: '/stock/requisition/details/:type/:idKye/:storeId',
    component: require('./RequisitionDetails'),
  },
  {
    path: '/official/price_list',
    component: require('./PriceList'),
  },
  {
    path: '/official/price_list/:pagetype(/:billId)(/:orgId)',
    component: require('./PriceListDetails'),
  },
  {
    path: '/stock/cannManage',
    component: require('./CannManage'),
  },
  {
    path: '/stock/cannManage/details/:storeIdKey',
    component: require('./CannManageDetails'),
  },
  {
    path: '/stock/supplyRelation',
    component: require('./SupplyRelation'),
  },
  {
    path: '/stock/supplierType',
    component: require('./SupplierType'),
  },
  {
    path: '/stock/supplyOrder/supplyOrderAddNew/:storeId',
    component: require('./SupplyOrderAddNew'),
  },
  {
    path: '/stock/supplyOrder/supplyOrderFind/:storeId',
    component: require('./SupplyOrderFind'),
  },
  {
    path: '/stock/supplyOrder',
    component: require('./SupplyOrder'),
  },
  {
    path: '/stock/orderLib',
    component: require('./OrderLib'),
  },
  {
    path: '/stock/orderLib/details',
    component: require('./OrderLibDetails'),
  },
  {
    path: '/stock/dispatchOrders',
    component: require('./DispatchOrders'),
  },
  {
    path: '/stock/dispatchOrders/details/:pageType/:id',
    component: require('./DispatchOrdersDetails'),
  },
  {
    path: '/stock/directCheck',
    component: require('./DirectCheck'),
  },
  {
    path: '/stock/directCheck/details/:type/:idKye/:storeId',
    component: require('./DirectCheckDetails'),
  },
  {
    path: '/stock/allotManage',
    component: require('./AllotManage'),
  },
  {
    path: '/stock/allotManage/allotManageAddNew',
    component: require('./AllotManageAddNew'),
  },
  {
    path: '/stock/zb/stockIn',
    component: require('./ZbStockIn'),
  },
  {
    path: '/stock/zb/stockIn/:storeId',
    component: require('./ZbStockIn'),
  }, // 返回入库列表路由
  {
    path: '/stock/zb/stockIn/item/:pageType/:storeId/:id',
    component: require('./ZbStockInItem'),
  },
  {
    path: '/stock/stockOut',
    component: require('./StockOut'),
  },
  {
    path: '/stock/stockOut/:storeId',
    component: require('./StockOut'),
  }, // 返回出库列表
  {
    path: '/stock/stockOut/details/:itemId/:storeId/:id',
    component: require('./StockOutDetails'),
  },
  {
    path: '/stock/officialCheck',
    component: require('./OfficialCheck'),
  },
  {
    path: '/stock/officialCheck/details',
    component: require('./OfficialCheckDetails'),
  },
  {
    path: '/stock/stockGlobalReport',
    component: require('./StockGlobalReport'),
  },
  {
    path: '/stock/stockGlobalInOutSummary',
    component: require('./StockGlobalInOutSummary'),
  },
  {
    path: '/stock/purchaseCheck',
    component: require('./PurchaseCheck'),
  },
  {
    path: '/stock/purchaseCheck/details/:storeIdKey',
    component: require('./PurchaseCheckDetails'),
  },
  {
    path: '/stock/purchaseZB',
    component: require('./PurchaseZB'),
  },
  {
    path: '/stock/purchaseZB/details/:storeIdKey',
    component: require('./PurchaseZBDetails'),
  },
  {
    path: '/stock/stockGlobalInOutDetail',
    component: require('./StockGlobalInOutDetail'),
  },
  { // 总部盘存明细表
    path: '/stock/stockCheckDetailReport',
    component: require('./StockCheckDetailReport'),
  },
  {
    path: '/stock/dispatchCheck',
    component: require('./DispatchCheck'),
  },
  {
    path: '/stock/dispatchCheck/details/:pageType/:storeId/:id',
    component: require('./DispatchCheckDetails'),
  },
  {
    path: '/stock/stockOutDistribution',
    component: require('./StockOutDistribution'),
  },
  {
    path: '/stock/StockOutDistribution/:storeId',
    component: require('./StockOutDistribution'),
  }, // 返回出库列表
  {
    path: '/stock/stockOutDistribution/details/:itemId/:storeId/:id/:status',
    component: require('./StockOutDistributionDetails'),
  },
  {
    path: '/stock/depotRelationSetting',
    component: require('./DepotRelationSetting'),
  },
  {
    path: '/stock/deliveryPriceReport',
    component: require('./DeliveryPriceReport'),
  },
  {
    path: '/stock/purchaseDetailsReports',
    component: require('./PurchaseDetailsReports'),
  },
  {
    path: '/stock/distributionDetailReport',
    component: require('./DistributionDetailReport'),
  },
];

const Router = ({ history, app }) => {
  const routerProps = {
    history,
    app,
    routes,
  };

  return <RouterConfig {...routerProps} />;
};

export default Router;
