var ziliao_manage_tool = null; 
$(function () { 
	initZiliaoManageTool(); //建立Ziliao管理对象
	ziliao_manage_tool.init(); //如果需要通过下拉框查询，首先初始化下拉框的值
	$("#ziliao_manage").datagrid({
		url : '/Ziliao/list',
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
		sortName : "ziliaoId",
		sortOrder : "desc",
		toolbar : "#ziliao_manage_tool",
		columns : [[
			{
				field : "ziliaoId",
				title : "资料编号",
				width : 70,
			},
			{
				field : "ziliaoName",
				title : "资料名称",
				width : 140,
			},
			{
				field : "ziliaoFile",
				title : "资料文件",
				width : "350px",
				formatter: function(val,row) {
 					if(val.endsWith("file/NoFile.jpg")) return "暂无文件";
					return "<a href='" + val + "' target='_blank' style='color:red;'>" + decodeURIComponent(val.substring(12)) + "</a>";
				}
 			},
			{
				field : "userObj",
				title : "上传客户",
				width : 140,
			},
			{
				field : "upTime",
				title : "上传时间",
				width : 140,
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
			{
				field : "xyjf",
				title : "信用积分",
				width : 70,
			},
		]],
	});

	$("#ziliaoEditDiv").dialog({
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
				if ($("#ziliaoEditForm").form("validate")) {
					//验证表单 
					if(!$("#ziliaoEditForm").form("validate")) {
						$.messager.alert("错误提示","你输入的信息还有错误！","warning");
					} else {
						var ziliao_shenHeState = $('#ziliao_shenHeState_edit').val();
						if(ziliao_shenHeState==null || ziliao_shenHeState == '') {
							$.messager.alert("错误提示","请选择审核状态！","warning");
							return;
						}

						$("#ziliaoEditForm").form({
						    url:"/Ziliao/update/" + $("#ziliao_ziliaoId_edit").val(),
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
						    	console.log(data);
			                	var obj = jQuery.parseJSON(data);
			                    if(obj.success){
			                        $.messager.alert("消息","信息修改成功！");
			                        $("#ziliaoEditDiv").dialog("close");
			                        ziliao_manage_tool.reload();
			                    }else{
			                        $.messager.alert("消息",obj.message);
			                    } 
						    }
						});
						//提交表单
						$("#ziliaoEditForm").submit();
					}
				}
			},
		},{
			text : "取消",
			iconCls : "icon-redo",
			handler : function () {
				$("#ziliaoEditDiv").dialog("close");
				$("#ziliaoEditForm").form("reset"); 
			},
		}],
	});
});

