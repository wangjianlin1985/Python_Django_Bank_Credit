from django.db import models


class Employee(models.Model):
    employeeNo = models.CharField(max_length=30, default='', primary_key=True, verbose_name='员工编号')
    password = models.CharField(max_length=30, default='', verbose_name='登录密码')
    name = models.CharField(max_length=20, default='', verbose_name='员工姓名')
    gender = models.CharField(max_length=4, default='', verbose_name='性别')
    inDate = models.CharField(max_length=20, default='', verbose_name='入职日期')
    empPhoto = models.ImageField(upload_to='img', max_length='100', verbose_name='员工照片')
    telephone = models.CharField(max_length=20, default='', verbose_name='联系电话')
    email = models.CharField(max_length=50, default='', verbose_name='邮箱')
    address = models.CharField(max_length=80, default='', verbose_name='家庭地址')

    class Meta:
        db_table = 't_Employee'
        verbose_name = '员工信息'
        verbose_name_plural = verbose_name

    def getJsonObj(self):
        employee = {
            'employeeNo': self.employeeNo,
            'password': self.password,
            'name': self.name,
            'gender': self.gender,
            'inDate': self.inDate,
            'empPhoto': self.empPhoto.url,
            'telephone': self.telephone,
            'email': self.email,
            'address': self.address,
        }
        return employee

