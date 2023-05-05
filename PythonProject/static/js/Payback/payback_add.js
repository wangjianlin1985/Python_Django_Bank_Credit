$(function () {
	$("#payback_payMoney").validatebox({
		required : true,
		validType : "number",
		missingMessage : '请输入还款金额',
		invalidMessage : '还款金额输入不对',
	});

	$("#payback_payWay").validatebox({
		required : true, 
		missingMessage : '请输入还款方式',
	});

	$("#payback_payAccount").validatebox({
		required : true, 
		missingMessage : '请输入还款账号',
	});

	$("#payback_payTime").datetimebox({
	    required : true, 
	    showSeconds: true,
	    editable: false
	});

	$("#payback_xyjf").validatebox({
		required : true,
		validType : "number",
		missingMessage : '请输入信用积分',
		invalidMessage : '信用积分输入不对',
	});

	$("#payback_shenHeState").validatebox({
		required : true, 
		missingMessage : '请输入审核状态',
	});

	$("#payback_shenHeRen").validatebox({
		required : true, 
		missingMessage : '请输入审核人',
	});

	$("#payback_shenHeTime").datetimebox({
	    required : true, 
	    showSeconds: true,
	    editable: false
	});

	//单击添加按钮
	$("#paybackAddButton").click(function () {
		//验证表单 
		if(!$("#paybackAddForm").form("validate")) {
			$.messager.alert("错误提示","你输入的信息还有错误！","warning");
			$(".messager-window").css("z-index",10000);
		} else {
			$("#paybackAddForm").form({
			    url:"/Payback/add",
				queryParams: {
			    	"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
				},
			    onSubmit: function(){
					if($("#paybackAddForm").form("validate"))  { 
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
                        $("#paybackAddForm").form("clear");
                    }else{
                        $.messager.alert("消息",obj.message);
                        $(".messager-window").css("z-index",10000);
                    }
			    }
			});
			//提交表单
			$("#paybackAddForm").submit();
		}
	});

	//单击清空按钮
	$("#paybackClearButton").click(function () { 
		//$("#paybackAddForm").form("clear"); 
		location.reload()
	});
});
