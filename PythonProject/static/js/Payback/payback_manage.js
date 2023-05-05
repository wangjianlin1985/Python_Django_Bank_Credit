var payback_manage_tool = null; 
$(function () { 
	initPaybackManageTool(); //建立Payback管理对象
	payback_manage_tool.init(); //如果需要通过下拉框查询，首先初始化下拉框的值
	$("#payback_manage").datagrid({
		url : '/Payback/list',
		queryParams: {
			"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
		},
		fit : true,
		fitColumns : true,
		striped : true,
		rownumbers : true,
		border : false,
		pagination : true,
		pageSize : 5,
		pageList : [5, 10, 15, 20, 25],
		pageNumber : 1,
		sortName : "paybackId",
		sortOrder : "desc",
		toolbar : "#payback_manage_tool",
		columns : [[
			{
				field : "paybackId",
				title : "还款编号",
				width : 70,
			},
			{
				field : "loanObj",
				title : "贷款信息",
				width : 140,
			},
			{
				field : "payMoney",
				title : "还款金额",
				width : 70,
			},
			{
				field : "payWay",
				title : "还款方式",
				width : 140,
			},
			{
				field : "payAccount",
				title : "还款账号",
				width : 140,
			},
			{
				field : "payTime",
				title : "还款时间",
				width : 140,
			},
			{
				field : "userObj",
				title : "还款人",
				width : 140,
			},
			{
				field : "xyjf",
				title : "信用积分",
				width : 70,
			},
			{
				field : "shenHeState",
				title : "审核状态",
				width : 140,
			},
			{
				field : "shenHeRen",
				title : "审核人",
				width : 140,
			},
			{
				field : "shenHeTime",
				title : "审核时间",
				width : 140,
			},
		]],
	});

	$("#paybackEditDiv").dialog({
		title : "修改管理",
		top: "50px",
		width : 700,
		height : 515,
		modal : true,
		closed : true,
		iconCls : "icon-edit-new",
		buttons : [{
			text : "提交",
			iconCls : "icon-edit-new",
			handler : function () {
				if ($("#paybackEditForm").form("validate")) {
					//验证表单 
					if(!$("#paybackEditForm").form("validate")) {
						$.messager.alert("错误提示","你输入的信息还有错误！","warning");
					} else {
						var shenHeState = $('#payback_shenHeState_edit').val()
						if(shenHeState == null || shenHeState == "") {
							$.messager.alert("错误提示","请选择审核状态结果！","warning");
							return;
						}
						$("#paybackEditForm").form({
						    url:"/Payback/update/" + $("#payback_paybackId_edit").val(),
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
						    	console.log(data);
			                	var obj = jQuery.parseJSON(data);
			                    if(obj.success){
			                        $.messager.alert("消息","信息修改成功！");
			                        $("#paybackEditDiv").dialog("close");
			                        payback_manage_tool.reload();
			                    }else{
			                        $.messager.alert("消息",obj.message);
			                    } 
						    }
						});
						//提交表单
						$("#paybackEditForm").submit();
					}
				}
			},
		},{
			text : "取消",
			iconCls : "icon-redo",
			handler : function () {
				$("#paybackEditDiv").dialog("close");
				$("#paybackEditForm").form("reset"); 
			},
		}],
	});
});

