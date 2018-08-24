
import elm from '@/page/elm'
//const indexMap = require('../page/indexMap/indexMap');    这种方式的也可以，   可能下面的是按需加载把
const caseFlex = r => require.ensure([], () => r(require('@/page/kanban/case-flex')), 'case-flex');



export default [{
  path: '/kanban',
  redirect:'/kanban/caseFlex',
  children: [ //二级路由。对应App.vue
    //首页城市列表页
    {
      path: 'caseFlex',
      title:'预案管理',
      name:'kanban_caseFlex',
      component: caseFlex
    },
  ]

}]
