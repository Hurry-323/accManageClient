<template>
	<div>
		<!-- 面包屑导航区域 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item :to="{ path: '/home'}">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>账户管理</el-breadcrumb-item>
		  <el-breadcrumb-item>账户列表</el-breadcrumb-item>
		</el-breadcrumb>
		
		<!-- 卡片视图区域 -->
		<el-card >
<!-- 		  搜索与添加区域
 -->		<el-row :gutter="10">
				<el-col :span="8">
					<el-input placeholder="请输入内容" v-model="input" clearable @clear="getUserList">
						<el-button slot="append" icon="el-icon-search" @click="search()"></el-button>
					</el-input>
				</el-col>
				<el-col :span="4">
					<el-button type="primary" @click="addDialogVisible=true">开户</el-button>  
				</el-col>
			</el-row>
		  
	  <!-- 用户列表区域  隔行变色 -->
			<el-table :data="accountList.slice((currentPage-1)*pagesize,currentPage*pagesize)" :model="accountList" border stripe>
	  		  
			  <el-table-column type="index" label="#"></el-table-column>
			  <el-table-column label="账户名" prop="accountId"></el-table-column>
	  		  <el-table-column label="余额" prop="balance"></el-table-column>
	  		  <el-table-column label="状态" prop="statusId">
				  
				<template slot-scope="status">
				  <!-- 显示激活状态-->
				  <el-switch
					style="display: block"
					v-model="status.row.statusId"
					active-color="#13ce66"
					inactive-color="#ff4949"
					active-text="激活"
					inactive-text="冻结"
					active-value="1"
					inactive-value="0"
					@change="switchStatus($event,status.row,status.$index)"
					>
				  </el-switch>
				</template>
			  </el-table-column>
	  		  <el-table-column label="操作" width="180px">
	  			  <template slot-scope="scope">
					  <!-- 显示更多信息-->
					  <el-button type="primary" icon="el-icon-edit" size="mini" @click="infoDialog(scope.row.accountId)"></el-button>
					  
	  				 
	  				  <!-- 删除按钮 -->
	  				  <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.accountId)"></el-button>
	  			  </template>
	  		  </el-table-column>
			</el-table>
			
			<!-- 用户信息对话框 -->
			<el-dialog
			  title="用户信息"
			  :visible.sync="infoDialogVisible"
			  width="50%"
			  custom-class="dialog">
			  <el-form :model="infoForm" ref="infoFormRef" label-width="90px" >
			  <el-form-item label="用户序号" prop="personId">
			      <el-input v-model="infoForm.personId" readonly></el-input>
			  </el-form-item>
			  <el-form-item label="真实姓名" prop="realName">
			      <el-input v-model="infoForm.realName" readonly></el-input>
			  </el-form-item>
			  <el-form-item label="性别" prop="sex">
			      <el-input v-model="infoForm.sex" readonly></el-input>
			  </el-form-item>
			  <el-form-item label="出生日期" prop="birthday" :formatter="formatDate">
			      <el-input v-model="infoForm.birthday" readonly></el-input>
			  </el-form-item>
			  <el-form-item label="省份" prop="address">
			      <el-input v-model="infoForm.address" readonly></el-input>
			  </el-form-item>
			  <el-form-item label="邮箱" prop="mail">
			      <el-input v-model="infoForm.mail" readonly></el-input>
			  </el-form-item>
			  <el-form-item label="电话号码" prop="introduce">
			      <el-input v-model="infoForm.telephone" readonly></el-input>
			 </el-form-item>
			  <el-form-item label="身份证号码" prop="roleName">
				  <el-input v-model="infoForm.cardId" readonly></el-input>
			  </el-form-item>
			  </el-form>
			</el-dialog>
			
			<el-dialog
			  title="添加用户"
			  :visible.sync="addDialogVisible"
			  width="50%"
			  custom-class="dialog">
			
				<el-form ref="registerFormRef"  :rules="registerFormRules" :model="registerForm"
					label-width="0px" class="register_form">
					<!-- 账户名 -->
					<el-form-item prop="accountId">
						<el-input prefix-icon="el-icon-user" v-model="registerForm.accountId" placeholder="用户名"></el-input>
					</el-form-item>
					<!-- 真实姓名 -->
					<el-form-item prop="realName">
						<el-input  prefix-icon="el-icon-user-solid" v-model="registerForm.realName" placeholder="真实姓名"></el-input>
					</el-form-item>
					<!-- 密码 -->
					<el-form-item prop="password">
						<el-input type="password" prefix-icon="el-icon-lock" v-model="registerForm.password" placeholder="密码"></el-input>
					</el-form-item>
					<!-- 确认密码 -->
					<el-form-item prop="checkPassword">
						<el-input type="password" prefix-icon="el-icon-lock" v-model="checkPassword" placeholder="确认密码"></el-input>
					</el-form-item>
					<!-- 电子邮件 -->
					<el-form-item prop="mail" >
						<el-input type="email" prefix-icon="el-icon-message" 
						v-model="registerForm.mail" placeholder="电子邮件"></el-input>
					</el-form-item>
					<!-- 生日 -->
					<el-form-item prop="birthday">
						<el-input type="date"  prefix-icon="el-icon-date" 
						v-model="registerForm.birthday" placeholder="生日"></el-input>
					</el-form-item>
					<!-- 手机号码-->
					<el-form-item prop="telephone">
						<el-input  prefix-icon="el-icon-mobile" v-model="registerForm.telephone" placeholder="手机号码"></el-input>
					</el-form-item>
					<!-- 身份证 -->
					<el-form-item prop="cardId">
						<el-input  prefix-icon="el-icon-postcard" v-model="registerForm.cardId" placeholder="身份证"></el-input>
					</el-form-item>
				
					<!-- 来自省 -->
					<el-form-item prop="address">
						<el-select v-model="registerForm.address" placeholder="来自的省份">
							<el-option
							  v-for="item in provinces"
							  :key="item.id"
							  :label="item.province"
							  :value="item.province">
							</el-option>
						</el-select>
					</el-form-item>
					<!-- 性别 -->
					<el-form-item prop="sex">
						<el-radio v-model="registerForm.sex" label="男">男</el-radio>
						<el-radio v-model="registerForm.sex" label="女">女</el-radio>
					</el-form-item>
					<!-- 按钮 -->
					<el-form-item class="btns">
						<el-button type="primary" @click="register">开户</el-button>
						<el-button type="info" @click="resetregisterForm">重置</el-button>
					</el-form-item>
				</el-form>
			</el-dialog>
			
			
			
			
			<!-- 分页区域 -->
			<el-pagination
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				:current-page="currentPage"
				:page-sizes="[1,2,3,4,5,10,15]"
				:page-size="pagesize"
				layout="total, sizes, prev, pager, next, jumper"
				:total="total">
			</el-pagination>
	  </el-card>
		
		
	</div>
