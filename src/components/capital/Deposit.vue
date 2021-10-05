<template>
<!-- 面包屑导航区域 -->
<div>
	<el-breadcrumb separator-class="el-icon-arrow-right">
		<el-breadcrumb-item :to="{path: '/home'}">首页</el-breadcrumb-item>
		<el-breadcrumb-item>资金管理</el-breadcrumb-item>
		<el-breadcrumb-item>存款</el-breadcrumb-item>
	</el-breadcrumb>
	<!-- 卡片视图 -->
	<el-card>
		<el-form ref="depositFormRef"  :model="depositForm" :rules="depositFormRules" label-width="0px" class="deposit_form">
			<el-form-item prop="accountId">
				<el-input v-model="depositForm.accountId" prefix-icon="el-icon-user-solid" 
				 disabled></el-input>
			</el-form-item>
			<!-- 时间 -->
			<el-form-item prop="Time">
				<el-input :value="time" prefix-icon="el-icon-time" disabled></el-input>
			</el-form-item>
			<!-- 订单号 -->
			<el-form-item prop="orderNum">
				<el-input v-model="depositForm.orderNum" prefix-icon="el-icon-s-order" 
				placeholder="请输入支付宝订单号"></el-input>
			</el-form-item>
			<!-- 按钮 -->
			<el-form-item class="btns">
				<el-button type="primary" @click="deposit">提交</el-button>
			</el-form-item>
		</el-form> 
	</el-card>

</div>
</template>

<script>
	export default{
		data() {
			return {
				depositForm:{
					accountId:'',//账户名
					orderNum:''//订单号
				},
				depositFormRules:{
					//验证订单号是否合法
					accountId:[
						{ required: true, message: '请输入订单号', trigger: 'blur' },
						{ min: 2, max: 10, message: '长度在 2 到 20 个字符', trigger: 'blur' }
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
			deposit(){
				this.$refs.depositFormRef.validate(async valid => {
					if(!valid) return;
					console.log(this.depositForm);
					const {data : res} = await this.$http.post("/account/deposit",this.depositForm);
					//打印后台返回的数据
					console.log(res);
					//判断是否成功
					if(res.code == '8888'){
						return this.$message.success(res.msg+"存款金额为"+res.data);
					}
					return this.$message.error('订单号不存在');
				});
			},
			//初始化
			init0(){
				//用户名
				this.depositForm.accountId = window.sessionStorage.getItem('accountId');	
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
