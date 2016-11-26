//搜索歌曲
;(function(){
    	//搜索歌词
			jQuery(document).ready(function(){
				
		    var $ePlayer = $('.player');//播放器
			var $eList = $('#list_H');//ul
			var $btnPlay = $('#btnPlay');//播放按钮			
			var $eTitle = $('h1.title');//歌名及歌手
			var $eProgress = $('progress');//进度条
			
				
				
				  
				  var player=new Audio();
				  console.log(player);
				  function play(){
				  	  player.play();
				  }
				  
				  var $contentGc=$('.contentGc');
				
				   var name;
				   var $btn=$('#btn_gc');
				   			   
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
								player.src = searlist[index].m4a;
							    play();
							        console.log($eTitle);
									$eTitle.html("");		
									$eTitle.html(searlist[index].singername+searlist[index].songname);
				   	         	     
				   	         })
			  	    		     
			  	    		      
			  	    	}
			  	    });
		            	
		        }
		
		  
	})
	
})();



