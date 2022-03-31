import styles from './index.less';
import { getBill, getBillCategory } from './services';
import SearchForm from './components/searchForm';
import moment from 'moment';
import { produce } from 'immer';
import { useState, useEffect } from 'react';
import _ from 'lodash';
import BarEcharts from './components/barEchart';

let originXaxis: any[] = [];
let originSumArr: number[] = [];
let originSeriesData: any[] = [];
export default function BillStatistics() {
  const [list, setList] = useState<any[]>([]);
  const [category, setCategory] = useState<Record<string, any>>({});
  const [xAxis, setXaxis] = useState<any[]>([]);
  const [seriesData, setSeriesData] = useState<any[]>([]);
  const [sumArr, setSum] = useState<any[]>([]);

  const getCategory = async () => {
    const category = await getBillCategory();
    let arr: Record<string, any> = {};
    category.forEach((item: Record<string, any>) => {
      arr[item.id] = item?.name;
    })
    setCategory(arr);
    return arr;
  }
  const getList = async () => {
    let category = await getCategory();
    let res = await getBill();
    res = res.map((item: Record<string, any>) => {
      const month = moment(parseInt(item.time)).format('YYYY/MM');
      item.month = month;
      return item;
    })
    setList(res);
    res = _.groupBy(res, 'type');
    Object.values(res).forEach((item: any, index) => {
      handleData(item, category, index, true);
    })
  };
  const sum = (arr: any[]) => {
    return arr.reduce(function (acr, cur) {
      return acr + cur;
    }, 0);
  }
  const handleData = (res: any[], category: Record<string, any>, type: number, init?: boolean) => {
    let _data: Record<string, any> = {};
    res.forEach((item: Record<string, any>) => {
      const _category = category[item.category];
      if (_data[_category]) {
        _data[_category] += Number(item.amount)
      } else {
        _data[_category] = Number(item.amount)
      }
      return item;
    })
    const _sum = sum(Object.values(_data))
    setSum(produce((draft) => {
      draft[type] = _sum
    }))

    const sortable = handleSort(_data)

    let _xAxis: number[] = [];
    let _seriesData: string[] = [];
    sortable.forEach(item => {
      _xAxis.push(item[0]);
      _seriesData.push(item[1]);
    })

    setSeriesData(produce((draft) => {
      draft[type] = _seriesData;
    }))
    setXaxis(produce((draft) => {
      draft[type] = _xAxis;
    }))
    if (init) {
      originSumArr[type] = _sum;
      originSeriesData[type] = _seriesData;
      originXaxis[type] = _xAxis;
    }
  }

  const handleSort = (_data: Record<string, any>) => {
    let sortable = [];
    for (let vehicle in _data) {
      sortable.push([vehicle, _data[vehicle]]);
    }
    sortable.sort(function (a, b) {
      return a[1] - b[1];
    });
    return sortable
  }

  const onSearch = (params: Record<string, any>) => {
    if (Object.keys(params).length) {
      let res: any = list.filter((item) => {
        for (let key in params) {
          if (item[key] === undefined || item[key] != params[key]
          ) {
            return false;
          }
        }
        return true;
      })
      res = Object.assign({ 0: [], 1: [] }, _.groupBy(res, 'type'));
      Object.values(res).forEach((item: any, index) => {
        handleData(item, category, index);
      })
    } else {
      setSeriesData(originSeriesData)
      setXaxis(originXaxis)
      setSum(originSumArr)
    }
  }
  useEffect(() => {
    getList();
    return () => {
      originSeriesData = []
      originSumArr = []
      originXaxis = []
    }
  }, [])
  return (
    <div className={styles['echart-wrap']}>
      <SearchForm onSearch={onSearch}></SearchForm>
      <BarEcharts title='收入支出总金额统计' xAxis={['支出', '收入']} seriesData={sumArr}></BarEcharts>
      <BarEcharts title='支出明细统计' xAxis={xAxis[0]} seriesData={seriesData[0]}></BarEcharts>
      <BarEcharts title='收入明细统计' xAxis={xAxis[1]} seriesData={seriesData[1]}></BarEcharts>
    </div >
  )
}