$(function () {
	$("#loanApply_reason").validatebox({
		required : true, 
		missingMessage : '请输入贷款原因',
	});

	$("#loanApply_loadMoney").validatebox({
		required : true,
		validType : "number",
		missingMessage : '请输入贷款金额',
		invalidMessage : '贷款金额输入不对',
	});

	$("#loanApply_loanType").validatebox({
		required : true, 
		missingMessage : '请输入贷款种类',
	});

	$("#loanApply_loanTerm").validatebox({
		required : true, 
		missingMessage : '请输入贷款期限',
	});

	$("#loanApply_shenHeState").validatebox({
		required : true, 
		missingMessage : '请输入审核状态',
	});

	$("#loanApply_shenHeTime").datetimebox({
	    required : true, 
	    showSeconds: true,
	    editable: false
	});

	$("#loanApply_shenHeRen").validatebox({
		required : true, 
		missingMessage : '请输入审核人',
	});

	//单击添加按钮
	$("#loanApplyAddButton").click(function () {
		//验证表单 
		if(!$("#loanApplyAddForm").form("validate")) {
			$.messager.alert("错误提示","你输入的信息还有错误！","warning");
			$(".messager-window").css("z-index",10000);
		} else {
			$("#loanApplyAddForm").form({
			    url:"/LoanApply/add",
				queryParams: {
			    	"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
				},
			    onSubmit: function(){
					if($("#loanApplyAddForm").form("validate"))  { 
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
                        $("#loanApplyAddForm").form("clear");
                    }else{
                        $.messager.alert("消息",obj.message);
                        $(".messager-window").css("z-index",10000);
                    }
			    }
			});
			//提交表单
			$("#loanApplyAddForm").submit();
		}
	});

	//单击清空按钮
	$("#loanApplyClearButton").click(function () { 
		//$("#loanApplyAddForm").form("clear"); 
		location.reload()
	});
});
