function ajax(obj){
	obj=obj||{};
	obj.type=(obj.type||"GET").toUpperCase();
	obj.dataType=obj.dataType||"json";
	obj.async = obj.async||true;
	obj.contentType = obj.contentType || 'application/x-www-form-urlencoded';
	
	var params=typeof(obj.data) == "string"? obj.data : _params(obj.data || null);//参数格式化

	//step1:兼容性创建对象
	if(window.XMLHttpRequest){
		var xhr=new XMLHttpRequest();
	}
	else{
		var xhr=new ActiveXObject('Microsoft.XMLHTTP');
	}

	//step4: 接收
	xhr.onreadystatechange=function(){
		if(xhr.readyState==4){
			if(xhr.status>=200 && xhr.status<300){
				obj.success&&obj.success(xhr.responseText,xhr.responseXML);
			}
			else{
				obj.error&&obj.error(xhr.status);
			}
		}
	}

	//step2 step3:连接 和 发送
	if(obj.type=='GET'){
		xhr.open('GET',obj.url+(obj.url.indexOf("?") > -1? "&":"?")+params,obj.async);
		xhr.send(null);
	}
	else if(obj.type=='POST'){
		xhr.open('POST',obj.url,obj.async);
		//设置请求头，以表单形式提交数据
		xhr.setRequestHeader('Content-Type',obj.contentType);
		xhr.send(params);
	}


	//辅助函数，格式化参数
	function formatParams(data){
		if(typeof(data) == "object"){
			var arr=[];
			for(var name in data){
				arr.push(encodeURIComponent(name)+"="+encodeURIComponent(data[name]));
			}
			//设置随机数，防止缓存
			arr.push("t="+Math.random());
			return arr.join("&");
		}
		
		if(typeof(data) == "string"){
				return data;
		}
	}
	
	//_params函数解析发送的data数据，对其进行URL编码并返回
	function _params(data,key) {
		var params = '';
		key=key||'';
		var type={'string':true,'number':true,'boolean':true};
		if(type[typeof(data)])
			params = data;
		else
			for(var i in data) {
				if(type[typeof(data[i])])
					params += "&" + key + (!key?i:('['+i+']')) + "=" +data[i];
				else
					params+=_params(data[i],key+(!key?i:('['+i+']')));
			}
		return !key?encodeURI(params).replace(/%5B/g,'[').replace(/%5D/g,']'):params;
	}

}