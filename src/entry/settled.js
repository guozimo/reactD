import dva from 'dva';
import createLoading from 'dva-loading';
import './settled.less';

// 1. Initialize
const app = dva({
  onError(error) {
    console.error(error);
  },
});
// console.log(app._store);

// 2. Plugins
app.use(createLoading());

// 3. Model
app.model(require('../models/app'));
app.model(require('../models/settled/settled'));
app.model(require('../models/settled/completion'));
app.model(require('../models/settled/restaurantSet'));
app.model(require('../models/settled/deliverySet'));
app.model(require('../models/settled/modifyPassword'));
app.model(require('../models/settled/forgetPassword'));
app.model(require('../models/settled/authorization'));
app.model(require('../models/settled/merchantDisplay'));
app.model(require('../models/settled/batchImport'));
app.model(require('../models/settled/keyShop'));
app.model(require('../models/settled/myServices'));
app.model(require('../models/settled/printerTemplate'));
app.model(require('../models/settled/printerTemplateDisplay'));
app.model(require('../models/settled/memberImport'));
app.model(require('../models/settled/authority'));
app.model(require('../models/settled/chainSet'));

// 4. Router
app.router(require('../routes/settled'));

// 5. Start
app.start('#root');
