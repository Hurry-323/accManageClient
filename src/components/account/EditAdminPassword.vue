<template>
<!-- 面包屑导航区域 -->
<div>
	<el-breadcrumb separator-class="el-icon-arrow-right">
	<el-breadcrumb-item :to="{path: '/home'}">首页</el-breadcrumb-item>
	<el-breadcrumb-item>账户管理</el-breadcrumb-item>
	<el-breadcrumb-item>修改密码</el-breadcrumb-item>
	</el-breadcrumb>
	<!-- 卡片视图 -->
	<el-card>
		<el-form ref="editPwdFormRef"  :model="editPwdForm" :rules="editPwdFormRules" label-width="0px" class="editPwd_form">
			<!-- 用户名 -->
			<el-form-item prop="adminName">
				<el-input v-model="editPwdForm.adminName" prefix-icon="el-icon-user-solid" 
				 disabled></el-input>
			</el-form-item>
			<!-- 密码 -->
			<el-form-item prop="adminPassword">
				<el-input v-model="editPwdForm.adminPassword" prefix-icon="el-icon-lock" 
				placeholder="请输入原密码" type="password"></el-input>
			</el-form-item>
			<!-- 密码 -->
			<el-form-item prop="newPassword">
				<el-input v-model="editPwdForm.newPassword" prefix-icon="el-icon-lock" 
				placeholder="请输入新密码" type="password"></el-input>
			</el-form-item>
			<!-- 确认密码 -->
			<el-form-item prop="checkPassword">
				<el-input type="password" prefix-icon="el-icon-lock" 
				v-model="checkPassword" placeholder="确认密码"></el-input>
			</el-form-item>
			<!-- 按钮 -->
			<el-form-item class="btns">
				<el-button type="primary" @click="editPwd">确认修改</el-button>
			</el-form-item>
		</el-form> 
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
				} else if (this.checkPassword!== this.editPwdForm.newPassword) {
					callback(new Error('两次输入密码不一致!'));
				} else if (this.checkPassword== this.editPwdForm.adminPassword) {
					callback(new Error('新密码与原密码一致!'));
				} else {
					callback();
				}
			};
			return {
				editPwdForm:{
					adminName:'',//账户名
				},
				checkPassword:'',
				editPwdFormRules:{
					//验证用户名是否合法
					adminName:[
						{ required: true, message: '请输入订单号', trigger: 'blur' },
						{ min: 2, max: 10, message: '长度在 2 到 20 个字符', trigger: 'blur' }
					],
					// 验证原密码是否合法
					adminPassword: [{
							required: true,
							message: '请输入原密码',
							trigger: 'blur'
						},
						{
							min: 5,
							max: 15,
							message: '长度在 5 到 15 个字符',
							trigger: 'blur'
						}
					],
					// 验证新密码是否合法
					newPassword: [{
							required: true,
							message: '请输入新密码',
							trigger: 'blur'
						},
						{
							min: 6,
							max: 15,
							message: '长度在 6 到 15 个字符',
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
				}
			}
		
		},
		mounted(){
			//初始化获取参数
			this.init0();
		},
		created(){
			
		},
		methods:{
			//提交存款请求
			editPwd(){
				this.$refs.editPwdFormRef.validate(async valid => {
					if(!valid) return;
					console.log(this.editPwdForm);
					const {data : res} = await this.$http.post("/admin/updatePassword",this.editPwdForm);
					//打印后台返回的数据
					console.log(res);
					//判断是否成功
					if(res.code == '8888'){
						this.$message.success(res.msg)
						this.logout();
					}else
						return this.$message.error(res.msg);
				});
			},
			//初始化
			init0(){
				//用户名
				this.editPwdForm.adminName = window.sessionStorage.getItem('accountId');	
			},
			//注销
			logout () {
			  // 清除token
			  window.sessionStorage.clear()
			  // 跳转首页
			  this.$router.push('/login')
			},
		
			
		}
	
	}
</script>

<style scoped="scoped">
</style>
