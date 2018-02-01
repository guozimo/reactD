import React, { PropTypes } from 'react'
import { Table, Popconfirm, Pagination } from 'antd'
import { PieChart, Pie, Legend, Cell, Tooltip, ResponsiveContainer, Sector } from 'recharts';
import { scaleOrdinal, schemeCategory10 } from 'd3-scale';
import { changeNumberOfData } from '../../../utils';

const colors = scaleOrdinal(schemeCategory10).range();

function list({
  menuData,
  loading,
  dataSource,
  onPageChange,
  onPageSizeChange,
  loopCharts,
  shopId,
}) {

  //构造图表数据
  const chartList = [];
  loopCharts = (data) => {
      chartList.push({ name: '物料成本', value: data[0].goodsAmt > 0 ? data[0].goodsAmt :0 });
      chartList.push({ name: '水', value: data[0].waterCnt > 0 ? data[0].waterCnt :0 });
      chartList.push({ name: '电', value: data[0].electricCnt > 0 ? data[0].electricCnt : 0 });
      chartList.push({ name: '气', value: data[0].gasCnt > 0 ? data[0].gasCnt : 0 });
      chartList.push({ name: '利润', value: data[0].rateCnt >0 ? data[0].rateCnt :0 });
  };

  if(dataSource.length > 0){
    loopCharts(dataSource);
  }
  //判断是否要绘图
  const dataChart = [];
  const loopData = (data) => {
    dataChart.push(data.goodsAmt);
    dataChart.push(data.waterCnt);
    dataChart.push(data.electricCnt);
    dataChart.push(data.gasCnt);
    dataChart.push(data.rateCnt);
  };
  if(dataSource.length > 0){
    loopData(dataSource[0]);
  }

  let isChart = false;
  const checkChart = (data) =>{
    for(let item of data) {
      if( item > 0){
        isChart = true;
      }
    }
  }
  checkChart(dataChart);

  //标签函数
  const renderLabelContent = (props) => {
    const { value, percent, x, y, midAngle } = props;
    return (
      <g transform={`translate(${x}, ${y})`} textAnchor={ (midAngle < -90 || midAngle >= 90) ? 'end' : 'start'}>
        <text x={0} y={0}>{`¥ ${value}`}</text>
        <text x={0} y={20}>{`(比率: ${(percent * 100).toFixed(2)}%)`}</text>
      </g>
    );
  };

  const columns = [
    {
      title: '应收额',
      dataIndex: 'dishAmt',
      key: 'dishAmt',
    }, {
      title: '物料成本',
      dataIndex: 'goodsAmt',
      key: 'goodsAmt',
    }, {
      title: '混合成本',
      children: [ {
      title: '水',
      dataIndex: 'waterCnt',
      key: 'waterCnt',
    }, {
      title: '电',
      dataIndex: 'electricCnt',
      key: 'electricCnt',
    }, {
      title: '气',
      dataIndex: 'gasCnt',
      key: 'gasCnt ',
    }
    ]},{
      title: '利润',
      dataIndex: 'rateCnt',
      key: 'rateCnt',
    },{
      title: '利润率',
      dataIndex: 'rate',
      key: 'rate',
    },
  ];

  return (
    <div className="components-list">
      {shopId && <Table size="small"
             className="table"
             bordered
             columns={columns}
             dataSource={dataSource}
             loading={loading}
             onChange={onPageChange}
             onShowSizeChange={onPageSizeChange}
             pagination={false}
             rowKey={record => record.id}
      />}
      {isChart && <div className="pie-chart">
        <PieChart width={800} height={300}>
          <Legend />
            <Pie  cy={140} startAngle={180} endAngle={-180} innerRadius={0} outerRadius={80} label={renderLabelContent}>
              {
                chartList.map((entry, index) => (
                  <Cell key={`slice-${index}`} name={entry.name} value={entry.value} fill={colors[index % 10]}/>
                ))
              }
            </Pie>
        </PieChart>
      </div>}
      {!shopId && <div className="page-no-shop icon-mg-t"></div>}
    </div>
  )
}

list.propTypes = {
  onPageChange: PropTypes.func,
  dataSource: PropTypes.array,
  loading: PropTypes.bool,
  onPageSizeChange: PropTypes.func,
  loopCharts: PropTypes.func,
  shopId: PropTypes.string,
};

export default list
