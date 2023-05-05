from django.db import models


class UserInfo(models.Model):
    user_name = models.CharField(max_length=30, default='', primary_key=True, verbose_name='客户编号')
    password = models.CharField(max_length=30, default='', verbose_name='登录密码')
    name = models.CharField(max_length=20, default='', verbose_name='客户名称')
    xydj = models.CharField(max_length=20, default='', verbose_name='信用等级')
    userPhoto = models.ImageField(upload_to='img', max_length='100', verbose_name='客户照片')
    telephone = models.CharField(max_length=20, default='', verbose_name='联系电话')
    email = models.CharField(max_length=50, default='', verbose_name='联系邮箱')
    address = models.CharField(max_length=80, default='', verbose_name='客户地址')
    yhjf = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='用户积分')
    regTime = models.CharField(max_length=20, default='', verbose_name='注册时间')

    class Meta:
        db_table = 't_UserInfo'
        verbose_name = '客户信息'
        verbose_name_plural = verbose_name

    def getJsonObj(self):
        userInfo = {
            'user_name': self.user_name,
            'password': self.password,
            'name': self.name,
            'xydj': self.xydj,
            'userPhoto': self.userPhoto.url,
            'telephone': self.telephone,
            'email': self.email,
            'address': self.address,
            'yhjf': self.yhjf,
            'regTime': self.regTime,
        }
        return userInfo

