$(function () {
	$("#ziliao_ziliaoName").validatebox({
		required : true, 
		missingMessage : '请输入资料名称',
	});

	$("#ziliao_upTime").datetimebox({
	    required : true, 
	    showSeconds: true,
	    editable: false
	});

	$("#ziliao_shenHeState").validatebox({
		required : true, 
		missingMessage : '请输入审核状态',
	});

	$("#ziliao_shenHeRen").validatebox({
		required : true, 
		missingMessage : '请输入审核人',
	});

	$("#ziliao_shenHeTime").datetimebox({
	    required : true, 
	    showSeconds: true,
	    editable: false
	});

	$("#ziliao_xyjf").validatebox({
		required : true,
		validType : "number",
		missingMessage : '请输入信用积分',
		invalidMessage : '信用积分输入不对',
	});

	//单击添加按钮
	$("#ziliaoAddButton").click(function () {
		//验证表单 
		if(!$("#ziliaoAddForm").form("validate")) {
			$.messager.alert("错误提示","你输入的信息还有错误！","warning");
			$(".messager-window").css("z-index",10000);
		} else {
			$("#ziliaoAddForm").form({
			    url:"/Ziliao/add",
				queryParams: {
			    	"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
				},
			    onSubmit: function(){
					if($("#ziliaoAddForm").form("validate"))  { 
	                	$.messager.progress({
							text : "正在提交数据中...",
						}); 
	                	return true;
	                } else {
	                    return false;
	                }
			    },
			    success:function(data){
			    	$.messager.progress("close");
                    //此处data={"Success":true}是字符串
                	var obj = jQuery.parseJSON(data); 
                    if(obj.success){ 
                        $.messager.alert("消息","保存成功！");
                        $(".messager-window").css("z-index",10000);
                        $("#ziliaoAddForm").form("clear");
                    }else{
                        $.messager.alert("消息",obj.message);
                        $(".messager-window").css("z-index",10000);
                    }
			    }
			});
			//提交表单
			$("#ziliaoAddForm").submit();
		}
	});

	//单击清空按钮
	$("#ziliaoClearButton").click(function () { 
		//$("#ziliaoAddForm").form("clear"); 
		location.reload()
	});
});
