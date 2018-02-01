import React,{PropTypes} from 'react';
import { Form, Button, Tag, Tooltip, Popconfirm, Select, Breadcrumb, message} from 'antd';
import moment from 'moment';
const Option = Select.Option


const search = ({
    menuData,              
    storeList,
    shopId,
    changeStore,
    onMonthEndChange,
    month,
    monthNext,
    isCheck,
    nowLast,
    now,
    selectStore,
    cancel,
    changeMonthEnd,
    notChecked,
    form: {
      getFieldDecorator,
      validateFields,
      getFieldsValue,
      getFieldValue,
    },
  }) => {
  changeStore = (value) => {
    selectStore(value);
  };
  cancel = () => {
    message.info('您选择了取消');
  };
  onMonthEndChange = () => {
    changeMonthEnd(shopId);
  };
  // 判断接口已经返回来值了
  // 月结时间大于当前时间加一个月不能月结month >= now + 1 不能月结
  let nowAdd = moment(moment(now).format('YYYY-MM')).add(1, 'months').format('YYYY-MM');
  let isDisabled = !moment(nowAdd).isAfter(moment(month));
  // 当前时间小于月结时间的当前月最后两天 不能月结  now <month最后两个不能月结
  // 当前时间早于月结时间的当前月最后两天 不能月结  now isBefore month最后两个不能月结
  // 月结时间的当前月减去两天
  // const monthEndTime = moment(moment(month).format('YYYY-MM-DD')).endOf('month').subtract(2, 'days').format('YYYY-MM-DD');
  const monthEndTime = moment(moment(month).format('YYYY-MM-DD')).endOf('month').subtract(1, 'days').format('YYYY-MM-DD');
  // const monthEndTime = moment().endOf('month').format('YYYY-MM-DD');
  // console.warn("月结时间的当前月减去两天",monthEndTime);
  // console.warn("当前月的最后一天",monthEndTime,"减两天");
  // let isEndDisabled = moment(monthEndTime).isAfter(moment('2017-11-29'));
  let isEndDisabled = moment(now).isBefore(moment(monthEndTime));
  // let isEndDisabled = !moment('2017-12-29').isBefore(moment(monthEndTime));
  // let isEndDisabled = moment('2017-11-29').isBefore(moment('2017-11-29'));
  // console.log("当前时间",now,"小于月结时间的当前月最后两天",monthEndTime,isEndDisabled,"月结时间大于当前时间加一个月不能月结",isDisabled);
  let isHasTitle="";
  let isGoTime=moment(nowLast).isAfter(moment(now));
  let nowTimeOld=moment(moment(now).format('YYYY-MM')).isAfter(moment(month));//当前时间大于月结时间
  let goodsTitle='仓库编号和名称分别为:';
  notChecked && notChecked.map(item=>{
    goodsTitle=goodsTitle+item.depotCode+'-'+item.depotName+'，';
    return goodsTitle;
  })
  if(nowTimeOld&&(!isCheck)){
      isHasTitle=<div style={{ maxWidth: 260 }}>{`当前时间是${now},您并未盘点的${goodsTitle}确定要月结吗？`}</div>;
  }else if(nowTimeOld&&isCheck){
      isHasTitle=<div>{`当前时间是${now},您已盘点，确定要月结吗？`}</div>;
  }else if (!nowTimeOld&&isGoTime){
    isHasTitle=<div style={{ maxWidth: 260 }}>{`当前时间是${now},未到月末盘点时间，您并未盘点的${goodsTitle}确定要月结吗？`}</div>;
  }else if(!isGoTime&&isCheck){
    isHasTitle=<div>{`您确定要月结吗？`}</div>;
  }else if(!isGoTime&&!isCheck){
    isHasTitle=<div style={{ maxWidth: 260 }}>{`已到月末，您未盘点的${goodsTitle}您确定要月结吗？`}</div>;
  }

  const storeOptions = storeList.map(store => <Option value={store.id} key={store.id}>{store.name}</Option>);
  return (
    <div className="components-search">
      <Breadcrumb separator=">">
        <Breadcrumb.Item>供应链</Breadcrumb.Item>
        <Breadcrumb.Item>集团总部管理</Breadcrumb.Item>
        <Breadcrumb.Item>总部月结</Breadcrumb.Item>
      </Breadcrumb>

      <div className="shop-select">
        <Form inline >
          <Form.Item label="机构名称">
            {getFieldDecorator('shopName', {
              initialValue: shopId || '请选择机构',
            })(
              <Select
                style={{ width: 160 }}
                onChange={changeStore}
              >
                {storeOptions}
              </Select>
            )}
          </Form.Item>
        </Form>

        {shopId && <div className="right-act">
          <div>
            {isDisabled && <div className="scm-month-end-search-span-all" ><span>警告！</span><span>当前{moment(month).subtract(1, 'months').format('MM')}月份已月结，不能重复月结</span></div>}
            {(!isDisabled && isEndDisabled) && <div className="scm-month-end-search-span-all" ><span>警告！</span><span>当前时间{now}，小于月结时间{monthEndTime}(月末两天)，不能月结</span></div>}
          </div>
          <div style={{ float: 'right' }} >
            {month && <Tag color="#87d068">月结开始时间：{month}</Tag>}

            {monthNext && <Tag color="#2db7f5">结转至时间：{monthNext}</Tag>}
            { menuData['list'].hasOwnProperty('61500701') &&  <Tooltip placement="bottom" title="月末最后两天及之后才可以月结">
              <Popconfirm width="100" title={isHasTitle} onConfirm={onMonthEndChange} onCancel={cancel} okText="确定" cancelText="取消">
                <Button type="primary" disabled={isDisabled || isEndDisabled} >月结</Button>
              </Popconfirm>
            </Tooltip>}
          </div>
        </div>}

      </div>
    </div>

  )
}

search.propTypes = {
  storeList: PropTypes.array,
  shopId: PropTypes.string,
  changeStore: PropTypes.func,
  onMonthEndChange:PropTypes.func,
  changeMonthEnd:PropTypes.func,
  selectStore: PropTypes.func,
}
export default Form.create()(search)
