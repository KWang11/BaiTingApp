/*
	知识补充：
		1）获取元素
			querySelector(),
			querySelectorAll(),
			nextElementSibling/previousElementSibling
		2）DOMContentLoaded事件
			跟jquery中的document ready是一样的
		3）获取自定义属性值dataset（是一个对象）
			<div data-idx="20" data-guid="12345678981"></div>
			div.dataset.idx,div.dataset.guid
		4）class类名操作:classList（是一个对象）
			<div class="iconfont icon-play"></div>
			div.classList
		5）遍历数组
			arr.forEach(function(item,idx){});
		6）事件源对象：触发事件的初始对象
			不管事件冒泡到哪个阶段，事件源对象都不会改变
			获取事件源对象：e.target
		7）tagName：获取元素标签名，返回大写字母
		8）scrollIntoView()：把当前元素滚动到可见区域
    
 */
  //通过匿名函数包裹后，定义变量全为局部变量
;(function(){
			
		$(function(){
			// 获取页面元素
			var header = document.querySelector('header');
			var ePlayer = document.querySelector('.player');//播放器
			var eList = document.querySelector('#list_H');//ul
			var btnPlay = ePlayer.querySelector('#btnPlay');//播放按钮
			var btnPrev = ePlayer.querySelector('#btnPrev');//上一曲
			var btnNext = ePlayer.querySelector('#btnNext');//下一曲
			var btnVolume = ePlayer.querySelector('#btnVolume');//声音
			var eTitle = ePlayer.querySelector('h1.title');//歌名及歌手
			var eProgress = ePlayer.querySelector('progress');//进度条
			var eModel = ePlayer.querySelector('.play-model');//播放模式
		
			// 获取下一个/上一个元素节点
			// nextElementSibling/previousElementSibling
			var eAlbum = btnPlay.previousElementSibling;
			var eTime = eProgress.nextElementSibling;
		
		
			// 全局变量
			var playlist = [];
			var index = 0;
			var model = 2;//0:单曲播放,1:单曲循环,2:列表播放,3:列表循环,4:随机播放
			var $special_H=$('#special-H');
		
		
			var player = new Audio();
			console.log(player);
			var ul = document.createElement('ul');
			// 1）ajax加载数据,并写入.list
			$.ajax({
				type:"get",
				url:"http://route.showapi.com/213-4",
				async:true,
				dataType:'json',
				data:{
					showapi_appid:'27101',
					showapi_sign:'abd584e961874c2f8225c7c4f805ec8b',
					topid:26
				},
				success:function(res){
					
					console.log(res);
					
					// ES5数组方法：forEach，用于遍历数组
					res.showapi_res_body.pagebean.songlist.forEach(function(item,idx){
						playlist.push(item);
						 
						var li = document.createElement('li');
						// li.setAttribute('data-idx',idx);
						li.dataset.idx = idx;
						li.innerHTML = (idx+1)+'&nbsp;' + item.singername + ' - ' + item.songname+'<a href='+item.downUrl+' download='+item.songname+'>下载</a>';
		
						ul.appendChild(li);
					});
		
					// 写入页面
					eList.appendChild(ul);
					console.log(playlist);
					player.src = playlist[index].url;
		//			console.log(playlist[index].url);
					
					
					
					//请求歌词
					
				}
			});
		    //添加专辑大图
		    
			//	
		
			// 2）播放/暂停歌曲
			// console.log(btnPlay.classList)
			btnPlay.onclick = function(){
				//如果当前处于暂停状态，就播放
				if(player.paused){
					player.play();
					
				}else{
					player.pause();
					
				}
			}
		
			// 上一曲/下一曲
			btnPrev.onclick = function(){
				index--;
				play();
				title();
		    var musicid=playlist[index].songid;
		    console.log(musicid);
				
			}
			btnNext.onclick = function(){
				index++;
				play();
				title();
			}
		
			btnVolume.onclick = function(){
				player.muted = !player.muted;
				if(player.muted){
					this.classList.add('icon-mute');
				}else{
					this.classList.remove('icon-mute');
				}
			}
		
			// 6）点击进度条改变播放进度
			eProgress.onclick = function(e){
				player.currentTime = (e.offsetX/this.offsetWidth)*player.duration;
			}
		
		
			// 播放时触发
			player.onplay = function(){
				btnPlay.classList.add('icon-pause');
		
				// 图片旋转效果
				eAlbum.classList.add('playing');
				eAlbum.style.animationPlayState = 'running';
		
				// 给当前播放歌曲添加高亮效果
				var li = eList.querySelectorAll('li');
				for(var i=0;i<li.length;i++){
					if(i===index){
						li[i].classList.add('active');
						//li[i].scrollIntoView();
					}else{
						li[i].classList.remove('active');
					}
				}
				
		
//				    title();
			}
			
			function title(){
				
				eTitle.innerHTML="",
				
				  // 改变标题
				eTitle.innerHTML = playlist[index].singername + ' - ' + playlist[index].songname;
		
				// 专辑图片
				eAlbum.src = playlist[index].albumpic_small;
				
		         //在第三页添加专辑大图
				
				
			}
		
			// 暂停时触发
			player.onpause = function(){
				btnPlay.classList.remove('icon-pause');
		
				// 移除图片旋转效果
				// eAlbum.classList.remove('playing');
				eAlbum.style.animationPlayState = 'paused';
			}
		
			// 播放进度改变时触发
			// 播放过程一直触发
			player.ontimeupdate = function(){
				updateTime();
			}
		
			// 歌曲能播放时
			player.oncanplay = function(){
				init();
			}
		
		
			// 4）点击歌曲播放
			// 利用事件委托来实现
			eList.onclick = function(e){
				console.log(11111111);
				console.log(e.target);
				if(e.target.tagName.toLowerCase() === 'li'){
					index = parseInt(e.target.dataset.idx);
					console.log(index);
					play();
					title();
				}
			}
		
			// 8）播放模式
			// 当前歌曲播放完毕后，下一步做什么
			player.onended = function(){
				// 判断播放模式
				// 0:单曲播放,1:单曲循环,2:列表播放,3:列表循环,4:随机播放
				switch(model){
					case 1:
						play();
						break;
					case 2:
						if(index<playlist.length-1){
							index++;
							play();
						}
						break;
					case 3:
						index++;
						play();
						break;
					case 4:
						index = Math.round(Math.random()*playlist.length);
						play();
						break;
				}
			}
			
			// 点击改变播放模式
			eModel.onclick = function(e){
				// 判断是否点击了模式按钮
				if(e.target.classList.contains('iconfont')){
					model = parseInt(e.target.dataset.model);
				}
		
				// 高亮显示播放模式
				var eModels = eModel.children;
				for(var i=0;i<eModels.length;i++){
					eModels[i].classList.remove('active');
				}
				e.target.classList.add('active');
			}
		
			/**
			 * [封装播放方法]
			 * 限定索引值index的范围
			 */
			var $content_gc=$('#content_gc');
			var $list_H=$('#list_H');
			function play(){
				if(index<0){
					index = playlist.length-1;
				}else if(index > playlist.length-1){
					index = 0;
				}
				if(playlist[index].url){
					player.src = playlist[index].url;
					//函数赋值路径后，在只运行一次，则实现播放
					player.play();
//					$content_gc.html("");
				}			
			}
			
			 //歌词搜索，点击播放，封装函数
		     function play_L(){
		     	  
					player.play();
		     }
					
//					$list_H.html("");
				
		 
			// 初始化
			// 改变播放器的初始状态
			// 歌名，图片，播放模式，时间
			function init(){
				// 改变标题
//				eTitle.innerHTML = playlist[index].singername + ' - ' + playlist[index].songname;
		
				// 专辑图片
//				eAlbum.src = playlist[index].albumpic_small;
				// 播放模式
				for(var i=0;i<eModel.children.length;i++){
					if(eModel.children[i].dataset.model == model){
						eModel.children[i].classList.add('active');
					}
				}
		
				// 更新时间
				updateTime();
				
			}
		
			function updateTime(){
				// 时间
				// 剩余总时间
				var leftTime = player.duration - player.currentTime;
		
				// 剩余多少分
				var minLeft = parseInt(leftTime/60);
				var secLeft = parseInt(leftTime%60);
		
				eTime.innerHTML = '-' + minLeft + ':' + (secLeft<10 ? '0' : '') + secLeft;
		
		
				// 进度条
				if(player.currentTime/player.duration*100){
					eProgress.value = player.currentTime/player.duration*100
				}
				
			}
				//回到顶部
				
				var top = $('.top');
				$(window).scroll(function(){
					var scrollTop = $(window).scrollTop();
					if(scrollTop>600){
						top.show();
					}else{
						top.hide();
					}
				})
				top.on('click',function(){
							$('html,body').animate({'scrollTop':0});
						});
						
						
				//获取歌词
				
				
				 
				 
				  
				  var $contentGc=$('.contentGc');
				
				   var name;
				   var $btn=$('#btn_gc');
				   
				  //绑定enter事件 
				 $(document).ready(function(e) {
				$(this).keydown(function (e){
				  if(e.which == "13"){				  	   
				  	/*我的代码*/
					  $contentGc.html("");
			          var contentGc=$('.contentGc');		       
			          var $value=$('#input_gc');
			            name=$value.val();
	//		            console.log(name);
			            console.log("bbb");
			          //如果为空，则enter无效；
				    if(name!=''){	  	
					      success();
					     }
				}
				})
				});  
				   
				   
				   	//点击搜索歌词
				   	
				   $btn.click(function(){
				   	$contentGc.html("");
		          var contentGc=$('.contentGc');		       
		          var $value=$('#input_gc');
		            name=$value.val();
//		            console.log(name);
		            console.log("ccc");
		   	         success();
		   	         		   	        
		   	    })           
		   	        
    
       //封装ajax请求
        function success(){
    	   	  	    $.ajax({
			  	    	type:"get",
			  	    	url:"http://route.showapi.com/213-1",
			  	    	async:true,
			  	    	dataType:'json',
			  	    
			  	    	data:{
			  	    	  showapi_appid:'27481',
			              showapi_sign:'51a147db03e54cb888278fd5a32514d3',
			               keyword:name,			                
			  	    	},
			  	    	success:function(res){
//			  	    		  console.log(res);
                           
                                var searlist=[];
                                var $ul=$('<ul/>');
			  	    		res.showapi_res_body.pagebean.contentlist.forEach(function(item){
//			  	    			    console.log(item);
			  	    			    searlist.push(item);
			  	    			   var $li=$('<li/>');
			  	    			   $li.html(item.songname+' - '+item.singername).appendTo($ul);			  	    			    
			  	    			    
			  	    		})

			  	    		  console.log($ul);
			  	    		  $ul.appendTo('.contentGc');
			  	    		   console.log(searlist);  	  
			  	    		   
			  	    		   //添加歌曲点击事件
			  	    		   
			  	    		     $('.contentGc ul li').click(function(){
				   	         	     var index=$(this).index();
				   	         	        console.log(index);
				   	         	  //在歌曲点击事件中，添加播放方法
				                  //给audio按钮添加播放标签，然后通过函数调用只运行一下，实现歌曲播放
				                  
				                   //添加高亮效果，jq写法
				                   $(this).addClass("active").siblings().removeClass("active");
				                   
//				                   $(".contentGc ul li:not(this)").removeClass("active");
				                   //原生写法
				                  // 给当前播放歌曲添加高亮效果
//								var li = document.querySelectorAll('.contentGc ul li');
//								for(var i=0;i<li.length;i++){
//									if(i===index){
//										li[i].classList.add('active');
//										//li[i].scrollIntoView();
//									}else{
//										li[i].classList.remove('active');
//									}
//								}
				                  
				                  
				                  
								player.src = searlist[index].m4a;
							    play_L();
							    console.log("bbb");
							    //改变标题
							    eTitle.innerHTML="";
							    eTitle.innerHTML=searlist[index].singername+'-'+searlist[index].songname;
							    
							    //改变专辑图片
							    eAlbum.src=searlist[index].albumpic_small;
							       
				   	         	  console.log(searlist[index].albumpic_big);
				   	         	
				   	         	//添加专辑大图    
				   	         	$special_H.css("background-image","url("+searlist[index].albumpic_big+")");   
				   	         	  console.log($special_H);
				   	         })
			  	    		     
			  	    		      
			  	    	}
			  	    });
		            	
		        }
				
		
		})
	

})();
