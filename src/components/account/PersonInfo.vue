<template>
<div>
	<!-- 面包屑导航区域 -->
	<el-breadcrumb separator-class="el-icon-arrow-right">
	<el-breadcrumb-item :to="{path: '/home'}">首页</el-breadcrumb-item>
	<el-breadcrumb-item>账户管理</el-breadcrumb-item>
	<el-breadcrumb-item>个人信息</el-breadcrumb-item>
	</el-breadcrumb>
	<!-- 卡片视图 -->
	<el-card>
		
		
		
		<!-- account -->
		<el-form ref="accountFormRef"  :model="accountForm"
		label-width="0px" class="account_form">
			<!-- 账户名 -->
			<el-form-item prop="accountId">
				<el-input v-model="accountForm.accountId" prefix-icon="el-icon-user-solid" 
				 disabled></el-input>
			</el-form-item>
			<!-- 账户余额 -->
			<el-form-item prop="balance">
				<el-input v-model="accountForm.balance" prefix-icon="el-icon-s-finance" 
				 disabled></el-input>
			</el-form-item>
		</el-form>
		
		<!-- info -->
		<el-form ref="infoFormRef"  :model="infoForm" :rules="infoFormRules" label-width="0px" class="info_form">
			
			<!-- 真实姓名 -->
			<el-form-item prop="realName">
				<el-input v-model="infoForm.realName" prefix-icon="el-icon-user" 
				:disabled="notEdit"></el-input>
			</el-form-item>
			<!-- 生日 -->
			<el-form-item prop="birthday">
				<el-input type="date"  prefix-icon="el-icon-date" 
				v-model="infoForm.birthday" placeholder="生日" :disabled="notEdit"
				></el-input>
			</el-form-item>
			<!-- 手机号 -->
			<el-form-item prop="telephone">
				<el-input v-model="infoForm.telephone" prefix-icon="el-icon-mobile" 
				placeholder="请输入手机号" :disabled="notEdit"></el-input>
			</el-form-item>
			<!-- 身份证 -->
			<el-form-item prop="cardId">
				<el-input v-model="infoForm.cardId" prefix-icon="el-icon-postcard" 
				placeholder="请输入身份证号" :disabled="notEdit"></el-input>
			</el-form-item>
			<!-- 电子邮件 -->
			<el-form-item prop="mail" >
				<el-input type="email" prefix-icon="el-icon-message" 
				v-model="infoForm.mail" placeholder="电子邮件" :disabled="notEdit"></el-input>
			</el-form-item>
			<!-- 来自省 -->
			<el-form-item prop="address">
				<el-select v-model="infoForm.address" placeholder="来自的省份" :disabled="notEdit">
				    <el-option
				      v-for="item in provinces"
				      :key="item.province"
				      :label="item.province"
				      :value="item.province">
				    </el-option>
				</el-select>
			</el-form-item>
			<!-- 性别 -->
			<el-form-item prop="sex" >
				<el-radio v-model="infoForm.sex" label="男" :disabled="notEdit">男</el-radio>
				<el-radio v-model="infoForm.sex" label="女" :disabled="notEdit">女</el-radio>
			</el-form-item>
			<!-- 按钮 -->
			<el-form-item class="btns" >
				<el-button type="primary" @click="edit" :style="{ display: showButton }">修改</el-button>
				<el-button type="primary" @click="edit" :style="{ display: showSubmit }">取消修改</el-button>
				<el-button type="primary" @click="info" :style="{ display: showSubmit }">提交</el-button>
			</el-form-item>
		</el-form> 
	</el-card>

</div>
</template>

<script>
	export default{
		data() {
			return {
				accountForm:{
					accountId:'',//账户名
					balance:''//账户余额
				},
				infoForm:{

				},
				showSubmit:'none',
				showButton:'',
				notEdit:true,
				provinces:{},
				/* infoFormRules:{} */
				infoFormRules: {
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
					// 验证身份证是否合法
					cardId: [{
							required: true,
							message: '请输入密码',
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
					]
				},
			}
		
		},
		mounted(){
			//初始化获取参数
			this.init0();
		},
		created(){
			//动态获取省份名
			this.getProvinceList();
		},
		methods:{
			//提交修改请求
			info(){
				this.$refs.infoFormRef.validate(async valid => {
					if(!valid) return;
					console.log(this.infoForm);
					const {data : res} = await this.$http.post("/personInfo/editInfo",this.infoForm);
					//打印后台返回的数据
					//console.log(res);
					//判断是否成功
					if(res.code == '8888'){
						this.edit();
						return this.$message.success(res.msg);
					}
					return this.$message.error(res.msg);
				});
			},
			//初始化
			async init0(){
				//用户名
				this.accountForm.accountId = window.sessionStorage.getItem('accountId');
				//var accountId = this.infoForm.accountId;
				console.log(this.accountForm.accountId);
				const {data : res} = await this.$http.get("/personInfo/findPersonInfoByAccountId",{params: {accountId: this.accountForm.accountId}});
				//打印后台返回的数据
				//console.log(res);
				//判断是否成功
				if(res.code == '8888'){
					
					this.accountForm = res.data;
					this.infoForm = res.data.personInfo;
					//格式化时间
					let date = new Date(parseInt(res.data.personInfo.birthday));
					let Y = date.getFullYear() + '-';
					let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) + '-' : date.getMonth() + 1 + '-';
					let D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate();
					
					this.infoForm.birthday = `${Y}${M}${D}`;
					//return this.$message.success(res.msg);
				}
				
			},
			edit(){
				//修改按钮可见状态
				//修改表单编辑状态
				if(this.notEdit){
					this.notEdit = false;
					this.showSubmit = '';
					this.showButton = 'none';
				}else{
					this.showSubmit = 'none';
					this.notEdit = true;
					this.showButton = '';
					this.init0();
				}
				
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
			}
		}
	
	}
</script>

<style scoped="scoped">
</style>
