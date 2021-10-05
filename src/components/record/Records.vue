<template>
	<div>
		<!-- 面包屑导航区域 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{path: '/home'}">首页</el-breadcrumb-item>
			<el-breadcrumb-item>交易管理</el-breadcrumb-item>
			<el-breadcrumb-item>交易记录</el-breadcrumb-item>
		</el-breadcrumb>
		
		<!-- 卡片视图区 -->
		<el-card>
			<el-row>
				<el-col :span="8">
					<el-input v-model="input" placeholder="请输入内容" >
					    <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
				    </el-input>
				</el-col>
			</el-row>
			<el-table :data="recordList.slice((currentPage-1)*pagesize,currentPage*pagesize)" border stripe >
				<el-table-column type="index"></el-table-column>
				<el-table-column label="帐户名" prop="accountId"></el-table-column>
				<el-table-column label="交易对象名" prop="otherId"></el-table-column>
				<el-table-column label="金额" prop="money"></el-table-column>
				<el-table-column label="时间" prop="dateTime" :formatter="formatDate"></el-table-column>
				<el-table-column label="种类" prop="typeId" :formatter="typeIdFormat" column-key="typeId"
				:filters="typeFilter" :filter-method="filterTag"  filter-placement="right-start"></el-table-column>
			</el-table>
			
			<!-- 分页区域 -->
			<el-pagination
			      @size-change="handleSizeChange"
			      @current-change="handleCurrentChange"
			      :current-page="currentPage"
			      :page-sizes="[5,10,15]"
			      :page-size="pagesize"
			      layout="total, sizes, prev, pager, next, jumper"
			      :total="total">
			</el-pagination>
		</el-card>
		
	</div>
</template>

<script>
	export default {
		data(){
			return{
				queryInfo:{
					query:''
				},
				total: null,
				recordList: [],
				answer:[],
				accountId: '',
				input: '',
				currentPage: 1,//初始页
				pagesize: 10,//每页的数据
				radio1: '全部',//默认展示全部
				typeFilter:[
					{ text: '存款', value: '0' }, 
					{ text: '取款', value: '1' }, 
					{ text: '转账', value: '2' },
				]
			}
		},
		created(){
			//加载列表
			this.getRecordsList()
		},
		methods:{
			//时间格式化
			formatDate(row, column) {
				let date = new Date(row.dateTime);
				let Y = date.getFullYear() + '-';	
				let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) + '-' : date.getMonth() + 1 + '-';
				let D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
				let h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':';
				let m = date.getMinutes()  < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':';
				let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
				return Y + M + D + h + m + s;
			},
			//获取记录
			async getRecordsList(){
				this.accountId = window.sessionStorage.getItem("accountId")
				// 从记录表里获取数据
				const { data: res } = await this.$http.get('/record/findAllRecordsByAccountId', {params: {accountId: this.accountId}})
				//打印后端返回值
				console.log(res)
				//赋值
				this.recordList = res.datas	
			},
			//搜索方法
			async search(){
				/* 根据用户名和关键字得到模糊查询的数据 */
				const { data: res } = await this.$http.get('/record/findRecordsByKey', {params: {accountId: this.accountId, key: this.input}})
				console.log(this.res)
				this.recordList = res.datas
				
			},
			//中文显示交易类型
			typeIdFormat(row, column) {
			    if (row.typeId === '0') {
					return '存款'
			    } else if(row.typeId === '1'){
					return '取款'
			    } else if(row.typeId === '2'){
					return '转账'
				}
			  },
			handleSizeChange(val) {
				this.pagesize = val;
				console.log(`每页 ${val} 条`);
			},
			handleCurrentChange(val) {
				this.currentPage = val;
				console.log(`当前页: ${val}`);
			},
			//type筛选器
			filterTag(value,row) {
				//console.log(row.typeId);
				// 一般用两个参数就可以，分别是filters筛选出来的value和每一行row
			  return row.typeId === value;  // 把具体哪个字段跟筛选的值去比较，然后返回
			}
		}
	}
	
</script>

<style scoped>
</style>