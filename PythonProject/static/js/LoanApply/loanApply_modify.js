$(function () {
    setTimeout(ajaxModifyQuery,"100");
  function ajaxModifyQuery() {	
	$.ajax({
		url : "/LoanApply/update/" + $("#loanApply_applyId_modify").val(),
		type : "get",
		data : {
			//applyId : $("#loanApply_applyId_modify").val(),
		},
		beforeSend : function () {
			$.messager.progress({
				text : "正在获取中...",
			});
		},
		success : function (loanApply, response, status) {
			$.messager.progress("close");
			if (loanApply) { 
				$("#loanApply_applyId_modify").val(loanApply.applyId);
				$("#loanApply_applyId_modify").validatebox({
					required : true,
					missingMessage : "请输入申请编号",
					editable: false
				});
				$("#loanApply_reason_modify").val(loanApply.reason);
				$("#loanApply_reason_modify").validatebox({
					required : true,
					missingMessage : "请输入贷款原因",
				});
				$("#loanApply_loadMoney_modify").val(loanApply.loadMoney);
				$("#loanApply_loadMoney_modify").validatebox({
					required : true,
					validType : "number",
					missingMessage : "请输入贷款金额",
					invalidMessage : "贷款金额输入不对",
				});
				$("#loanApply_loanType_modify").val(loanApply.loanType);
				$("#loanApply_loanType_modify").validatebox({
					required : true,
					missingMessage : "请输入贷款种类",
				});
				$("#loanApply_loanTerm_modify").val(loanApply.loanTerm);
				$("#loanApply_loanTerm_modify").validatebox({
					required : true,
					missingMessage : "请输入贷款期限",
				});
				$("#loanApply_userObj_user_name_modify").combobox({
					url:"/UserInfo/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
					method: "GET",
					valueField:"user_name",
					textField:"name",
					panelHeight: "auto",
					editable: false, //不允许手动输入 
					onLoadSuccess: function () { //数据加载完毕事件
						$("#loanApply_userObj_user_name_modify").combobox("select", loanApply.userObjPri);
						//var data = $("#loanApply_userObj_user_name_edit").combobox("getData"); 
						//if (data.length > 0) {
							//$("#loanApply_userObj_user_name_edit").combobox("select", data[0].user_name);
						//}
					}
				});
				$("#loanApply_shenHeState_modify").val(loanApply.shenHeState);
				$("#loanApply_shenHeState_modify").validatebox({
					required : true,
					missingMessage : "请输入审核状态",
				});
				$("#loanApply_shenHeTime_modify").datetimebox({
					value: loanApply.shenHeTime,
					required: true,
					showSeconds: true,
				});
				$("#loanApply_shenHeRen_modify").val(loanApply.shenHeRen);
				$("#loanApply_shenHeRen_modify").validatebox({
					required : true,
					missingMessage : "请输入审核人",
				});
			} else {
				$.messager.alert("获取失败！", "未知错误导致失败，请重试！", "warning");
				$(".messager-window").css("z-index",10000);
			}
		}
	});

  }

	$("#loanApplyModifyButton").click(function(){ 
		if ($("#loanApplyModifyForm").form("validate")) {
			$("#loanApplyModifyForm").form({
			    url:"LoanApply/update/" + $("#loanApply_applyId_modify").val(),
			    onSubmit: function(){
					if($("#loanApplyEditForm").form("validate"))  {
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
			$("#loanApplyModifyForm").submit();
		} else {
			$.messager.alert("错误提示","你输入的信息还有错误！","warning");
			$(".messager-window").css("z-index",10000);
		}
	});
});
