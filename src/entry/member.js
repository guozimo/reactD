import dva from 'dva';
import createLoading from 'dva-loading';
import './member.less';

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
app.model(require('../models/member/memberMainContent'));
app.model(require('../models/member/memberDetailsContent'));
app.model(require('../models/member/rechargeRule'));
app.model(require('../models/member/consumptionDetails'));
app.model(require('../models/member/rechargeDetails'));
// 4. Router
app.router(require('../routes/member'));

// 5. Start
app.start('#root');