function initZiliaoManageTool() {
	ziliao_manage_tool = {
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
			$("#ziliao_manage").datagrid("reload");
		},
		redo : function () {
			$("#ziliao_manage").datagrid("unselectAll");
		},
		search: function() {
			var queryParams = $("#ziliao_manage").datagrid("options").queryParams;
			queryParams["ziliaoName"] = $("#ziliaoName").val();
			queryParams["userObj.user_name"] = $("#userObj_user_name_query").combobox("getValue");
			queryParams["upTime"] = $("#upTime").datebox("getValue"); 
			queryParams["shenHeState"] = $("#shenHeState").val();
			queryParams["shenHeRen"] = $("#shenHeRen").val();
			queryParams["shenHeTime"] = $("#shenHeTime").datebox("getValue"); 
			queryParams["csrfmiddlewaretoken"] = $('input[name="csrfmiddlewaretoken"]').val();
			$("#ziliao_manage").datagrid("options").queryParams=queryParams; 
			$("#ziliao_manage").datagrid("load");
		},
		exportExcel: function() {
			$("#ziliaoQueryForm").form({
			    url:"/Ziliao/OutToExcel?csrfmiddlewaretoken" + $('input[name="csrfmiddlewaretoken"]').val(),
			});
			//提交表单
			$("#ziliaoQueryForm").submit();
		},
		remove : function () {
			var rows = $("#ziliao_manage").datagrid("getSelections");
			if (rows.length > 0) {
				$.messager.confirm("确定操作", "您正在要删除所选的记录吗？", function (flag) {
					if (flag) {
						var ziliaoIds = [];
						for (var i = 0; i < rows.length; i ++) {
							ziliaoIds.push(rows[i].ziliaoId);
						}
						$.ajax({
							type : "POST",
							url : "/Ziliao/deletes",
							data : {
								ziliaoIds : ziliaoIds.join(","),
								"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
							},
							beforeSend : function () {
								$("#ziliao_manage").datagrid("loading");
							},
							success : function (data) {
								if (data.success) {
									$("#ziliao_manage").datagrid("loaded");
									$("#ziliao_manage").datagrid("load");
									$("#ziliao_manage").datagrid("unselectAll");
									$.messager.show({
										title : "提示",
										msg : data.message
									});
								} else {
									$("#ziliao_manage").datagrid("loaded");
									$("#ziliao_manage").datagrid("load");
									$("#ziliao_manage").datagrid("unselectAll");
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
			var rows = $("#ziliao_manage").datagrid("getSelections");
			if (rows.length > 1) {
				$.messager.alert("警告操作！", "编辑记录只能选定一条数据！", "warning");
			} else if (rows.length == 1) {
				var shenHeState = rows[0].shenHeState;
				if(shenHeState != '待审核') {
					$.messager.alert("警告操作！", "此申请记录已经被处理过了！", "warning");
					return;
				}
				$.ajax({
					url : "/Ziliao/update/" + rows[0].ziliaoId,
					type : "get",
					data : {
						//ziliaoId : rows[0].ziliaoId,
					},
					beforeSend : function () {
						$.messager.progress({
							text : "正在获取中...",
						});
					},
					success : function (ziliao, response, status) {
						$.messager.progress("close");
						if (ziliao) { 
							$("#ziliaoEditDiv").dialog("open");
							$("#ziliao_ziliaoId_edit").val(ziliao.ziliaoId);
							$("#ziliao_ziliaoId_edit").validatebox({
								required : true,
								missingMessage : "请输入资料编号",
								editable: false
							});
							$("#ziliao_ziliaoName_edit").val(ziliao.ziliaoName);
							$("#ziliao_ziliaoName_edit").validatebox({
								required : true,
								missingMessage : "请输入资料名称",
							});
							if(ziliao.ziliaoFile.endsWith("file/NoFile.jpg")) $("#ziliao_ziliaoFileA").html("暂无文件");
							else $("#ziliao_ziliaoFileA").html(decodeURIComponent(ziliao.ziliaoFile.substring(12)));
							$("#ziliao_ziliaoFileA").attr("href", ziliao.ziliaoFile);
							$("#ziliao_userObj_user_name_edit").combobox({
								url:"/UserInfo/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
								method: "GET",
							    valueField:"user_name",
							    textField:"name",
							    panelHeight: "auto",
						        editable: false, //不允许手动输入 
						        onLoadSuccess: function () { //数据加载完毕事件
									$("#ziliao_userObj_user_name_edit").combobox("select", ziliao.userObjPri);
									//var data = $("#ziliao_userObj_user_name_edit").combobox("getData"); 
						            //if (data.length > 0) {
						                //$("#ziliao_userObj_user_name_edit").combobox("select", data[0].user_name);
						            //}
								}
							});
							$("#ziliao_upTime_edit").datetimebox({
								value: ziliao.upTime,
							    required: true,
							    showSeconds: true,
							});
							$("#ziliao_shenHeState_edit").val(ziliao.shenHeState);
							$("#ziliao_shenHeState_edit").validatebox({
								required : true,
								missingMessage : "请输入审核状态",
							});
							$("#ziliao_shenHeRen_edit").val(ziliao.shenHeRen);
							$("#ziliao_shenHeRen_edit").validatebox({
								required : true,
								missingMessage : "请输入审核人",
							});
							$("#ziliao_shenHeTime_edit").datetimebox({
								value: ziliao.shenHeTime,
							    required: true,
							    showSeconds: true,
							});
							$("#ziliao_xyjf_edit").val(ziliao.xyjf);
							$("#ziliao_xyjf_edit").validatebox({
								required : true,
								validType : "number",
								missingMessage : "请输入信用积分",
								invalidMessage : "信用积分输入不对",
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
