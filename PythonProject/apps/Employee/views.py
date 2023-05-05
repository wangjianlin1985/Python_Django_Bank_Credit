from django.views.generic import View
from apps.BaseView import BaseView
from django.shortcuts import render
from django.core.paginator import Paginator
from apps.Employee.models import Employee
from django.http import JsonResponse
from django.http import FileResponse
from apps.BaseView import ImageFormatException
from django.conf import settings
import pandas as pd
import os


class FrontAddView(BaseView):  # 前台员工添加
    def primaryKeyExist(self, employeeNo):  # 判断主键是否存在
        try:
            Employee.objects.get(employeeNo=employeeNo)
            return True
        except Employee.DoesNotExist:
            return False

    def get(self,request):

        # 使用模板
        return render(request, 'Employee/employee_frontAdd.html')

    def post(self, request):
        employeeNo = request.POST.get('employee.employeeNo') # 判断员工编号是否存在
        if self.primaryKeyExist(employeeNo):
            return JsonResponse({'success': False, 'message': '员工编号已经存在'})

        employee = Employee() # 新建一个员工对象然后获取参数
        employee.employeeNo = employeeNo
        employee.password = request.POST.get('employee.password')
        employee.name = request.POST.get('employee.name')
        employee.gender = request.POST.get('employee.gender')
        employee.inDate = request.POST.get('employee.inDate')
        try:
            employee.empPhoto = self.uploadImageFile(request,'employee.empPhoto')
        except ImageFormatException as ife:
            return JsonResponse({'success': False, 'message': ife.error})
        employee.telephone = request.POST.get('employee.telephone')
        employee.email = request.POST.get('employee.email')
        employee.address = request.POST.get('employee.address')
        employee.save() # 保存员工信息到数据库
        return JsonResponse({'success': True, 'message': '保存成功'})


class FrontModifyView(BaseView):  # 前台修改员工
    def get(self, request, employeeNo):
        context = {'employeeNo': employeeNo}
        return render(request, 'Employee/employee_frontModify.html', context)


class FrontListView(BaseView):  # 前台员工查询列表
    def get(self, request):
        return self.handle(request)

    def post(self, request):
        return self.handle(request)

    def handle(self, request):
        self.getCurrentPage(request)  # 获取当前要显示第几页
        # 下面获取查询参数
        employeeNo = self.getStrParam(request, 'employeeNo')
        name = self.getStrParam(request, 'name')
        inDate = self.getStrParam(request, 'inDate')
        telephone = self.getStrParam(request, 'telephone')
        # 然后条件组合查询过滤
        employees = Employee.objects.all()
        if employeeNo != '':
            employees = employees.filter(employeeNo__contains=employeeNo)
        if name != '':
            employees = employees.filter(name__contains=name)
        if inDate != '':
            employees = employees.filter(inDate__contains=inDate)
        if telephone != '':
            employees = employees.filter(telephone__contains=telephone)
        # 对查询结果利用Paginator进行分页
        self.paginator = Paginator(employees, self.pageSize)
        # 计算总的页码数，要显示的页码列表，总记录等
        self.calculatePages()
        # 获取第page页的Page实例对象
        employees_page = self.paginator.page(self.currentPage)

        # 构造模板需要的参数
        context = {
            'employees_page': employees_page,
            'employeeNo': employeeNo,
            'name': name,
            'inDate': inDate,
            'telephone': telephone,
            'currentPage': self.currentPage,
            'totalPage': self.totalPage,
            'recordNumber': self.recordNumber,
            'startIndex': self.startIndex,
            'pageList': self.pageList,
        }
        # 渲染模板界面
        return render(request, 'Employee/employee_frontquery_result.html', context)


class FrontShowView(View):  # 前台显示员工详情页
    def get(self, request, employeeNo):
        # 查询需要显示的员工对象
        employee = Employee.objects.get(employeeNo=employeeNo)
        context = {
            'employee': employee
        }
        # 渲染模板显示
        return render(request, 'Employee/employee_frontshow.html', context)


class ListAllView(View): # 前台查询所有员工
    def get(self,request):
        employees = Employee.objects.all()
        employeeList = []
        for employee in employees:
            employeeObj = {
                'employeeNo': employee.employeeNo,
                'name': employee.name,
            }
            employeeList.append(employeeObj)
        return JsonResponse(employeeList, safe=False)


class UpdateView(BaseView):  # Ajax方式员工更新
    def get(self, request, employeeNo):
        # GET方式请求查询员工对象并返回员工json格式
        employee = Employee.objects.get(employeeNo=employeeNo)
        return JsonResponse(employee.getJsonObj())

    def post(self, request, employeeNo):
        # POST方式提交员工修改信息更新到数据库
        employee = Employee.objects.get(employeeNo=employeeNo)
        employee.password = request.POST.get('employee.password')
        employee.name = request.POST.get('employee.name')
        employee.gender = request.POST.get('employee.gender')
        employee.inDate = request.POST.get('employee.inDate')
        try:
            empPhotoName = self.uploadImageFile(request, 'employee.empPhoto')
        except ImageFormatException as ife:
            return JsonResponse({'success': False, 'message': ife.error})
        if empPhotoName != 'img/NoImage.jpg':
            employee.empPhoto = empPhotoName
        employee.telephone = request.POST.get('employee.telephone')
        employee.email = request.POST.get('employee.email')
        employee.address = request.POST.get('employee.address')
        employee.save()
        return JsonResponse({'success': True, 'message': '保存成功'})

