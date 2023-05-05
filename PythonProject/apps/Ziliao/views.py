from django.views.generic import View
from apps.BaseView import BaseView
from django.shortcuts import render
from django.core.paginator import Paginator
from apps.Ziliao.models import Ziliao
from apps.UserInfo.models import UserInfo
from django.http import JsonResponse
from django.http import FileResponse
from apps.BaseView import ImageFormatException
from django.conf import settings
import pandas as pd
import os
import datetime


class FrontAddView(BaseView):  # 前台客户资料添加
    def get(self,request):
        userInfos = UserInfo.objects.all()  # 获取所有客户
        context = {
            'userInfos': userInfos,
        }

        # 使用模板
        return render(request, 'Ziliao/ziliao_frontAdd.html', context)

    def post(self, request):
        ziliao = Ziliao() # 新建一个客户资料对象然后获取参数
        ziliao.ziliaoName = request.POST.get('ziliao.ziliaoName')
        ziliao.ziliaoFile = self.uploadCommonFile(request,'ziliao.ziliaoFile')
        #ziliao.userObj = UserInfo.objects.get(user_name=request.POST.get('ziliao.userObj.user_name'))
        ziliao.userObj = UserInfo.objects.get(user_name=request.session.get('user_name'))
        ziliao.upTime = str(datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
        ziliao.shenHeState = request.POST.get('ziliao.shenHeState')
        ziliao.shenHeRen = request.POST.get('ziliao.shenHeRen')
        ziliao.shenHeTime = "--"
        ziliao.xyjf = float(request.POST.get('ziliao.xyjf'))
        ziliao.save() # 保存客户资料信息到数据库
        return JsonResponse({'success': True, 'message': '保存成功'})




class FrontModifyView(BaseView):  # 前台修改客户资料
    def get(self, request, ziliaoId):
        context = {'ziliaoId': ziliaoId}
        return render(request, 'Ziliao/ziliao_frontModify.html', context)


class FrontListView(BaseView):  # 前台客户资料查询列表
    def get(self, request):
        return self.handle(request)

    def post(self, request):
        return self.handle(request)

    def handle(self, request):
        self.getCurrentPage(request)  # 获取当前要显示第几页
        # 下面获取查询参数
        ziliaoName = self.getStrParam(request, 'ziliaoName')
        userObj_user_name = self.getStrParam(request, 'userObj.user_name')
        upTime = self.getStrParam(request, 'upTime')
        shenHeState = self.getStrParam(request, 'shenHeState')
        shenHeRen = self.getStrParam(request, 'shenHeRen')
        shenHeTime = self.getStrParam(request, 'shenHeTime')
        # 然后条件组合查询过滤
        ziliaos = Ziliao.objects.all()
        if ziliaoName != '':
            ziliaos = ziliaos.filter(ziliaoName__contains=ziliaoName)
        if userObj_user_name != '':
            ziliaos = ziliaos.filter(userObj=userObj_user_name)
        if upTime != '':
            ziliaos = ziliaos.filter(upTime__contains=upTime)
        if shenHeState != '':
            ziliaos = ziliaos.filter(shenHeState__contains=shenHeState)
        if shenHeRen != '':
            ziliaos = ziliaos.filter(shenHeRen__contains=shenHeRen)
        if shenHeTime != '':
            ziliaos = ziliaos.filter(shenHeTime__contains=shenHeTime)
        # 对查询结果利用Paginator进行分页
        self.paginator = Paginator(ziliaos, self.pageSize)
        # 计算总的页码数，要显示的页码列表，总记录等
        self.calculatePages()
        # 获取第page页的Page实例对象
        ziliaos_page = self.paginator.page(self.currentPage)

        # 获取所有客户
        userInfos = UserInfo.objects.all()
        # 构造模板需要的参数
        context = {
            'userInfos': userInfos,
            'ziliaos_page': ziliaos_page,
            'ziliaoName': ziliaoName,
            'userObj_user_name': userObj_user_name,
            'upTime': upTime,
            'shenHeState': shenHeState,
            'shenHeRen': shenHeRen,
            'shenHeTime': shenHeTime,
            'currentPage': self.currentPage,
            'totalPage': self.totalPage,
            'recordNumber': self.recordNumber,
            'startIndex': self.startIndex,
            'pageList': self.pageList,
        }
        # 渲染模板界面
        return render(request, 'Ziliao/ziliao_frontquery_result.html', context)


class FrontUserListView(BaseView):  # 前台客户资料查询列表
    def get(self, request):
        return self.handle(request)

    def post(self, request):
        return self.handle(request)

    def handle(self, request):
        self.getCurrentPage(request)  # 获取当前要显示第几页
        # 下面获取查询参数
        ziliaoName = self.getStrParam(request, 'ziliaoName')
        userObj_user_name = request.session.get('user_name')
        upTime = self.getStrParam(request, 'upTime')
        shenHeState = self.getStrParam(request, 'shenHeState')
        shenHeRen = self.getStrParam(request, 'shenHeRen')
        shenHeTime = self.getStrParam(request, 'shenHeTime')
        # 然后条件组合查询过滤
        ziliaos = Ziliao.objects.all()
        if ziliaoName != '':
            ziliaos = ziliaos.filter(ziliaoName__contains=ziliaoName)
        if userObj_user_name != '':
            ziliaos = ziliaos.filter(userObj=userObj_user_name)
        if upTime != '':
            ziliaos = ziliaos.filter(upTime__contains=upTime)
        if shenHeState != '':
            ziliaos = ziliaos.filter(shenHeState__contains=shenHeState)
        if shenHeRen != '':
            ziliaos = ziliaos.filter(shenHeRen__contains=shenHeRen)
        if shenHeTime != '':
            ziliaos = ziliaos.filter(shenHeTime__contains=shenHeTime)
        # 对查询结果利用Paginator进行分页
        self.paginator = Paginator(ziliaos, self.pageSize)
        # 计算总的页码数，要显示的页码列表，总记录等
        self.calculatePages()
        # 获取第page页的Page实例对象
        ziliaos_page = self.paginator.page(self.currentPage)

        # 获取所有客户
        userInfos = UserInfo.objects.all()
        # 构造模板需要的参数
        context = {
            'userInfos': userInfos,
            'ziliaos_page': ziliaos_page,
            'ziliaoName': ziliaoName,
            'userObj_user_name': userObj_user_name,
            'upTime': upTime,
            'shenHeState': shenHeState,
            'shenHeRen': shenHeRen,
            'shenHeTime': shenHeTime,
            'currentPage': self.currentPage,
            'totalPage': self.totalPage,
            'recordNumber': self.recordNumber,
            'startIndex': self.startIndex,
            'pageList': self.pageList,
        }
        # 渲染模板界面
        return render(request, 'Ziliao/ziliao_userFrontquery_result.html', context)


class FrontShowView(View):  # 前台显示客户资料详情页
    def get(self, request, ziliaoId):
        # 查询需要显示的客户资料对象
        ziliao = Ziliao.objects.get(ziliaoId=ziliaoId)
        context = {
            'ziliao': ziliao
        }
        # 渲染模板显示
        return render(request, 'Ziliao/ziliao_frontshow.html', context)


class ListAllView(View): # 前台查询所有客户资料
    def get(self,request):
        ziliaos = Ziliao.objects.all()
        ziliaoList = []
        for ziliao in ziliaos:
            ziliaoObj = {
                'ziliaoId': ziliao.ziliaoId,
                'ziliaoName': ziliao.ziliaoName,
            }
            ziliaoList.append(ziliaoObj)
        return JsonResponse(ziliaoList, safe=False)


class UpdateView(BaseView):  # Ajax方式客户资料更新
    def get(self, request, ziliaoId):
        # GET方式请求查询客户资料对象并返回客户资料json格式
        ziliao = Ziliao.objects.get(ziliaoId=ziliaoId)
        return JsonResponse(ziliao.getJsonObj())

    def post(self, request, ziliaoId):
        # POST方式提交客户资料修改信息更新到数据库
        ziliao = Ziliao.objects.get(ziliaoId=ziliaoId)
        oldShenHeState = ziliao.shenHeState
        ziliao.ziliaoName = request.POST.get('ziliao.ziliaoName')
        ziliaoFileName = self.uploadCommonFile(request, 'ziliao.ziliaoFile')
        if ziliaoFileName != 'file/NoFile.jpg':
            ziliao.ziliaoFile = ziliaoFileName
        ziliao.userObj = UserInfo.objects.get(user_name=request.POST.get('ziliao.userObj.user_name'))
        ziliao.upTime = request.POST.get('ziliao.upTime')
        ziliao.shenHeState = request.POST.get('ziliao.shenHeState')
        ziliao.shenHeRen = request.session.get('username')
        ziliao.shenHeTime = str(datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
        ziliao.xyjf = float(request.POST.get('ziliao.xyjf'))
        ziliao.save()

        if oldShenHeState == '待审核' and ziliao.shenHeState == '审核通过':
            userObj = UserInfo.objects.get(user_name=request.POST.get('ziliao.userObj.user_name'))
            userObj.yhjf = userObj.yhjf + ziliao.xyjf
            if userObj.yhjf < 50:
                userObj.xydj = '一星级'
            elif userObj.yhjf < 100:
                userObj.xydj = '二星级'
            elif userObj.yhjf < 300:
                userObj.xydj = '三星级'
            elif userObj.xydj < 500:
                userObj.xydj = '四星级'
            else:
                userObj.xydj = '五星级'
            userObj.save()


        return JsonResponse({'success': True, 'message': '保存成功'})

class AddView(BaseView):  # 后台客户资料添加
    def get(self,request):
        userInfos = UserInfo.objects.all()  # 获取所有客户
        context = {
            'userInfos': userInfos,
        }

        # 渲染显示模板界面
        return render(request, 'Ziliao/ziliao_add.html', context)

    def post(self, request):
        # POST方式处理图书添加业务
        ziliao = Ziliao() # 新建一个客户资料对象然后获取参数
        ziliao.ziliaoName = request.POST.get('ziliao.ziliaoName')
        ziliao.ziliaoFile = self.uploadCommonFile(request,'ziliao.ziliaoFile')
        ziliao.userObj = UserInfo.objects.get(user_name=request.POST.get('ziliao.userObj.user_name'))
        ziliao.upTime = request.POST.get('ziliao.upTime')
        ziliao.shenHeState = request.POST.get('ziliao.shenHeState')
        ziliao.shenHeRen = request.POST.get('ziliao.shenHeRen')
        ziliao.shenHeTime = request.POST.get('ziliao.shenHeTime')
        ziliao.xyjf = float(request.POST.get('ziliao.xyjf'))
        ziliao.save() # 保存客户资料信息到数据库
        return JsonResponse({'success': True, 'message': '保存成功'})


class BackModifyView(BaseView):  # 后台更新客户资料
    def get(self, request, ziliaoId):
        context = {'ziliaoId': ziliaoId}
        return render(request, 'Ziliao/ziliao_modify.html', context)


class ListView(BaseView):  # 后台客户资料列表
    def get(self, request):
        # 使用模板
        return render(request, 'Ziliao/ziliao_query_result.html')

    def post(self, request):
        # 获取当前要显示第几页和每页几条数据
        self.getPageAndSize(request)
        # 收集查询参数
        ziliaoName = self.getStrParam(request, 'ziliaoName')
        userObj_user_name = self.getStrParam(request, 'userObj.user_name')
        upTime = self.getStrParam(request, 'upTime')
        shenHeState = self.getStrParam(request, 'shenHeState')
        shenHeRen = self.getStrParam(request, 'shenHeRen')
        shenHeTime = self.getStrParam(request, 'shenHeTime')
        # 然后条件组合查询过滤
        ziliaos = Ziliao.objects.all()
        if ziliaoName != '':
            ziliaos = ziliaos.filter(ziliaoName__contains=ziliaoName)
        if userObj_user_name != '':
            ziliaos = ziliaos.filter(userObj=userObj_user_name)
        if upTime != '':
            ziliaos = ziliaos.filter(upTime__contains=upTime)
        if shenHeState != '':
            ziliaos = ziliaos.filter(shenHeState__contains=shenHeState)
        if shenHeRen != '':
            ziliaos = ziliaos.filter(shenHeRen__contains=shenHeRen)
        if shenHeTime != '':
            ziliaos = ziliaos.filter(shenHeTime__contains=shenHeTime)
        # 利用Paginator对查询结果集分页
        self.paginator = Paginator(ziliaos, self.pageSize)
        # 计算总的页码数，要显示的页码列表，总记录等
        self.calculatePages()
        # 获取第page页的Page实例对象
        ziliaos_page = self.paginator.page(self.currentPage)
        # 查询的结果集转换为列表
        ziliaoList = []
        for ziliao in ziliaos_page:
            ziliao = ziliao.getJsonObj()
            ziliaoList.append(ziliao)
        # 构造模板页面需要的参数
        ziliao_res = {
            'rows': ziliaoList,
            'total': self.recordNumber,
        }
        # 渲染模板页面显示
        return JsonResponse(ziliao_res, json_dumps_params={'ensure_ascii':False})

class DeletesView(BaseView):  # 删除客户资料信息
    def get(self, request):
        return self.handle(request)

    def post(self, request):
        return self.handle(request)

    def handle(self, request):
        ziliaoIds = self.getStrParam(request, 'ziliaoIds')
        ziliaoIds = ziliaoIds.split(',')
        count = 0
        try:
            for ziliaoId in ziliaoIds:
                Ziliao.objects.get(ziliaoId=ziliaoId).delete()
                count = count + 1
            message = '%s条记录删除成功！' % count
            success = True
        except Exception as e:
            message = '数据库外键约束删除失败！'
            success = False
        return JsonResponse({'success': success, 'message': message})


class OutToExcelView(BaseView):  # 导出客户资料信息到excel并下载
    def get(self, request):
        # 收集查询参数
        ziliaoName = self.getStrParam(request, 'ziliaoName')
        userObj_user_name = self.getStrParam(request, 'userObj.user_name')
        upTime = self.getStrParam(request, 'upTime')
        shenHeState = self.getStrParam(request, 'shenHeState')
        shenHeRen = self.getStrParam(request, 'shenHeRen')
        shenHeTime = self.getStrParam(request, 'shenHeTime')
        # 然后条件组合查询过滤
        ziliaos = Ziliao.objects.all()
        if ziliaoName != '':
            ziliaos = ziliaos.filter(ziliaoName__contains=ziliaoName)
        if userObj_user_name != '':
            ziliaos = ziliaos.filter(userObj=userObj_user_name)
        if upTime != '':
            ziliaos = ziliaos.filter(upTime__contains=upTime)
        if shenHeState != '':
            ziliaos = ziliaos.filter(shenHeState__contains=shenHeState)
        if shenHeRen != '':
            ziliaos = ziliaos.filter(shenHeRen__contains=shenHeRen)
        if shenHeTime != '':
            ziliaos = ziliaos.filter(shenHeTime__contains=shenHeTime)
        #将查询结果集转换成列表
        ziliaoList = []
        for ziliao in ziliaos:
            ziliao = ziliao.getJsonObj()
            ziliaoList.append(ziliao)
        # 利用pandas实现数据的导出功能
        pf = pd.DataFrame(ziliaoList)
        # 设置要导入到excel的列
        columns_map = {
            'ziliaoId': '资料编号',
            'ziliaoName': '资料名称',
            'userObj': '上传客户',
            'upTime': '上传时间',
            'shenHeState': '审核状态',
            'shenHeRen': '审核人',
            'shenHeTime': '审核时间',
            'xyjf': '信用积分',
        }
        pf = pf[columns_map.keys()]
        pf.rename(columns=columns_map, inplace=True)
        # 将空的单元格替换为空字符
        pf.fillna('', inplace=True)
        #设定文件名和导出路径
        filename = 'ziliaos.xlsx'
        # 这个路径可以在settings中设置也可以直接手动输入
        root_path = settings.MEDIA_ROOT + '/output/'
        file_path = os.path.join(root_path, filename)
        pf.to_excel(file_path, encoding='utf-8', index=False)
        # 将生成的excel文件输出到网页下载
        file = open(file_path, 'rb')
        response = FileResponse(file)
        response['Content-Type'] = 'application/octet-stream'
        response['Content-Disposition'] = 'attachment;filename="ziliaos.xlsx"'
        return response

