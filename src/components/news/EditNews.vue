<template>
	<div id="editor">
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{path: '/home'}">首页</el-breadcrumb-item>
			<el-breadcrumb-item :to="{path: '/newsList'}">新闻管理</el-breadcrumb-item>
			<el-breadcrumb-item>编辑新闻</el-breadcrumb-item>
		</el-breadcrumb>
		<el-card>
			<div v-html="compiledMarkdown"></div>
			<el-form ref="editFormRef" :model="editForm" :rules="editFormRules"  label-width="55px">
				<!-- 标题 -->
				<el-form-item prop="title" label="标题">
					<el-input v-model="editForm.title" ></el-input>					 
				</el-form-item>
				<!-- 摘要 -->
				<el-form-item prop="newsAbstract" label="摘要">
					<el-input v-model="editForm.newsAbstract"></el-input>					 
				</el-form-item>
				<!-- 内容 -->
				<el-form-item prop="text" label="内容">
					<el-input type="textarea" v-model="editForm.text" :rows="12"></el-input>
					 
				</el-form-item>
				<!-- 按钮 -->
				<el-form-item class="btns">
					<el-button type="primary" @click="submit">提交</el-button>
				</el-form-item>
			</el-form>
		</el-card>
		<!-- <textarea :value="input" @input="update"></textarea> -->
		
	</div>
</template>

<script>
import lodash from 'lodash'
import marked from 'marked'
export default {
	
	data(){
		return{
			text: "# hello",
			accountId : "",
			editForm:{
				text:"",
			},
			editFormRules:{
				//验证订单号是否合法
				title:[
					{ required: true, message: '标题不能为空', trigger: 'blur' },	
				],
				newsAbstract:[
					{ required: true, message: '概要不能为空', trigger: 'blur' },
				],
				text:[
					{ required: true, message: '内容不能为空', trigger: 'blur' },
				],
			},
		
		}
         
    },
	computed: {
		compiledMarkdown: function() {
			return marked(this.editForm.text, { });
		}
	},
	mounted(){
		//初始化获取参数
		this.init0();
	},
	methods: {
		async init0(){
			//用户名
			this.accountId = window.sessionStorage.getItem('accountId');
			
			var newsId = window.sessionStorage.getItem('newsId');
			//var accountId = this.infoForm.accountId;
			const {data : res} = await this.$http.get("/news/findNewsById",{params:{id: newsId}});
			//打印后台返回的数据
			console.log(res);
			//判断是否成功
			if(res.code == '8888'){
				// this.editForm.id = newsId;
				this.editForm = res.data;
			}
			
		},
		submit(){
			this.$refs.editFormRef.validate(async valid => {
				if(!valid) return;
				console.log(this.editForm);
				const {data : res} = await this.$http.post("/news/updateNewsById",this.editForm);
				//打印后台返回的数据
				console.log(res);
				//判断是否成功
				if(res.code == '8888'){
					return this.$message.success(res.msg);
				}
				return this.$message.error(res.msg);
			});
		},
		
	}
}	
</script>

<style>
	.btns{
		align: right;
		text-align: right;
	}
</style>
