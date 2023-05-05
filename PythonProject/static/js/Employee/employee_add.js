$(function () {
	$("#employee_employeeNo").validatebox({
		required : true, 
		missingMessage : '请输入员工编号',
	});

	$("#employee_password").validatebox({
		required : true, 
		missingMessage : '请输入登录密码',
	});

	$("#employee_name").validatebox({
		required : true, 
		missingMessage : '请输入员工姓名',
	});

	$("#employee_gender").validatebox({
		required : true, 
		missingMessage : '请输入性别',
	});

	$("#employee_inDate").datebox({
	    required : true, 
	    showSeconds: true,
	    editable: false
	});

	$("#employee_telephone").validatebox({
		required : true, 
		missingMessage : '请输入联系电话',
	});

	$("#employee_email").validatebox({
		required : true, 
		missingMessage : '请输入邮箱',
	});

	//单击添加按钮
	$("#employeeAddButton").click(function () {
		//验证表单 
		if(!$("#employeeAddForm").form("validate")) {
			$.messager.alert("错误提示","你输入的信息还有错误！","warning");
			$(".messager-window").css("z-index",10000);
		} else {
			$("#employeeAddForm").form({
			    url:"/Employee/add",
				queryParams: {
			    	"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
				},
			    onSubmit: function(){
					if($("#employeeAddForm").form("validate"))  { 
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
                        $("#employeeAddForm").form("clear");
                    }else{
                        $.messager.alert("消息",obj.message);
                        $(".messager-window").css("z-index",10000);
                    }
			    }
			});
			//提交表单
			$("#employeeAddForm").submit();
		}
	});

	//单击清空按钮
	$("#employeeClearButton").click(function () { 
		//$("#employeeAddForm").form("clear"); 
		location.reload()
	});
});
