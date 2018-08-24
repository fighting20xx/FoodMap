
import elm from '@/page/elm'
//const indexMap = require('../page/indexMap/indexMap');    这种方式的也可以，   可能下面的是按需加载把
const foodmap = r => require.ensure([], () => r(require('@/page/indexMap/indexMap')), 'foodmap');



export default [{
  path: '/foodmap',
  component: foodmap, //顶层路由，对应index.html
}]
