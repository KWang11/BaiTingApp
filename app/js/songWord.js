//获取歌词
;(function(){
	  jQuery(document).ready(function(){
	  	       			
	  	      var music_ID=4833285;
	  	     
	  	       success_SW();			
	  	       			
	  	       			
			function success_SW(){
			  	 $.ajax({
			  	    	type:"get",
			  	    	url:"http://route.showapi.com/213-2",
			  	    	async:true,
			  	    	dataType:'json',			  	    
			  	    	data:{
			  	    	  showapi_appid:'27101',
			              showapi_sign:'abd584e961874c2f8225c7c4f805ec8b',
			               musicid:music_ID,			                
			  	    	},
			  	    	success:function(res){
			  	    		           console.log(res);
			  	    		       			  	
			  	    		       			  var string=res.showapi_res_body.lyric;
			  	    		       			  console.log(string);
	
			  	    		       			  var array=[];
			  	    		       			  var Reg=/[\d{2}\$\#\d{2};\d{2}\$\#\d{2};\d{2};\d{2}]/
			  	    		       			  array=string.split(Reg);
			  	    		       			  console.log(array);
			  	    		       			  	
//                              var $ul=$('<ul/>');
//			  	    		 			  	    		  
//			  	    		   	     var $li=$('<li/>');
//			  	    		   	     $li.html(res.showapi_res_body.lyric).appendTo($ul);
//			  	    		  
//			  	    		   $ul.appendTo($('.songword'));
			  	    	}			  	    	
			  	   });			  	  	
			  	 }			  
			 })	  
})();
