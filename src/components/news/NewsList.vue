<template>
	<div>
		<!-- 面包屑导航区域 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{path: '/home'}">首页</el-breadcrumb-item>
			<el-breadcrumb-item :to="{path: '/newsList'}">新闻管理</el-breadcrumb-item>
			<el-breadcrumb-item>新闻列表</el-breadcrumb-item>
		</el-breadcrumb>
		<br />
		<!-- 卡片试图区 -->
		<el-card>
			<el-row type="flex" justify="space-between">
				<el-col :span="4">
					<el-button type="primary" @click="addNews()" >添加新闻</el-button>
				</el-col>
			</el-row>
			
			<!-- 新闻列表数据 -->
			<el-table :data="newsList.slice((currentPage-1)*pagesize,currentPage*pagesize)" border stripe>
				<el-table-column type="index"></el-table-column>
				<el-table-column label="标题" prop="title"></el-table-column>
				<el-table-column label="概要" prop="newsAbstract"></el-table-column>
				<el-table-column label="时间" prop="releaseDate" :formatter="formatDate"></el-table-column>
				<el-table-column label="操作" width="180px"> 
					<template slot-scope="scope">
						<el-button type="primary" icon="el-icon-edit" size="mini" @click="updateNews(scope)" ></el-button>
						<el-button type="danger" icon="el-icon-delete" size="mini"  @click="removeNewsById(scope)"></el-button>
					</template>
				</el-table-column>
			</el-table>
			
			<!-- 分页区域 -->
			<el-pagination
			      @size-change="handleSizeChange"
			      @current-change="handleCurrentChange"
			      :current-page="currentPage"
			      :page-sizes="[10,20,30]"
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
				username:"",
				total: null,
				newsList: [],
				answer:[],
				currentPage: 1,//初始页
				pagesize: 10,//每页的数据			
				dataIndex:'',
				ruleForm: {
					question:'',
					content:'',
					answer:'',
					releaseDate:'',
				},
			}
		},
		created(){
			this.getNewsList();
		},
		methods:{
			formatDate(row, column) {
				let date = new Date(parseInt(row.releaseDate));
				let Y = date.getFullYear() + '-';
				let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) + '-' : date.getMonth() + 1 + '-';
				let D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
				return Y + M + D ;
			},
			async getNewsList(){
				const{data: res} = await this.$http.get("/news/findAllNews")
				this.accountId = window.sessionStorage.getItem("accountId")
				console.log(res)
				this.newsList = res.datas
			},
			handleSizeChange(val) {
				this.pagesize = val;
				console.log(`每页 ${val} 条`);
			},
			handleCurrentChange(val) {
				this.currentPage = val;
				console.log(`当前页: ${val}`);
			},
			async removeNewsById(sc){
				console.log(sc.$Index+(this.currentPage-1)*this.pagesize);
				console.log(sc.row.id);
				const confirmResult = await this.$confirm(
				'是否永久删除？',
				'提示',
				{
				 confirmButtonText:'确定',
				 cancelbuttonText:'取消',
				 type:'warning'
				}
				).catch(err=>err)
				//如果用户确认删除，则返回值为字符串confirm
				//如果用户取消看删除，则返回值为字符串cancel
				console.log(confirmResult)
				if(confirmResult!=='confirm'){
					return this.$message.info('已经取消删除')
				}
				const {data: res} = await this.$http.get("/news/delNewsById", {params: {id: sc.row.id}})
				console.log(res) 
				if(res.code === 8888){
					/* this.reload() */
					this.getNewsList();
					return this.$message.success('删除成功！');
				}else
					return this.$message.info('删除失败！');
			},
			updateNews(sc){
				var newsId = sc.row.id;
				console.log(sc.row.id);
				window.sessionStorage.setItem("newsId",newsId)
				return this.$router.push('/editNews')
			},
			addNews(){
				return this.$router.push('/addNews')
			}
		}
	}
	
	
</script>

<style scoped>
</style>
