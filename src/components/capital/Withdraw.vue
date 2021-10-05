<template>
<div>
	<!-- 面包屑导航区域 -->
	<el-breadcrumb separator-class="el-icon-arrow-right">
		<el-breadcrumb-item :to="{path: '/home'}">首页</el-breadcrumb-item>
		<el-breadcrumb-item>资金管理</el-breadcrumb-item>
		<el-breadcrumb-item>取款</el-breadcrumb-item>
	</el-breadcrumb>
	<!-- 卡片视图 -->
	<el-card>
		<el-form ref="withdrawFormRef"  :model="withdrawForm" :rules="withdrawFormRules" 
		label-width="0px" class="withdraw_form">
			<el-form-item prop="accountId">
				<el-input v-model="withdrawForm.accountId" prefix-icon="el-icon-user-solid" 
				disabled></el-input>
			</el-form-item>
			<!-- 时间 -->
			<el-form-item prop="Time">
				<el-input :value="time" prefix-icon="el-icon-time" disabled></el-input>
			</el-form-item>
			<!-- 取款金额 -->
			<el-form-item prop="money">
				<el-input v-model="withdrawForm.money" prefix-icon="el-icon-s-order" 
				placeholder="请输入取款金额"></el-input>
			</el-form-item>
			<!-- 按钮 -->
			<el-form-item class="btns">
				<el-button type="primary" @click="withdraw">提交</el-button>
			</el-form-item>
		</el-form> 
	</el-card>

</div>
</template>

<script>
	export default{
		data() {
			return {
				withdrawForm:{
					accountId:'',//账户名
					money:''//取款金额
				},
				withdrawFormRules:{
					//验证取款金额是否合法
					money:[
						{ required: true, message: '请输入取款金额', trigger: 'blur' },
						{ min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
					],
				},
				time:''
			}
		
		},
		mounted(){
			//初始化获取参数
			this.init0();
		},
		created(){
			
		},
		//清除定时器
		beforeDestroy: function() {
		    if (this.formatDate) {
		          clearInterval(this.formatDate); // 在Vue实例销毁前，清除时间定时器
		    }
		},
		methods:{
			//提交存款请求
			withdraw(){
				this.$refs.withdrawFormRef.validate(async valid => {
					if(!valid) return;
					console.log(this.withdrawForm);
					const {data : res} = await this.$http.post("/account/withdraw",this.withdrawForm);
					//打印后台返回的数据
					console.log(res);
					//判断是否成功
					if(res.code == '8888'){
						return this.$message.success(res.msg+"取款金额为"+res.data);
					}else if(res.code =='1005'){
						return this.$message.error(res.msg+"您的余额为"+res.data);
					}else
						return this.$message.error('取款失败');
				});
			},
			//初始化
			init0(){
				//用户名
				this.withdrawForm.accountId = window.sessionStorage.getItem('accountId');	
				//时间
				setInterval(this.formatDate,500);
			},
			//格式化时间
			formatDate() {
				let date = new Date();
				let year = date.getFullYear(); // 年
				let month = date.getMonth() + 1; // 月
				let day = date.getDate(); // 日
				let hour = date.getHours(); // 时
				hour = hour < 10 ? "0" + hour : hour; // 如果只有一位，则前面补零
				let minute = date.getMinutes(); // 分
				minute = minute < 10 ? "0" + minute : minute; // 如果只有一位，则前面补零
				let second = date.getSeconds(); // 秒
				second = second < 10 ? "0" + second : second; // 如果只有一位，则前面补零
				let sssz = date.get
				this.time = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
			},
			
		}
	
	}
</script>

<style scoped="scoped">
</style>
