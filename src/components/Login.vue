<template>
	<div class="login_container">
		<div class="login_box">
			<!-- 头像区域 -->
			<div class="avatar_box">
				<img src="../assets/tx.jpg"/>
			</div>
			<!-- 登录表单区域 -->
			<el-form ref="loginFormRef" @keyup.enter.native="login" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
				<!-- 用户名 -->
				<el-form-item prop="accountId">
					<el-input v-model="loginForm.accountId" prefix-icon="el-icon-user"></el-input>
				</el-form-item>
				<!-- 密码 -->
				<el-form-item prop="password">
					<el-input type="password"  v-model="loginForm.password" prefix-icon="el-icon-lock"></el-input>
				</el-form-item>
				<!-- 按钮 -->
				<el-form-item class="btns">
					<el-button type="primary" @click="login">登录</el-button>
					<el-button type="info" @click="resetloginForm">重置</el-button>
					<!-- <el-button type="success" @click="register">注册</el-button> -->
				</el-form-item>
			</el-form>  
		</div>
	</div>
</template>

<script>
	export default {
		data(){
			return{
				//这是登录表单的数据绑定对象
				loginForm:{
					accountId:'',
					password:'',
				},
				//表单验证规则对象
				loginFormRules:{
					//验证用户名是否合法
					accountId:[
						{ required: true, message: '请输入用户名称', trigger: 'blur' },
						{ min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
					],
					//验证密码是否合法
					password:[
						{ required: true, message: '请输入用户密码', trigger: 'blur' },
						{ min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' }
					]
				}
			};
		},
		methods:{
			//点击重置按钮，重置登录表单
			resetloginForm(){
				this.$refs.loginFormRef.resetFields();
			},
			//登录方法
			login(){
				this.$refs.loginFormRef.validate(async valid => {
					if(!valid) return;
					const {data : res} = await this.$http.post("/account/login",this.loginForm);
					//打印后台返回的数据
					console.log(res);
					console.log(res.data);
					if(res.code == '8888'){
						window.sessionStorage.setItem('accountId',res.data.accountId);
						window.sessionStorage.setItem('isAuthenticated','true');
						window.sessionStorage.setItem('role','0');
						this.$message.success("登录成功，正在跳转...");
						return this.$router.push('/home');	
					}else if(res.code == '6666'){
						window.sessionStorage.setItem('accountId',res.data.accountId);
						window.sessionStorage.setItem('isAuthenticated','true');
						window.sessionStorage.setItem('role','1');
						this.$message.success("管理员登录成功，正在跳转...");
						return this.$router.push('/home');	
					}
					return this.$message.error('用户名或密码输入错误');
				});
			},
			//注册方法
			/* register(){
				this.$message.info("跳转注册页面...");
				return this.$router.push("/register");
			} */
		},
	}
</script>

<style scoped>
	
	.login_container{
		/* background-color: #2b4b6b; */
		background-color: #303030;
		background-color: ghostwhite;
		background-image: url(../assets/1.png);
		/* background-image: url(../assets/gy.jpg); */
		/* background-size: 100% 100%; */
		 height: 100%;
	}
	.login_box{
		width: 450px;
		height: 300px;
		background-color: #fff;
		border: 3px;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%,-50%);
		border-radius: 12px;
	}
	.avatar_box{
		height: 130px;
		width: 130px;
		border: 1px solid #eee;
		border-radius: 50%;
		padding: 10px;
		box-shadow: 0 0 10px #ddd;
		position: absolute;
		left: 50%;
		transform: translate(-50%,-50%);
		background-color: #fff;
	}
	.avatar_box img{
		width: 100%;
		height: 100%;
		border-radius: 50%;
		background-color: #eee;
	}
	.btns{
		display: flex;
		justify-content: flex-end;
		
	}
	.login_form{
		position: absolute;
		bottom: 0;
		width: 100%;
		padding: 0 20px;
		box-sizing: border-box;
	}
	.el-button--primary {
	    color: #fff;
	    background-color: #409EFF;
	    border-color: #409EFF;
	}
</style>
