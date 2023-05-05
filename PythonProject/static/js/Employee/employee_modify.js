$(function () {
    setTimeout(ajaxModifyQuery,"100");
  function ajaxModifyQuery() {	
	$.ajax({
		url : "/Employee/update/" + $("#employee_employeeNo_modify").val(),
		type : "get",
		data : {
			//employeeNo : $("#employee_employeeNo_modify").val(),
		},
		beforeSend : function () {
			$.messager.progress({
				text : "正在获取中...",
			});
		},
		success : function (employee, response, status) {
			$.messager.progress("close");
			if (employee) { 
				$("#employee_employeeNo_modify").val(employee.employeeNo);
				$("#employee_employeeNo_modify").validatebox({
					required : true,
					missingMessage : "请输入员工编号",
					editable: false
				});
				$("#employee_password_modify").val(employee.password);
				$("#employee_password_modify").validatebox({
					required : true,
					missingMessage : "请输入登录密码",
				});
				$("#employee_name_modify").val(employee.name);
				$("#employee_name_modify").validatebox({
					required : true,
					missingMessage : "请输入员工姓名",
				});
				$("#employee_gender_modify").val(employee.gender);
				$("#employee_gender_modify").validatebox({
					required : true,
					missingMessage : "请输入性别",
				});
				$("#employee_inDate_modify").datebox({
					value: employee.inDate,
					required: true,
					showSeconds: true,
				});
				$("#employee_empPhotoImgMod").attr("src", employee.empPhoto);
				$("#employee_telephone_modify").val(employee.telephone);
				$("#employee_telephone_modify").validatebox({
					required : true,
					missingMessage : "请输入联系电话",
				});
				$("#employee_email_modify").val(employee.email);
				$("#employee_email_modify").validatebox({
					required : true,
					missingMessage : "请输入邮箱",
				});
				$("#employee_address_modify").val(employee.address);
			} else {
				$.messager.alert("获取失败！", "未知错误导致失败，请重试！", "warning");
				$(".messager-window").css("z-index",10000);
			}
		}
	});

  }

	$("#employeeModifyButton").click(function(){ 
		if ($("#employeeModifyForm").form("validate")) {
			$("#employeeModifyForm").form({
			    url:"Employee/update/" + $("#employee_employeeNo_modify").val(),
			    onSubmit: function(){
					if($("#employeeEditForm").form("validate"))  {
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
                	var obj = jQuery.parseJSON(data);
                    if(obj.success){
                        $.messager.alert("消息","信息修改成功！");
                        $(".messager-window").css("z-index",10000);
                        //location.href="frontlist";
                    }else{
                        $.messager.alert("消息",obj.message);
                        $(".messager-window").css("z-index",10000);
                    } 
			    }
			});
			//提交表单
			$("#employeeModifyForm").submit();
		} else {
			$.messager.alert("错误提示","你输入的信息还有错误！","warning");
			$(".messager-window").css("z-index",10000);
		}
	});
});