function initPaybackManageTool() {
	payback_manage_tool = {
		init: function() {
			$.ajax({
				url : "/LoanApply/listAll",
				data: {
					"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
				},
				type : "get",
				success : function (data, response, status) {
					$("#loanObj_applyId_query").combobox({ 
					    valueField:"applyId",
					    textField:"reason",
					    panelHeight: "200px",
				        editable: false, //不允许手动输入 
					});
					data.splice(0,0,{applyId:0,reason:"不限制"});
					$("#loanObj_applyId_query").combobox("loadData",data); 
				}
			});
			$.ajax({
				url : "/UserInfo/listAll",
				data: {
					"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
				},
				type : "get",
				success : function (data, response, status) {
					$("#userObj_user_name_query").combobox({ 
					    valueField:"user_name",
					    textField:"name",
					    panelHeight: "200px",
				        editable: false, //不允许手动输入 
					});
					data.splice(0,0,{user_name:"",name:"不限制"});
					$("#userObj_user_name_query").combobox("loadData",data); 
				}
			});
		},
		reload : function () {
			$("#payback_manage").datagrid("reload");
		},
		redo : function () {
			$("#payback_manage").datagrid("unselectAll");
		},
		search: function() {
			var queryParams = $("#payback_manage").datagrid("options").queryParams;
			queryParams["loanObj.applyId"] = $("#loanObj_applyId_query").combobox("getValue");
			queryParams["payWay"] = $("#payWay").val();
			queryParams["payAccount"] = $("#payAccount").val();
			queryParams["payTime"] = $("#payTime").datebox("getValue"); 
			queryParams["userObj.user_name"] = $("#userObj_user_name_query").combobox("getValue");
			queryParams["shenHeState"] = $("#shenHeState").val();
			queryParams["shenHeRen"] = $("#shenHeRen").val();
			queryParams["csrfmiddlewaretoken"] = $('input[name="csrfmiddlewaretoken"]').val();
			$("#payback_manage").datagrid("options").queryParams=queryParams; 
			$("#payback_manage").datagrid("load");
		},
		exportExcel: function() {
			$("#paybackQueryForm").form({
			    url:"/Payback/OutToExcel?csrfmiddlewaretoken" + $('input[name="csrfmiddlewaretoken"]').val(),
			});
			//提交表单
			$("#paybackQueryForm").submit();
		},
		remove : function () {
			var rows = $("#payback_manage").datagrid("getSelections");
			if (rows.length > 0) {
				$.messager.confirm("确定操作", "您正在要删除所选的记录吗？", function (flag) {
					if (flag) {
						var paybackIds = [];
						for (var i = 0; i < rows.length; i ++) {
							paybackIds.push(rows[i].paybackId);
						}
						$.ajax({
							type : "POST",
							url : "/Payback/deletes",
							data : {
								paybackIds : paybackIds.join(","),
								"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
							},
							beforeSend : function () {
								$("#payback_manage").datagrid("loading");
							},
							success : function (data) {
								if (data.success) {
									$("#payback_manage").datagrid("loaded");
									$("#payback_manage").datagrid("load");
									$("#payback_manage").datagrid("unselectAll");
									$.messager.show({
										title : "提示",
										msg : data.message
									});
								} else {
									$("#payback_manage").datagrid("loaded");
									$("#payback_manage").datagrid("load");
									$("#payback_manage").datagrid("unselectAll");
									$.messager.alert("消息",data.message);
								}
							},
						});
					}
				});
			} else {
				$.messager.alert("提示", "请选择要删除的记录！", "info");
			}
		},
		edit : function () {
			var rows = $("#payback_manage").datagrid("getSelections");
			if (rows.length > 1) {
				$.messager.alert("警告操作！", "编辑记录只能选定一条数据！", "warning");
			} else if (rows.length == 1) {
				var shenHeState = rows[0].shenHeState;
				if(shenHeState != '待审核') {
					$.messager.alert("警告操作！", "此条记录已被审核过了！", "warning");
					return;
				}
				$.ajax({
					url : "/Payback/update/" + rows[0].paybackId,
					type : "get",
					data : {
						//paybackId : rows[0].paybackId,
					},
					beforeSend : function () {
						$.messager.progress({
							text : "正在获取中...",
						});
					},
					success : function (payback, response, status) {
						$.messager.progress("close");
						if (payback) { 
							$("#paybackEditDiv").dialog("open");
							$("#payback_paybackId_edit").val(payback.paybackId);
							$("#payback_paybackId_edit").validatebox({
								required : true,
								missingMessage : "请输入还款编号",
								editable: false
							});
							$("#payback_loanObj_applyId_edit").combobox({
								url:"/LoanApply/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
								method: "GET",
							    valueField:"applyId",
							    textField:"reason",
							    panelHeight: "auto",
						        editable: false, //不允许手动输入 
						        onLoadSuccess: function () { //数据加载完毕事件
									$("#payback_loanObj_applyId_edit").combobox("select", payback.loanObjPri);
									//var data = $("#payback_loanObj_applyId_edit").combobox("getData"); 
						            //if (data.length > 0) {
						                //$("#payback_loanObj_applyId_edit").combobox("select", data[0].applyId);
						            //}
								}
							});
							$("#payback_payMoney_edit").val(payback.payMoney);
							$("#payback_payMoney_edit").validatebox({
								required : true,
								validType : "number",
								missingMessage : "请输入还款金额",
								invalidMessage : "还款金额输入不对",
							});
							$("#payback_payWay_edit").val(payback.payWay);
							$("#payback_payWay_edit").validatebox({
								required : true,
								missingMessage : "请输入还款方式",
							});
							$("#payback_payAccount_edit").val(payback.payAccount);
							$("#payback_payAccount_edit").validatebox({
								required : true,
								missingMessage : "请输入还款账号",
							});
							$("#payback_payTime_edit").datetimebox({
								value: payback.payTime,
							    required: true,
							    showSeconds: true,
							});
							$("#payback_userObj_user_name_edit").combobox({
								url:"/UserInfo/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
								method: "GET",
							    valueField:"user_name",
							    textField:"name",
							    panelHeight: "auto",
						        editable: false, //不允许手动输入 
						        onLoadSuccess: function () { //数据加载完毕事件
									$("#payback_userObj_user_name_edit").combobox("select", payback.userObjPri);
									//var data = $("#payback_userObj_user_name_edit").combobox("getData"); 
						            //if (data.length > 0) {
						                //$("#payback_userObj_user_name_edit").combobox("select", data[0].user_name);
						            //}
								}
							});
							$("#payback_xyjf_edit").val(payback.xyjf);
							$("#payback_xyjf_edit").validatebox({
								required : true,
								validType : "number",
								missingMessage : "请输入信用积分",
								invalidMessage : "信用积分输入不对",
							});
							$("#payback_shenHeState_edit").val(payback.shenHeState);
							$("#payback_shenHeState_edit").validatebox({
								required : true,
								missingMessage : "请输入审核状态",
							});
							$("#payback_shenHeRen_edit").val(payback.shenHeRen);
							$("#payback_shenHeRen_edit").validatebox({
								required : true,
								missingMessage : "请输入审核人",
							});
							$("#payback_shenHeTime_edit").datetimebox({
								value: payback.shenHeTime,
							    required: true,
							    showSeconds: true,
							});
						} else {
							$.messager.alert("获取失败！", "未知错误导致失败，请重试！", "warning");
						}
					}
				});
			} else if (rows.length == 0) {
				$.messager.alert("警告操作！", "编辑记录至少选定一条数据！", "warning");
			}
		},
	};
}
