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
		5）变量数组
			arr.forEach(function(item,idx){});
		6）事件源对象：触发事件的初始对象
			不管事件冒泡到哪个阶段，事件源对象都不会改变
			获取事件源对象：e.target
		7）tagName：获取元素标签名，返回大写字母
		8）scrollIntoView()：把当前元素滚动到可见区域

 */
document.addEventListener('DOMContentLoaded',function(){
	// 获取页面元素
	var ePlayer = document.querySelector('.player');
	var eList = ePlayer.querySelector('.list');
	var btnPlay = ePlayer.querySelector('#btnPlay');
	var btnPrev = ePlayer.querySelector('#btnPrev');
	var btnNext = ePlayer.querySelector('#btnNext');
	var btnVolume = ePlayer.querySelector('#btnVolume');
	var eTitle = ePlayer.querySelector('h1.title');
	var eProgress = ePlayer.querySelector('progress');
	var eModel = ePlayer.querySelector('.play-model');

	// 获取下一个/上一个元素节点
	// nextElementSibling/previousElementSibling
	var eAlbum = btnPlay.previousElementSibling;
	var eTime = eProgress.nextElementSibling;

	// 全局变量
	var playlist = [];
	var index = 0;
	var model = 2;//0:单曲播放,1:单曲循环,2:列表播放,3:列表循环,4:随机播放

	var player = new Audio();

	// 1）ajax加载数据,并写入.list
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function(){
		if(xhr.readyState === 4 && xhr.status === 200){
			var res = JSON.parse(xhr.responseText);

			playlist = res;

			var ol = document.createElement('ol');

			/*for(var i=0;i<res.length;i++){
				res[i]
			}*/
			// ES5数组方法：forEach，用于遍历数组
			res.forEach(function(item,idx){
				// 这里的item就是for循环中的res[i]
				// console.log(item,idx);
				var li = document.createElement('li');
				// li.setAttribute('data-idx',idx);
				li.dataset.idx = idx;
				li.innerHTML = item.singer + ' - ' + item.name;

				ol.appendChild(li);
			});

			// 写入页面
			eList.appendChild(ol);
			
			player.src = playlist[index].src;
		}
	}
	xhr.open('get','playlist.json',true);
	xhr.send(null);


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
	}
	btnNext.onclick = function(){
		index++;
		play();
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
				li[i].scrollIntoView();
			}else{
				li[i].classList.remove('active');
			}
		}
		

		// 改变标题
		eTitle.innerHTML = playlist[index].singer + ' - ' + playlist[index].name;

		// 专辑图片
		eAlbum.src = playlist[index].album;
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
		console.log(e.target);
		if(e.target.tagName.toLowerCase() === 'li'){
			index = parseInt(e.target.dataset.idx);
			play();
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
	function play(){
		if(index<0){
			index = playlist.length-1;
		}else if(index > playlist.length-1){
			index = 0;
		}
		player.src = playlist[index].src;
		player.play();
	}

	// 初始化
	// 改变播放器的初始状态
	// 歌名，图片，播放模式，时间
	function init(){
		// 改变标题
		eTitle.innerHTML = playlist[index].singer + ' - ' + playlist[index].name;

		// 专辑图片
		eAlbum.src = playlist[index].album;

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
		eProgress.value = player.currentTime/player.duration*100
	}


})
