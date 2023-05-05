$(function () {
    setTimeout(ajaxModifyQuery,"100");
  function ajaxModifyQuery() {	
	$.ajax({
		url : "/Payback/update/" + $("#payback_paybackId_modify").val(),
		type : "get",
		data : {
			//paybackId : $("#payback_paybackId_modify").val(),
		},
		beforeSend : function () {
			$.messager.progress({
				text : "正在获取中...",
			});
		},
		success : function (payback, response, status) {
			$.messager.progress("close");
			if (payback) { 
				$("#payback_paybackId_modify").val(payback.paybackId);
				$("#payback_paybackId_modify").validatebox({
					required : true,
					missingMessage : "请输入还款编号",
					editable: false
				});
				$("#payback_loanObj_applyId_modify").combobox({
					url:"/LoanApply/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
					method: "GET",
					valueField:"applyId",
					textField:"reason",
					panelHeight: "auto",
					editable: false, //不允许手动输入 
					onLoadSuccess: function () { //数据加载完毕事件
						$("#payback_loanObj_applyId_modify").combobox("select", payback.loanObjPri);
						//var data = $("#payback_loanObj_applyId_edit").combobox("getData"); 
						//if (data.length > 0) {
							//$("#payback_loanObj_applyId_edit").combobox("select", data[0].applyId);
						//}
					}
				});
				$("#payback_payMoney_modify").val(payback.payMoney);
				$("#payback_payMoney_modify").validatebox({
					required : true,
					validType : "number",
					missingMessage : "请输入还款金额",
					invalidMessage : "还款金额输入不对",
				});
				$("#payback_payWay_modify").val(payback.payWay);
				$("#payback_payWay_modify").validatebox({
					required : true,
					missingMessage : "请输入还款方式",
				});
				$("#payback_payAccount_modify").val(payback.payAccount);
				$("#payback_payAccount_modify").validatebox({
					required : true,
					missingMessage : "请输入还款账号",
				});
				$("#payback_payTime_modify").datetimebox({
					value: payback.payTime,
					required: true,
					showSeconds: true,
				});
				$("#payback_userObj_user_name_modify").combobox({
					url:"/UserInfo/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
					method: "GET",
					valueField:"user_name",
					textField:"name",
					panelHeight: "auto",
					editable: false, //不允许手动输入 
					onLoadSuccess: function () { //数据加载完毕事件
						$("#payback_userObj_user_name_modify").combobox("select", payback.userObjPri);
						//var data = $("#payback_userObj_user_name_edit").combobox("getData"); 
						//if (data.length > 0) {
							//$("#payback_userObj_user_name_edit").combobox("select", data[0].user_name);
						//}
					}
				});
				$("#payback_xyjf_modify").val(payback.xyjf);
				$("#payback_xyjf_modify").validatebox({
					required : true,
					validType : "number",
					missingMessage : "请输入信用积分",
					invalidMessage : "信用积分输入不对",
				});
				$("#payback_shenHeState_modify").val(payback.shenHeState);
				$("#payback_shenHeState_modify").validatebox({
					required : true,
					missingMessage : "请输入审核状态",
				});
				$("#payback_shenHeRen_modify").val(payback.shenHeRen);
				$("#payback_shenHeRen_modify").validatebox({
					required : true,
					missingMessage : "请输入审核人",
				});
				$("#payback_shenHeTime_modify").datetimebox({
					value: payback.shenHeTime,
					required: true,
					showSeconds: true,
				});
			} else {
				$.messager.alert("获取失败！", "未知错误导致失败，请重试！", "warning");
				$(".messager-window").css("z-index",10000);
			}
		}
	});

  }

	$("#paybackModifyButton").click(function(){ 
		if ($("#paybackModifyForm").form("validate")) {
			$("#paybackModifyForm").form({
			    url:"Payback/update/" + $("#payback_paybackId_modify").val(),
			    onSubmit: function(){
					if($("#paybackEditForm").form("validate"))  {
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
			$("#paybackModifyForm").submit();
		} else {
			$.messager.alert("错误提示","你输入的信息还有错误！","warning");
			$(".messager-window").css("z-index",10000);
		}
	});
});
