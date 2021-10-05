<template>

		

	
  <el-carousel :interval="0" type="card" height="700px" indicator-position="none">
	<!-- 走马灯 -->
	<el-carousel-item v-for="item in newsList1" :key="item.key" >
		<div v-html="item.title"></div>
		<div v-html="item.text"></div>
	</el-carousel-item>


	  
    </el-carousel>
</template>

<script>
import marked from 'marked'

export default {
	data(){
		return{
			//歇后语列表
			newsList:[],
			newsList1:[],
			isCollect:true,
			articleDetail: [],
			readmeContent:'',
			text:'<h1>hello</h1>',
			text1:'<h1>hello</h1>'

		}
	},
	computed:{
			},
	created() {
		this.getNewsList();
	},
	mounted() {
		
	},
	methods:{
		//获取歇后语
		async getNewsList(){
			const{data: res} = await this.$http.get("/news/findAllNews")
			console.log(res)
			if(res.code == 8888) {
				this.newsList = res.datas;
				//md解析
				for(var i = 0;i<this.newsList.length;i++){
					this.newsList1.push({key:'',text:'',title:''});
					this.newsList1[i].key  = i;
					this.newsList1[i].text  = marked(this.newsList[i].text, { });
					this.newsList1[i].title  = marked("# "+this.newsList[i].title, { });
				}
					
				console.log(this.newsList);
				console.log(this.newsList1);
				this.text = this.newsList1[3];
				console.log(this.text);
			}else
				return this.$message.error('获取新闻列表失败!')
		},

		
	}




}
</script>

<style scoped>
	
	/* 禁用文本框选择*/
	{  
		  -webkit-touch-callout:none;  /*系统默认菜单被禁用*/   
		  -webkit-user-select:none; /*webkit浏览器*/   
		  -khtml-user-select:none; /*早期浏览器*/   
		  -moz-user-select:none;/*火狐*/   
		  -ms-user-select:none; /*IE10*/   
		  user-select:none;   
	}
	
	.el-carousel__item{
		padding: 20px 20px 0px 20px;
		width: 80%;
		left: -15%;
	}

	
	.el-carousel__item h3 {
		color: #475669;
		font-size: 36px;
		opacity: 0.75;
		line-height: 200px;
		margin: 0;
		position: absolute;
		top: 15%;
		left: 15%;
	}

	.el-carousel__item h4 {
		color: #475669;
		font-size: 20px;
		opacity: 0.75;
		line-height: 200px;
		margin: 0;
		position: absolute;
		top: 40%;
		left: 60%;
	}

	
	.el-carousel__item:nth-child(2n) {
		background-color: #b3c6df;
	}

	.el-carousel__item:nth-child(2n-1) {
		background-color: #d3dce6;
	}
</style>
