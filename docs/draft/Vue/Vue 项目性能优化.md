# 项目性能优化

## webpack 打包优化

通过 webpack-bundle-analyzer 发现 element-ui、babel-profill、lodash、jquery、moment这几个库打包之后的体积过大，会影响首屏的加载速度。

### element-ui

elment-ui 之前引入了整个库，打包体积过大，采用按需加载进行优化，部分常用组件注册为全局组件，其它的在组件中单独引入。

### moment

默认情况下，moment 会将语言包和核心功能一起打包，打包之后体积非常大，可以使用以下两种方式处理。

1. 可以使用 IgnorePlugin 插件在打包时忽略语言包，减少打包之后的体积。

   ```js
   // 需要加载某些语言时，手动引入即可
   import('moment/locale/ja')
   
   // webpack 配置
   plugins: [
     // Ignore all locale files of moment.js
     new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
   ]
   
   
   ```

2. 使用轻量级的日期库 [dayjs](https://github.com/iamkun/dayjs) 或者 [date-fns](https://github.com/date-fns/date-fns) 替换 moment.js

```js
// 推荐使用 dayjs，因为它和 moment.js API一致
yarn add  dayjs

yarn add date-fns
```

### lodash、jquery

使用 CDN 引入

```js
<script src="https://cdn.bootcss.com/jquery/3.4.1/jquery.slim.min.js"></script>
<script src="https://cdn.bootcss.com/lodash.js/4.17.15/lodash.min.js"></script>
```

### echarts

按需引入 echarts 和 echarts组件

```js
// 引入需要使用的的组件
import echarts  from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/toolbox'
```

封装配置文件

```js
module.exports = {
  lineOptions: function (options) {
    return {
      color: [
        '#facc14',
        '#2fc25b',
        '#1890ff'
      ],
      title: options.title,
      tooltip: {
        trigger: 'axis'
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      legend: {
        data: options.legendData,
        x: 'center',
        y: 25,
      },
      grid: {
        left: '3%',
        right: '3%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: '#999'
            }
          },
          data: options.xAxisData
        }
      ],
      yAxis: [
        {
          type: 'value',
          min: options.yAxisMin,
          axisLine: {
            lineStyle: {
              color: '#999'
            }
          }
        }
      ],
      series: options.seriesData
    }
  },
  
  barOptions: function (options) {
    return {
      color: [
        '#18cfae',
        '#1b3c70',
        '#678bb2',
        '#82d8cf',
        '#7f8993',
        '#ccd4df',
        '#99c0dd'
      ],
      title: options.title,
      tooltip: {
        trigger: 'axis',
        axisPointer: {   // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      legend: {
        data: options.legendData,
        x: 'center',
        y: 25,
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      grid: {
        left: '0%',
        right: '0%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: options.xAxisData,
          axisTick: {
            alignWithLabel: true
          },
          axisLine: {
            lineStyle: {
              color: '#999'
            }
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#999'
            }
          }
        }
      ],
      series: options.seriesData
    }
  },

  pieOptions: function (options) {
    return {
      title: options.title,
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      legend: {
        type: options.legendType,
        left: 10,
        top: 20,
        data: options.legendData
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      series: options.seriesData
    }
  }
}

```

