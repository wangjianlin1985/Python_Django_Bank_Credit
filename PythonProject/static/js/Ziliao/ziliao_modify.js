$(function () {
    setTimeout(ajaxModifyQuery,"100");
  function ajaxModifyQuery() {	
	$.ajax({
		url : "/Ziliao/update/" + $("#ziliao_ziliaoId_modify").val(),
		type : "get",
		data : {
			//ziliaoId : $("#ziliao_ziliaoId_modify").val(),
		},
		beforeSend : function () {
			$.messager.progress({
				text : "正在获取中...",
			});
		},
		success : function (ziliao, response, status) {
			$.messager.progress("close");
			if (ziliao) { 
				$("#ziliao_ziliaoId_modify").val(ziliao.ziliaoId);
				$("#ziliao_ziliaoId_modify").validatebox({
					required : true,
					missingMessage : "请输入资料编号",
					editable: false
				});
				$("#ziliao_ziliaoName_modify").val(ziliao.ziliaoName);
				$("#ziliao_ziliaoName_modify").validatebox({
					required : true,
					missingMessage : "请输入资料名称",
				});
				if(ziliao.ziliaoFile.endsWith("file/NoFile.jpg")) $("#ziliao_ziliaoFileModA").html("暂无文件");
				$("#ziliao_ziliaoFileModA").attr("href", ziliao.ziliaoFile);
				$("#ziliao_userObj_user_name_modify").combobox({
					url:"/UserInfo/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
					method: "GET",
					valueField:"user_name",
					textField:"name",
					panelHeight: "auto",
					editable: false, //不允许手动输入 
					onLoadSuccess: function () { //数据加载完毕事件
						$("#ziliao_userObj_user_name_modify").combobox("select", ziliao.userObjPri);
						//var data = $("#ziliao_userObj_user_name_edit").combobox("getData"); 
						//if (data.length > 0) {
							//$("#ziliao_userObj_user_name_edit").combobox("select", data[0].user_name);
						//}
					}
				});
				$("#ziliao_upTime_modify").datetimebox({
					value: ziliao.upTime,
					required: true,
					showSeconds: true,
				});
				$("#ziliao_shenHeState_modify").val(ziliao.shenHeState);
				$("#ziliao_shenHeState_modify").validatebox({
					required : true,
					missingMessage : "请输入审核状态",
				});
				$("#ziliao_shenHeRen_modify").val(ziliao.shenHeRen);
				$("#ziliao_shenHeRen_modify").validatebox({
					required : true,
					missingMessage : "请输入审核人",
				});
				$("#ziliao_shenHeTime_modify").datetimebox({
					value: ziliao.shenHeTime,
					required: true,
					showSeconds: true,
				});
				$("#ziliao_xyjf_modify").val(ziliao.xyjf);
				$("#ziliao_xyjf_modify").validatebox({
					required : true,
					validType : "number",
					missingMessage : "请输入信用积分",
					invalidMessage : "信用积分输入不对",
				});
			} else {
				$.messager.alert("获取失败！", "未知错误导致失败，请重试！", "warning");
				$(".messager-window").css("z-index",10000);
			}
		}
	});

  }

	$("#ziliaoModifyButton").click(function(){ 
		if ($("#ziliaoModifyForm").form("validate")) {
			$("#ziliaoModifyForm").form({
			    url:"Ziliao/update/" + $("#ziliao_ziliaoId_modify").val(),
			    onSubmit: function(){
					if($("#ziliaoEditForm").form("validate"))  {
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
			$("#ziliaoModifyForm").submit();
		} else {
			$.messager.alert("错误提示","你输入的信息还有错误！","warning");
			$(".messager-window").css("z-index",10000);
		}
	});
});
