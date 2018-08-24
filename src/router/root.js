/**
 * Created by fight on 2018/8/24.
 */

import App from '@/App';
const indexMap = r => require.ensure([], () => r(require('@/page/indexMap/indexMap')), 'indexMap');

import elmRouter from './apps/elmRouter'
import foodMapRouter from './apps/foodMapRouter'
import kanbanRouter from './apps/kanbanRouter.js'


const root = [
  {
    path: '/',
    redirect:'/kanban'
  },
  ...elmRouter,
  ...foodMapRouter,
  ...kanbanRouter,

  { path: '/*', title: 'error-404', name: 'error-404'}
];


export default root
