
import App from '@/App'
// const caseFlex = require('@/page/kanban/case-flex');   // 这种方式的也可以，   可能下面的是按需加载把
const caseFlex = r => require.ensure([], () => r(require('@/page/kanban/case-flex')), 'case-flex');
const caseContainer = r => require.ensure([], () => r(require('@/page/kanban/caseContainer')), 'caseContainer');


export default [{
  path: '/kanban',
  redirect:'/kanban/caseFlex',
  component: App, //顶层路由，对应index.html
  children: [
    {
      path: 'caseFlex',
      title:'预案管理',
      name:'kanban_caseFlex',
      component: caseFlex
    },
    {
      path: '/kanban-preview/:id',
      name: 'kanban-preview',
      meta: {                                               //给路由的meta添加  skipFilter=true 字段，那么 这个路由将会跳过过滤器， 从而跳过单点登陆
        skipFilter: true,
      },
      component: caseContainer
    }
  ]

}]
