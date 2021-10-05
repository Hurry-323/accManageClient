<template>
  <el-container>
    <!-- 头部区域 -->
    <el-header>
      <div>
<!--       <img src="../assets/" alt />
 -->        <span>资金账户管理系统</span>
      </div>
      <el-button type="" @click="logout">注销</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!-- 侧边菜单区域 -->
        <el-menu
          background-color="#abbed4"
          text-color="#fff"
          active-text-color="#639de5"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <div class="toggle-button" @click="toggleCollapse">|||</div>
          <!-- 一级菜单 -->
          <el-submenu :index="item.path + ''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState('/' + subItem.path)"
            >
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data () {
    return {
      // 左侧菜单数据
			menuList:[],
			//普通用户菜单
				menuList0: [
				{
					"id": 103,
					"authName": "资金管理",
					"path": "deposit",
					"children": [
						{
								"id": 110,
								"authName": "存款",
								"path": "deposit",
								"children": [],
								"order": null
						},
						{
								"id": 105,
								"authName": "取款",
								"path": "withdraw",
								"children": [],
								"order": 1
						},
						{
								"id": 107,
								"authName": "转账",
								"path": "transfer",
								"children": [],
								"order": 1
						}
					],
					"order": 1
				},
				{
					"id": 125,
					"authName": "账户管理",
					"path": "personInfo",
					"children": [
						{
								"id": 111,
								"authName": "个人信息",
								"path": "personInfo",
								"children": [],
								"order": null
						},
						{
								"id": 112,
								"authName": "修改密码",
								"path": "editPassword",
								"children": [],
								"order": null
						}
					],
					"order": 2
				},
				{
					"id": 101,
					"authName": "交易管理",
					"path": "records",
					"children": [
						{
								"id": 104,
								"authName": "交易记录",
								"path": "records",
								"children": [],
								"order": 1
						},
						/* {
								"id": 106,
								"authName": "交易统计",
								"path": "hot",
								"children": [],
								"order": 1
						} */
					],
						"order": 3
				},	
			],
			//管理员菜单
			menuList2:[
				{
				"id": 101,
				"authName": "账户管理",
				"path": "accountList",
				"children": [
					{
						"id": 104,
						"authName": "所有账户",
						"path": "accountList",
						"children": [],
						"order": 1
					},
					{
						"id": 106,
						"authName": "已启动账户",
						"path": "unfrozenList",
						"children": [],
						"order": 1
					},
					{
						"id": 108,
						"authName": "已冻结账户",
						"path": "frozenList",
						"children": [],
						"order": 1
					}
			
				],
			},
				{
					"id": 125,
					"authName": "用户管理",
					"path": "editAdminPassword",
					"children": [
						{
							"id": 115,
							"authName": "修改密码",
							"path": "editAdminPassword",
							"children": [],
							"order": 1
						}
					],
					"order": 1
				},
				{
					"id": 135,
					"authName": "新闻管理",
					"path": "newsList",
					"children": [
						{
							"id": 136,
							"authName": "新闻列表",
							"path": "newsList",
							"children": [],
							"order": 1
						},
						{
							"id": 137,
							"authName": "新增新闻",
							"path": "addNews",
							"children": [],
							"order": 1
						}
					],
					"order": 1
				},
			],
			
			iconObj: {
					125: 'icon iconfont icon-user',
					103: 'icon iconfont icon-tijikongjian',
					101: 'icon iconfont icon-shangpin',
					102: 'icon iconfont icon-danju',
					145: 'icon iconfont icon-baobiao',
					135: 'icon iconfont icon-danju',
			},
      // 侧边栏是否折叠
      isCollapse: false,
      // 当前激活菜单的路径
      activePath: '',
	  userName:'',
	  rolename:'',
	}
  },
  created () {
	this.rolename = window.sessionStorage.getItem('role')
    this.getMenuList()
	this.userName = window.sessionStorage.getItem('userName')
    this.activePath = window.sessionStorage.getItem('activePath')
	//this.consoleall();
  },
  methods: {
    // 退出系统
		
		logout () {
      // 清除token
	  /* sessionStorage.removeItem("userName");
	  sessionStorage.removeItem("isAuthenticated");
	  sessionStorage.removeItem("activePath"); */
      window.sessionStorage.clear()
      // 跳转首页
      this.$router.push('/login')
    },
    // 获取侧边栏数据
    getMenuList () {
			/* var optUserName = window.sessionStorage.getItem('userName');
			console.log(optUserName);
      const { data: res } = await this.$http.get('/User/isAdmin',{params:{userName:optUserName}}); */
      // 管理员
      if (this.rolename === '1') this.menuList = this.menuList2;
      // 普通用户
      else this.menuList = this.menuList0;
    },
    // 切换折叠侧边栏
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    // 保存导航状态
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = window.sessionStorage.getItem('activePath')
    },
	//打印windowsession
	/* consoleall(){
		console.log(window.sessionStorage.getItem('userName'));
		console.log(window.sessionStorage.getItem('isAuthenticated'));
	} */
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
}
.el-header {
  background-color: #b3c6df;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  > div {
    display: flex;
    align-items: center;
    font-size: 20px;
    span {
      margin-left: 15px;
    }
  }
}
.el-main {
  background-color: #eaedf1;
}
.el-aside {
  background-color: #b3c6df;
  .el-menu {
    border-right: 0;
    .toggle-button {
      background-color: #bcd0ea;
      color: #fff;
      font-size: 10px;
      line-height: 24px;
      text-align: center;
      letter-spacing: 0.2em;
      cursor: pointer;
    }
  }
}
.iconfont {
  margin-right: 10px;
}
</style>