class AddView(BaseView):  # 后台员工添加
    def primaryKeyExist(self, employeeNo):  # 判断主键是否存在
        try:
            Employee.objects.get(employeeNo=employeeNo)
            return True
        except Employee.DoesNotExist:
            return False

    def get(self,request):

        # 渲染显示模板界面
        return render(request, 'Employee/employee_add.html')

    def post(self, request):
        # POST方式处理图书添加业务
        employeeNo = request.POST.get('employee.employeeNo') # 判断员工编号是否存在
        if self.primaryKeyExist(employeeNo):
            return JsonResponse({'success': False, 'message': '员工编号已经存在'})

        employee = Employee() # 新建一个员工对象然后获取参数
        employee.employeeNo = employeeNo
        employee.password = request.POST.get('employee.password')
        employee.name = request.POST.get('employee.name')
        employee.gender = request.POST.get('employee.gender')
        employee.inDate = request.POST.get('employee.inDate')
        try:
            employee.empPhoto = self.uploadImageFile(request,'employee.empPhoto')
        except ImageFormatException as ife:
            return JsonResponse({'success': False, 'message': ife.error})
        employee.telephone = request.POST.get('employee.telephone')
        employee.email = request.POST.get('employee.email')
        employee.address = request.POST.get('employee.address')
        employee.save() # 保存员工信息到数据库
        return JsonResponse({'success': True, 'message': '保存成功'})


class BackModifyView(BaseView):  # 后台更新员工
    def get(self, request, employeeNo):
        context = {'employeeNo': employeeNo}
        return render(request, 'Employee/employee_modify.html', context)

class BackSelfModifyView(BaseView):  # 后台更新员工
    def get(self, request):
        context = {'employeeNo':  request.session.get('username')}
        return render(request, 'Employee/employee_modify.html',context)


class ListView(BaseView):  # 后台员工列表
    def get(self, request):
        # 使用模板
        return render(request, 'Employee/employee_query_result.html')

    def post(self, request):
        # 获取当前要显示第几页和每页几条数据
        self.getPageAndSize(request)
        # 收集查询参数
        employeeNo = self.getStrParam(request, 'employeeNo')
        name = self.getStrParam(request, 'name')
        inDate = self.getStrParam(request, 'inDate')
        telephone = self.getStrParam(request, 'telephone')
        # 然后条件组合查询过滤
        employees = Employee.objects.all()
        if employeeNo != '':
            employees = employees.filter(employeeNo__contains=employeeNo)
        if name != '':
            employees = employees.filter(name__contains=name)
        if inDate != '':
            employees = employees.filter(inDate__contains=inDate)
        if telephone != '':
            employees = employees.filter(telephone__contains=telephone)
        # 利用Paginator对查询结果集分页
        self.paginator = Paginator(employees, self.pageSize)
        # 计算总的页码数，要显示的页码列表，总记录等
        self.calculatePages()
        # 获取第page页的Page实例对象
        employees_page = self.paginator.page(self.currentPage)
        # 查询的结果集转换为列表
        employeeList = []
        for employee in employees_page:
            employee = employee.getJsonObj()
            employeeList.append(employee)
        # 构造模板页面需要的参数
        employee_res = {
            'rows': employeeList,
            'total': self.recordNumber,
        }
        # 渲染模板页面显示
        return JsonResponse(employee_res, json_dumps_params={'ensure_ascii':False})

class DeletesView(BaseView):  # 删除员工信息
    def get(self, request):
        return self.handle(request)

    def post(self, request):
        return self.handle(request)

    def handle(self, request):
        employeeNos = self.getStrParam(request, 'employeeNos')
        employeeNos = employeeNos.split(',')
        count = 0
        try:
            for employeeNo in employeeNos:
                Employee.objects.get(employeeNo=employeeNo).delete()
                count = count + 1
            message = '%s条记录删除成功！' % count
            success = True
        except Exception as e:
            message = '数据库外键约束删除失败！'
            success = False
        return JsonResponse({'success': success, 'message': message})


class OutToExcelView(BaseView):  # 导出员工信息到excel并下载
    def get(self, request):
        # 收集查询参数
        employeeNo = self.getStrParam(request, 'employeeNo')
        name = self.getStrParam(request, 'name')
        inDate = self.getStrParam(request, 'inDate')
        telephone = self.getStrParam(request, 'telephone')
        # 然后条件组合查询过滤
        employees = Employee.objects.all()
        if employeeNo != '':
            employees = employees.filter(employeeNo__contains=employeeNo)
        if name != '':
            employees = employees.filter(name__contains=name)
        if inDate != '':
            employees = employees.filter(inDate__contains=inDate)
        if telephone != '':
            employees = employees.filter(telephone__contains=telephone)
        #将查询结果集转换成列表
        employeeList = []
        for employee in employees:
            employee = employee.getJsonObj()
            employeeList.append(employee)
        # 利用pandas实现数据的导出功能
        pf = pd.DataFrame(employeeList)
        # 设置要导入到excel的列
        columns_map = {
            'employeeNo': '员工编号',
            'name': '员工姓名',
            'gender': '性别',
            'inDate': '入职日期',
            'telephone': '联系电话',
            'email': '邮箱',
        }
        pf = pf[columns_map.keys()]
        pf.rename(columns=columns_map, inplace=True)
        # 将空的单元格替换为空字符
        pf.fillna('', inplace=True)
        #设定文件名和导出路径
        filename = 'employees.xlsx'
        # 这个路径可以在settings中设置也可以直接手动输入
        root_path = settings.MEDIA_ROOT + '/output/'
        file_path = os.path.join(root_path, filename)
        pf.to_excel(file_path, encoding='utf-8', index=False)
        # 将生成的excel文件输出到网页下载
        file = open(file_path, 'rb')
        response = FileResponse(file)
        response['Content-Type'] = 'application/octet-stream'
        response['Content-Disposition'] = 'attachment;filename="employees.xlsx"'
        return response

