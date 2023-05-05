var loanApply_manage_tool = null; 
$(function () { 
	initLoanApplyManageTool(); //建立LoanApply管理对象
	loanApply_manage_tool.init(); //如果需要通过下拉框查询，首先初始化下拉框的值
	$("#loanApply_manage").datagrid({
		url : '/LoanApply/list',
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
		sortName : "applyId",
		sortOrder : "desc",
		toolbar : "#loanApply_manage_tool",
		columns : [[
			{
				field : "applyId",
				title : "申请编号",
				width : 70,
			},
			{
				field : "reason",
				title : "贷款原因",
				width : 140,
			},
			{
				field : "loadMoney",
				title : "贷款金额",
				width : 70,
			},
			{
				field : "loanType",
				title : "贷款种类",
				width : 140,
			},
			{
				field : "loanTerm",
				title : "贷款期限",
				width : 140,
			},
			{
				field : "userObj",
				title : "申请的客户",
				width : 140,
			},
			{
				field : "shenHeState",
				title : "审核状态",
				width : 140,
			},
			{
				field : "shenHeTime",
				title : "审核时间",
				width : 140,
			},
			{
				field : "shenHeRen",
				title : "审核人",
				width : 140,
			},
		]],
	});

	$("#loanApplyEditDiv").dialog({
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
				if ($("#loanApplyEditForm").form("validate")) {
					//验证表单 
					if(!$("#loanApplyEditForm").form("validate")) {
						$.messager.alert("错误提示","你输入的信息还有错误！","warning");
					} else {
						$("#loanApplyEditForm").form({
						    url:"/LoanApply/update/" + $("#loanApply_applyId_edit").val(),
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
						    	console.log(data);
			                	var obj = jQuery.parseJSON(data);
			                    if(obj.success){
			                        $.messager.alert("消息","信息修改成功！");
			                        $("#loanApplyEditDiv").dialog("close");
			                        loanApply_manage_tool.reload();
			                    }else{
			                        $.messager.alert("消息",obj.message);
			                    } 
						    }
						});
						//提交表单
						$("#loanApplyEditForm").submit();
					}
				}
			},
		},{
			text : "取消",
			iconCls : "icon-redo",
			handler : function () {
				$("#loanApplyEditDiv").dialog("close");
				$("#loanApplyEditForm").form("reset"); 
			},
		}],
	});
});

