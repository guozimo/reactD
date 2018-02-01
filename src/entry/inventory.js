
import dva from 'dva';
import createLoading from 'dva-loading';
import 'moment/locale/zh-cn';
import moment from 'moment';
import './inventory.less';

moment.locale('zh-cn');

// 1. Initialize
const app = dva({
  onError(error) {
    console.error(error);
  },
});

// 2. Plugins
app.use(createLoading());

// 3. Model
app.model(require('../models/app'));
app.model(require('../models/inventory/taxRate'));
app.model(require('../models/inventory/scrap'));
app.model(require('../models/inventory/shelves'));
app.model(require('../models/inventory/orderTemplate'));
app.model(require('../models/inventory/orderTemplateDetails'));
app.model(require('../models/inventory/forecast'));
app.model(require('../models/inventory/cut'));
app.model(require('../models/inventory/utilities'));
app.model(require('../models/inventory/utilitiesItem'));
app.model(require('../models/inventory/reportCost'));
app.model(require('../models/inventory/reportDish'));
app.model(require('../models/inventory/reportDiff'));
app.model(require('../models/inventory/dishRates'));
app.model(require('../models/inventory/posPlans'));
app.model(require('../models/inventory/monthEnd'));

// 以下是新添加的总部部分
app.model(require('../models/inventory/zbMonthEnd'));
app.model(require('../models/inventory/purchase'));
app.model(require('../models/inventory/requisitionDetails'));
app.model(require('../models/inventory/requisition'));
app.model(require('../models/inventory/cannManageDetails'));
app.model(require('../models/inventory/cannManage'));
app.model(require('../models/inventory/supplyRelation'));
app.model(require('../models/inventory/supplyOrder'));
app.model(require('../models/inventory/supplierType'));
app.model(require('../models/inventory/orderLib'));
app.model(require('../models/inventory/dispatchOrders'));
app.model(require('../models/inventory/dispatchOrdersDetails'));
app.model(require('../models/inventory/orderLibDetails'));
app.model(require('../models/inventory/directCheck'));
app.model(require('../models/inventory/directCheckDetails'));
app.model(require('../models/inventory/allotManage'));
app.model(require('../models/inventory/_common/goodsPopList')); // ../models/inventory/goodsPopList
app.model(require('../models/inventory/zbStockIn'));
app.model(require('../models/inventory/zbStockInItem'));
app.model(require('../models/inventory/stockOut'));
app.model(require('../models/inventory/stockOutDetails'));
app.model(require('../models/inventory/officialCheck'));
app.model(require('../models/inventory/officialCheckDetails'));
app.model(require('../models/inventory/stockGlobalReport'));
app.model(require('../models/inventory/stockGlobalInOutSummary'));
app.model(require('../models/inventory/priceListDetails'));
app.model(require('../models/inventory/priceList'));
app.model(require('../models/inventory/purchaseCheck'));
app.model(require('../models/inventory/stockCheckDetailReport'));
app.model(require('../models/inventory/purchaseZB'));
app.model(require('../models/inventory/stockGlobalInOutDetail'));
app.model(require('../models/inventory/dispatchCheck'));
app.model(require('../models/inventory/dispatchCheckDetails'));
app.model(require('../models/inventory/stockOutDistribution'));
app.model(require('../models/inventory/stockOutDistributionDetails'));
app.model(require('../models/inventory/depotRelationSetting'));
app.model(require('../models/inventory/deliveryPriceReport'));
app.model(require('../models/inventory/purchaseDetailsReports'));
app.model(require('../models/inventory/distributionDetailReport'));

// 4. Router
app.router(require('../routes/inventory'));

// 5. Start
app.start('#root');