</template>
 
<script>
export default{
	data() {
		//验证两次密码是否一致
		var checkPass = (rule, value, callback) => {
			if (this.checkPassword === '') {
				callback(new Error('请再次输入密码'));
			} else if (this.checkPassword!== this.registerForm.password) {
				callback(new Error('两次输入密码不一致!'));
			} else {
				callback();
			}
		};
		return{
		    queryInfo:'',
			userName:window.sessionStorage.getItem("userName"),
			input:'',
			currentPage: 1,//初始页
			pagesize: 10,//每页的数据
			userlist:[],
			total: 0,
			addDialogVisible:false,  //控制添加用户对话框的显示与隐藏
			accountList:[],
			roleNames: [{
			          value: '管理员',
			          label: '管理员'
			        }, {
			          value: '普通用户',
			          label: '普通用户'
			        },
			],
			sexs: [{
			          value: '男',
			          label: '1'
			        }, {
			          value: '女',
			          label: '2'
			        },
			],
			value: '',
			  
			
			//控制修改用户对话框的显示与隐藏
			infoDialogVisible:false,
			//省份信息
			provinces: [
			],
			infoForm:{},
			
			dataIndex:'',
			// 这是登录表单的数据绑定
			registerForm: {
				password: '',
				sex:'男',//性别默认为男
			},
			checkPassword:'',
			regTime:'',
			// 这是表单验证对象
			registerFormRules: {
				// 验证用户名是否合法
				accountId: [{
						required: true,
						message: '请输入用户名',
						trigger: 'blur'
					},
					{
						min: 2,
						max: 5,
						message: '长度在 2 到 5 个字符',
						trigger: 'blur'
					}
				],
				//验证真实姓名是否合法
				realName: [{
						required: true,
						message: '请输入真实姓名',
						trigger: 'blur'
					},
					{
						min: 2,
						max: 10,
						message: '长度在 2 到 10 个字符',
						trigger: 'blur'
					},
					{
						pattern: /^[\u4E00-\u9FA5]+$/,  //正则
						message: '真实姓名只能为中文',
						trigger: 'blur'
					}
				],
				// 验证密码是否合法
				password: [{
						required: true,
						message: '请输入密码',
						trigger: 'blur'
					},
					{
						min: 6,
						max: 15,
						message: '长度在 6 到 15 个字符',
						trigger: 'blur'
					}
				],
				//验证邮箱是否合法
				mail: [{
						required: true,
						message: '请输入电子邮箱',
						trigger: 'blur'
					},
					{
						min: 3,
						max: 40,
						message: '长度在 3 到 40 个字符',
						trigger: 'blur'
					},
					{
						type: 'email',
						message: '请输入正确的的邮箱格式',
						trigger: 'blur'
					}
				],
				//验证生日是否合法
				birthday: [{
						required: true,
						message: '请选择生日',
						trigger: 'blur'
					}
				],
				//验证省份是否合法
				address: [{
						required: true,
						message: '请选择省份',
						trigger: 'blur'
					}
				],
				// 验证身份证是否合法
				cardId: [{
						required: true,
						message: '请输入身份证',
						trigger: 'blur'
					},
					{
						min: 18,
						max: 18,
						message: '长度应为18个字符',
						trigger: 'blur'
					},
					{
						pattern:/^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,//正则
						message: '身份证格式不正确',
						trigger: 'blur'
					}
				],
				//验证重复密码是否一致
				checkPassword: [{
						required: true, 
						validator: checkPass, 
						trigger: 'blur' ,
					}
				],
				//验证手机号是否合法
				telephone: [{
						required: true,
						message: '请输入手机号',
						trigger: 'blur'
					},
					{
						min: 11,
						max: 11,
						message: '请输入11位手机号',
						trigger: 'blur'
					}
				],
			},
			//省份信息
			provinces: [
			],
			value: '',
			readonly: true,
			
		  } 
		},
		created() {
			this.getUserList();
			this.getProvinceList();
		},
		methods:{
			async getUserList (){
				this.userlist = [];
				//获取后端用户数据
				const { data: res } = await this.$http.get('/account/findAccountsByStatusId', {params: {statusId: "0"}})
				//打印后台的返回值
				console.log(res);
				
				this.accountList = res.datas;
			},
			//动态获取省份名
			async getProvinceList () {
				const { data: res } = await this.$http.get('/province/getProvinces', {
				    params: this.queryInfo
				})
				//打印后台的返回值
				//console.log(res)
				if(res.length == 0) return this.$message.error('获取省份列表失败!')
				else this.provinces = res;
				console.log(this.provinces);
			},
			async search(){
				/* 根据用户名和关键字得到模糊查询的数据 */
				const { data: res } = await this.$http.get('/account/findAccountsByKey', {params: {key: this.input}})
				this.accountList = res.datas
				// console.log(this.input);
			},
				
				
			
			//监听 pagesize改变的事件
			handleSizeChange(newSize) {
				this.pagesize = newSize;
				console.log(`每页 ${newSize} 条`);
			},
			
			//监听 页码值 改变事件
			handleCurrentChange(newPage) {
				this.currentPage = newPage;
				console.log(`当前页: ${newPage}`);	
			},
			
			//监听添加用户对话框的关闭事件  重置
			infoDialog(accountId){
				// this.$refs.addFormRef.resetFields();
				// this.infoDialogVisible = this.infoDialogVisible == true?false:true;
				console.log(accountId);
				this.getPersonInfo(accountId);
				this.infoDialogVisible = true;
			},
			
			//调用数据进行修改
			eidtUser(){
				console.log(this.editForm)
				this.$refs.editFormRef.validate(async valid => {
					// 验证有误 退出
					if (!valid) return false
					const {
						data: msg
					} = await this.$http.post('/User/updateUserByUserName', this.editForm)
					if (msg == 0) {
						// 修改失败
						this.$message.error('更改失败')
					} else {
						// 修改成功
						this.$message.success('修改成功')
						this.getUserList()
					}
				
				})
				this.editDialogVisible = false
				this.getUserList()
			},
			
			//展示编辑用户对话框
			showEditDialog(index,sc){
				/* this.dataIndex = sc.$index;
				this.editForm = this.userlist[this.dataIndex]
				this.editForm.state = 1;
				console.log(this.userlist[this.dataIndex])
				this.editDialogVisible = true */
			},
			
			//删除
			async removeUserById(accountId){
				//console.log(sc);
				const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
					  confirmButtonText: '确定',
					  cancelButtonText: '取消',
					  type: 'warning'
					}).then(async() => {
						const { data: res } = await this.$http.get('/account/delAccount', {
						params:{accountId:accountId}});
						console.log(res);
						if(res.code === 8888){
							this.$message.success("删除成功")
							this.getUserList();
						};
					}).catch(() => {
					  this.$message({
						type: 'info',
						message: '已取消删除'
					});          
				});	
			},
			async switchStatus (value,row,index) {
			  if(value === '1') value = '0';
			  else value = '1';
			  
			  var accountId = window.sessionStorage.getItem('accountId');
			  //this.accountList[index].statusId = value == 1? "0":"1";
			  const {
			  	data: msg
			  } = await this.$http.get('/account/switchStatusId', {
						params:{accountId:this.accountList[index].accountId, statusId:this.accountList[index].statusId}})
			  console.log("变化后",value,index, row);
			  this.getUserList();
			},
			formatDate(date1) {
				let date = new Date(parseInt(date1));
				let Y = date.getFullYear() + '-';
				let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) + '-' : date.getMonth() + 1 + '-';
				let D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
				return Y + M + D;
			},
			register() {
				this.$refs.registerFormRef.validate(async valid => {
					// 验证有误 退出
					if (!valid) return false
					// 验证成功 发送请求
					//console.log(this.registerForm)
					// this.$message.info('注册中，请稍后...')
					const {
						data: res
					} = await this.$http.post('/account/register', this.registerForm)
					console.log(res);
					if(res.code ==8888){
						//登陆成功
						this.$message.success(res.msg);
						this.getUserList();
						//跳转登录
						return this.addDialogVisible = false;
					}else
						this.$message.error(res.msg);
				})
			},			
			// 点击按钮重置表单
			resetregisterForm() {
				this.$refs.registerFormRef.resetFields()
			},			
			async getPersonInfo(accountId){			
				//var accountId = this.infoForm.accountId;
				const {data : res} = await this.$http.get("/personInfo/findPersonInfoByAccountId",{params: {accountId: accountId}});
				//打印后台返回的数据
				//console.log(res);
				//判断是否成功
				if(res.code == '8888'){
					
					this.infoForm = res.data.personInfo;
					//格式化时间
					let date = new Date(parseInt(res.data.personInfo.birthday));
					let Y = date.getFullYear() + '-';
					let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) + '-' : date.getMonth() + 1 + '-';
					let D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate();
					
					this.infoForm.birthday = `${Y}${M}${D}`;
					//return this.$message.success(res.msg);
				}
			}
			
		}
	}
</script>

<style>
	.dialog {
	  border-radius: 20px;
	  -webkit-touch-callout:none;  /*系统默认菜单被禁用*/
	  -webkit-user-select:none; /*webkit浏览器*/   
	  -khtml-user-select:none; /*早期浏览器*/   
	  -moz-user-select:none;/*火狐*/   
	  -ms-user-select:none; /*IE10*/   
	  user-select:none;   
	}
	.btns{
		align: right;
		text-align: right;
	}

</style>