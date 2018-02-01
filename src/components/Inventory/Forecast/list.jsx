import React, { PropTypes } from 'react'
import { Table, Popconfirm, Pagination,Input,DatePicker, Icon, } from 'antd'
import moment from 'moment';
import {color} from '../../../utils/theme'
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts'
const dateFormat = 'YYYY-MM-DD';

function list({
  menuData,
  loading,
  dataSource,
  onEditItem,
  shopId,
  saleList,
  loopCharts,
  getCastDate,
  startDateValue,
  serverTime,
}) {
  const timeNow = serverTime ? moment(serverTime) : moment();
  //获取日期
  getCastDate = ( data ) =>{
    return data[0].forecastDateString;
  };

  let castDate = timeNow.startOf('day').add(-1, 'days').format(dateFormat);

  if(dataSource.length > 0){
     castDate = getCastDate(dataSource);
  }else if(startDateValue){
    castDate = startDateValue;
  }


  const chartList = [];
  loopCharts = (data) => {
    for(let i = 0; i<data.length; i+=1){
      chartList.push({
        营业额: data[i].amt,
        预估值: data[i].amt1,
        dateChart: data[i].forecastDateString,
      })

    }
  };

  loopCharts(saleList);

  const dateForecast = [];
  for( let i = 0; i<7; i +=1 ){
    dateForecast.push(moment(castDate).startOf('day').add(i+1, 'days').format('MM-DD'));
  }


  const columns = [
    {
      title: '营业日期',
      dataIndex: 'forecastDateString',
      key: 'forecastDateString',
    }, {
      title: '天气',
      dataIndex: 'weather',
      key: 'weather',
    }, {
      title: '事件',
      dataIndex: 'eventName',
      key: 'eventName',
    }, {
      title: '营业额',
      dataIndex: 'amt',
      key: 'amt',
    } ,{
      title: '预估值',
      children: [ {
        title: dateForecast[0],
        dataIndex: 'amt1',
        key: 'amt1',
      } , {
        title: dateForecast[1],
        dataIndex: 'amt2',
        key: 'amt2',
      } , {
        title: dateForecast[2],
        dataIndex: 'amt3',
        key: 'amt3',
      }, {
        title: dateForecast[3],
        dataIndex: 'amt4',
        key: 'amt4',
      }, {
        title: dateForecast[4],
        dataIndex: 'amt5',
        key: 'amt5',
      }, {
        title: dateForecast[5],
        dataIndex: 'amt6',
        key: 'amt6',
      }, {
        title: dateForecast[6],
        dataIndex: 'amt7',
        key: 'amt7',
      } , {
        title: '预估值修正',
        dataIndex: 'amtU',
        key: 'amtU',
      }]
  }, {
      title: '备注',
      dataIndex: 'remarks',
      key: 'remarks',
      render: (text, record) => {
        return (
          <span title={text}>{text ? text.substring(0,8) + (text.length > 8 ? '...': '') : ""} </span>
        );
      },
    }, {
      title: '操作',
      key: 'operation',
      width: 100,
      render: (text, record) => {
        return (
          <p>
            { menuData['list'].hasOwnProperty('61700103') && <a onClick={() => onEditItem(record)} style={{
              marginRight: 4,
            }}>编辑</a> }
          </p>
        );
      },
    },
  ]

  return (
    <div className="components-list">
      {shopId && <div className="table-responsive">
      <Table size="small"
             style={{width:1200}}
             bordered
             columns={columns}
             dataSource={dataSource}
             loading={loading}
             pagination={false}
             rowKey={record => record.id}
      />
      </div>}
      {chartList.length > 0 && <div className='sales'>
        <div className='title'>营业预估</div>
        <ResponsiveContainer minHeight={360}>
          <LineChart data={chartList}>
            <Legend verticalAlign="top"
                    content={props => {
                      const { payload } = props
                      return <ul className='legend clearfix'>
                        {payload.map((item,key) => <li key={key}><span className='radiusdot' style={{background:item.color}}></span>{item.value}</li>) }
                      </ul>
                    }}/>
            <XAxis dataKey="dateChart" axisLine={{stroke:color.borderBase,strokeWidth:1}}  tickLine={false}/>
            <YAxis axisLine={false} tickLine={false} />
            <CartesianGrid vertical={false} stroke={color.borderBase} strokeDasharray="3 3" />
            <Tooltip
              wrapperStyle={{border:'none',boxShadow:'4px 4px 40px rgba(0, 0, 0, 0.05)'}}
              content={content => {
                const list = content.payload.map((item,key) => <li key={key} className='tipitem'><span className='radiusdot' style={{background:item.color}}></span>{item.name+':'+item.value}</li>)
                return <div><p className='tiptitle'>{content.label}</p><ul>{list}</ul></div>
              }}/>
            <Line type="monotone" dataKey="营业额" stroke={color.purple} strokeWidth={3} dot={{fill:color.purple}} activeDot={{r: 5,strokeWidth:0}}/>
            <Line type="monotone" dataKey="预估值"  stroke={color.red} strokeWidth={3} dot={{fill:color.red}}  activeDot={{r: 5,strokeWidth:0}}/>
          </LineChart>
        </ResponsiveContainer>
      </div>}
      {!shopId && <div className="page-no-shop icon-mg-t"></div>}
    </div>
  )
}

list.propTypes = {
  dataSource: PropTypes.array,
  loading: PropTypes.bool,
  onEditItem: PropTypes.func,
  shopId: PropTypes.string,
  saleList: PropTypes.array,
  loopCharts: PropTypes.func,
  getCastDate: PropTypes.func,
  startDateValue: PropTypes.string,
  serverTime: PropTypes.string,
}

export default list
