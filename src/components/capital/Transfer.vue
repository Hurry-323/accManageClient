<template>
<div>
	<!-- 面包屑导航区域 -->
	<el-breadcrumb separator-class="el-icon-arrow-right">
		<el-breadcrumb-item :to="{path: '/home'}">首页</el-breadcrumb-item>
		<el-breadcrumb-item>资金管理</el-breadcrumb-item>
		<el-breadcrumb-item>转账</el-breadcrumb-item>
	</el-breadcrumb>
	<el-row :gutter="20">
		<el-col :span="12">
			<!-- 卡片视图 -->
			<el-card class="el-card">
				<!-- 用户表单 -->
				<el-form ref="transferFormRef"  :model="transferForm" :rules="transferFormRules" 
				label-width="0px" class="transfer_form">
					<el-form-item prop="accountId">
						<el-input v-model="transferForm.accountId" prefix-icon="el-icon-user-solid" 
						disabled></el-input>
					</el-form-item>
					<!-- 时间 -->
					<el-form-item prop="Time">
						<el-input :value="time" prefix-icon="el-icon-time" disabled></el-input>
					</el-form-item>
					<!-- 取款金额 -->
					<el-form-item prop="money">
						<el-input v-model="transferForm.money" prefix-icon="el-icon-s-order" 
						placeholder="请输入转账金额"></el-input>
					</el-form-item>
					<!-- 按钮 -->
					<!-- <el-form-item class="btns">
						<el-button type="primary" @click="transfer">提交</el-button>
					</el-form-item> -->
				</el-form> 
			</el-card>
		</el-col>
		<el-col :span="12">
			<el-card class="el-card">
				<!-- 目标表单 -->
				<el-form ref="transferFormRef"  :model="transferForm" :rules="transferFormRules"
				label-width="0px" class="transfer_form">
					<el-form-item prop="otherId">
						<el-input v-model="transferForm.otherId" prefix-icon="el-icon-user-solid" 
						placeholder="请输入对方的用户名"></el-input>
					</el-form-item>
					<!-- 取款金额 -->
					<el-form-item prop="money">
						<el-input v-model="transferForm.confirmMoney" prefix-icon="el-icon-s-order" 
						placeholder="确认转账金额"></el-input>
					</el-form-item>
					<!-- 按钮 -->
					<el-form-item class="btns" style="">
						<el-button type="primary" @click="transfer">提交</el-button>
					</el-form-item>
				</el-form> 
			</el-card>
		</el-col>

	</el-row>
	
	
</div>
</template>

<script>
	export default{
		data() {
			var checkMoney = (rule, value, callback) => {
				if (this.confirmMoney === '') {
					callback(new Error('请再次输入转账金额'));
				} else if (this.confirmMoney!== this.transferForm.Money) {
					callback(new Error('两次转账金额不一致!'));
				} else {
					callback();
				}
			};
			return {
				transferForm:{
					accountId:'',//账户名
					orderNum:'',//订单号
					otherId:'',
					money:'',
					confirmMoney:''
				},
				transferFormRules:{
					//验证订单号是否合法
					accountId:[
						{ required: true, message: '请输入账户Id', trigger: 'blur' },
						{ min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
					],
					otherId:[
						{ required: true, message: '请输入目标账户Id', trigger: 'blur' },
						{ min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
					],
					money:[
						{ required: true, message: '请输入转账金额', trigger: 'blur' },
						{ min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
					],
					confirmMoney:[
						{ required: true,validator: checkMoney ,trigger: 'blur'}
					]
				},
				time:'',
			};
		
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
			transfer(){
				this.$refs.transferFormRef.validate(async valid => {
					if(!valid) return;
					console.log(this.transferForm);
					const {data : res} = await this.$http.post("/account/transfer",this.transferForm);
					//打印后台返回的数据
					console.log(res);
					//判断是否成功
					if(res.code == '8888'){
						return this.$message.success(res.msg+"转账金额为"+res.data);
					}else
						return this.$message.error(res.msg);
				});
			},
			//初始化
			init0(){
				//用户名
				this.transferForm.accountId = window.sessionStorage.getItem('accountId');	
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
	.el-card{
		padding: 50px 20px;
		height: 200px;
	}
	
</style>
