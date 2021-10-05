import Vue from 'vue'
import VueRouter from 'vue-router'

import login from '../components/Login.vue'
/* import Register from '../components/Register.vue' */
//存款页
const Deposit = () => import('../components/capital/Deposit.vue')
//取款页
const Withdraw = () => import('../components/capital/Withdraw.vue')
//转账页
const Transfer = () => import('../components/capital/Transfer.vue')
//交易记录页
const Records = () => import('../components/record/Records.vue')
//主页框架页
const Home = () => import('../components/Home.vue')
// import Welcome from '../components/Welcome.vue'
const Welcome = () => import('../components/Welcome.vue')
//用户信息页
const PersonInfo = () => import('../components/account/PersonInfo.vue')
//修改密码页
const EditPassword = () => import('../components/account/EditPassword.vue')
//编辑新闻页
const EditNews = () => import('../components/news/EditNews.vue')
//用户列表
const AccountList = () => import('../components/account/AccountList.vue')
//冻结列表
const FrozenList = () => import('../components/account/FrozenList.vue')
//启用列表
const UnFrozenList = () => import('../components/account/UnFrozenList.vue')
//管理员密码设置
const EditAdminPassword = () => import('../components/account/EditAdminPassword.vue')
//新闻列表
const NewsList = () => import('../components/news/NewsList.vue')
//新增新闻
const AddNews = () => import('../components/news/AddNews.vue')



// 发布模式下不需要
// 解决elementUI导航栏中的vue-router在3.0下重复点击报错的问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [{
		path: '/welcome',
		component: Welcome
    },{
		path:'/deposit',
		component:Deposit
	},{
		path:'/withdraw',
		component:Withdraw
	},{
		path:'/transfer',
		component:Transfer
	},{
		path:'/records',
		component:Records
	},{
		path:'/personInfo',
		component:PersonInfo
	},{
		path:'/editPassword',
		component:EditPassword
	},{
		path:'/editNews',
		component:EditNews
	},{
		path: '/accountList', 
		component: AccountList ,
	},{
		path: '/frozenList', 
		component: FrozenList ,
	},{
		path: '/unfrozenList', 
		component: UnFrozenList ,
	},{
		path: '/editAdminPassword', 
		component: EditAdminPassword ,
	},{
		path: '/newsList', 
		component: NewsList ,
	},{
		path: '/addNews', 
		component: AddNews ,
	},
	]
  }
]

const router = new VueRouter({
	mode: 'history',
	routes
})

// 挂载路由导航守卫(不允许不登陆使用网页)
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是个函数 代表放行
  //return next()  放行  next('/login') 强制跳转
  // 登录页面放行
  if (to.path === '/login') return next()
  //注册页面放行
  // if (to.path === '/register') return next()
  // 获取 userName
  const isAuthenticated = window.sessionStorage.getItem('isAuthenticated')
  
  if (!isAuthenticated) return next('/login')
  
  next()
})

export default router
