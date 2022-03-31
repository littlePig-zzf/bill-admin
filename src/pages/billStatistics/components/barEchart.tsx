import ReactECharts from 'echarts-for-react';
import { Empty } from 'antd';
import _ from 'lodash';
import styles from '../index.less';

type PropsShape = {
  title: string;
  xAxis: any[];
  seriesData: any[];
};

export default function BarEchart(props: PropsShape) {
  const { title, xAxis, seriesData } = props
  const options = { // echart 配置
    title: {
      // text: title,
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b} : {c}元',
    },
    xAxis: [
      {
        type: 'category',
        data: xAxis,
        axisTick: {
          alignWithLabel: true
        }
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: '支出',
        type: 'bar',
        radius: '55%',
        center: ['50%', '60%'],
        data: seriesData,
        label: {
          show: true,
          formatter: '{c}'
        },
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  };

  return (
    <div className={styles['echart-cont']}>
      <h3>{title}</h3>
      {
        seriesData?.length > 0 ?
          <ReactECharts option={options} style={{ height: 400 }} />
          : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      }
    </div>
  )
}