function initLoanApplyManageTool() {
	loanApply_manage_tool = {
		init: function() {
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
			$("#loanApply_manage").datagrid("reload");
		},
		redo : function () {
			$("#loanApply_manage").datagrid("unselectAll");
		},
		search: function() {
			var queryParams = $("#loanApply_manage").datagrid("options").queryParams;
			queryParams["reason"] = $("#reason").val();
			queryParams["loanType"] = $("#loanType").val();
			queryParams["userObj.user_name"] = $("#userObj_user_name_query").combobox("getValue");
			queryParams["shenHeState"] = $("#shenHeState").val();
			queryParams["shenHeTime"] = $("#shenHeTime").datebox("getValue"); 
			queryParams["shenHeRen"] = $("#shenHeRen").val();
			queryParams["csrfmiddlewaretoken"] = $('input[name="csrfmiddlewaretoken"]').val();
			$("#loanApply_manage").datagrid("options").queryParams=queryParams; 
			$("#loanApply_manage").datagrid("load");
		},
		exportExcel: function() {
			$("#loanApplyQueryForm").form({
			    url:"/LoanApply/OutToExcel?csrfmiddlewaretoken" + $('input[name="csrfmiddlewaretoken"]').val(),
			});
			//提交表单
			$("#loanApplyQueryForm").submit();
		},
		remove : function () {
			var rows = $("#loanApply_manage").datagrid("getSelections");
			if (rows.length > 0) {
				$.messager.confirm("确定操作", "您正在要删除所选的记录吗？", function (flag) {
					if (flag) {
						var applyIds = [];
						for (var i = 0; i < rows.length; i ++) {
							applyIds.push(rows[i].applyId);
						}
						$.ajax({
							type : "POST",
							url : "/LoanApply/deletes",
							data : {
								applyIds : applyIds.join(","),
								"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
							},
							beforeSend : function () {
								$("#loanApply_manage").datagrid("loading");
							},
							success : function (data) {
								if (data.success) {
									$("#loanApply_manage").datagrid("loaded");
									$("#loanApply_manage").datagrid("load");
									$("#loanApply_manage").datagrid("unselectAll");
									$.messager.show({
										title : "提示",
										msg : data.message
									});
								} else {
									$("#loanApply_manage").datagrid("loaded");
									$("#loanApply_manage").datagrid("load");
									$("#loanApply_manage").datagrid("unselectAll");
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
			var rows = $("#loanApply_manage").datagrid("getSelections");
			if (rows.length > 1) {
				$.messager.alert("警告操作！", "编辑记录只能选定一条数据！", "warning");
			} else if (rows.length == 1) {
				var shenHeState = rows[0].shenHeState;
				if(shenHeState != '待审核') {
					$.messager.alert("警告操作！", "此贷款记录被审核过了！", "warning");
					return;
				}
				$.ajax({
					url : "/LoanApply/update/" + rows[0].applyId,
					type : "get",
					data : {
						//applyId : rows[0].applyId,
					},
					beforeSend : function () {
						$.messager.progress({
							text : "正在获取中...",
						});
					},
					success : function (loanApply, response, status) {
						$.messager.progress("close");
						if (loanApply) { 
							$("#loanApplyEditDiv").dialog("open");
							$("#loanApply_applyId_edit").val(loanApply.applyId);
							$("#loanApply_applyId_edit").validatebox({
								required : true,
								missingMessage : "请输入申请编号",
								editable: false
							});
							$("#loanApply_reason_edit").val(loanApply.reason);
							$("#loanApply_reason_edit").validatebox({
								required : true,
								missingMessage : "请输入贷款原因",
							});
							$("#loanApply_loadMoney_edit").val(loanApply.loadMoney);
							$("#loanApply_loadMoney_edit").validatebox({
								required : true,
								validType : "number",
								missingMessage : "请输入贷款金额",
								invalidMessage : "贷款金额输入不对",
							});
							$("#loanApply_loanType_edit").val(loanApply.loanType);
							$("#loanApply_loanType_edit").validatebox({
								required : true,
								missingMessage : "请输入贷款种类",
							});
							$("#loanApply_loanTerm_edit").val(loanApply.loanTerm);
							$("#loanApply_loanTerm_edit").validatebox({
								required : true,
								missingMessage : "请输入贷款期限",
							});
							$("#loanApply_userObj_user_name_edit").combobox({
								url:"/UserInfo/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
								method: "GET",
							    valueField:"user_name",
							    textField:"name",
							    panelHeight: "auto",
						        editable: false, //不允许手动输入 
						        onLoadSuccess: function () { //数据加载完毕事件
									$("#loanApply_userObj_user_name_edit").combobox("select", loanApply.userObjPri);
									//var data = $("#loanApply_userObj_user_name_edit").combobox("getData"); 
						            //if (data.length > 0) {
						                //$("#loanApply_userObj_user_name_edit").combobox("select", data[0].user_name);
						            //}
								}
							});
							$("#loanApply_shenHeState_edit").val(loanApply.shenHeState);
							$("#loanApply_shenHeState_edit").validatebox({
								required : true,
								missingMessage : "请输入审核状态",
							});
							$("#loanApply_shenHeTime_edit").datetimebox({
								value: loanApply.shenHeTime,
							    required: true,
							    showSeconds: true,
							});
							$("#loanApply_shenHeRen_edit").val(loanApply.shenHeRen);
							$("#loanApply_shenHeRen_edit").validatebox({
								required : true,
								missingMessage : "请输入审核人",
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
