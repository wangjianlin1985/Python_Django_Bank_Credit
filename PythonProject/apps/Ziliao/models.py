from django.db import models
from apps.UserInfo.models import UserInfo


class Ziliao(models.Model):
    ziliaoId = models.AutoField(primary_key=True, verbose_name='资料编号')
    ziliaoName = models.CharField(max_length=20, default='', verbose_name='资料名称')
    ziliaoFile = models.FileField(upload_to='file', max_length='100', verbose_name='资料文件')
    userObj = models.ForeignKey(UserInfo,  db_column='userObj', on_delete=models.PROTECT, verbose_name='上传客户')
    upTime = models.CharField(max_length=20, default='', verbose_name='上传时间')
    shenHeState = models.CharField(max_length=20, default='', verbose_name='审核状态')
    shenHeRen = models.CharField(max_length=20, default='', verbose_name='审核人')
    shenHeTime = models.CharField(max_length=20, default='', verbose_name='审核时间')
    xyjf = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='信用积分')

    class Meta:
        db_table = 't_Ziliao'
        verbose_name = '客户资料信息'
        verbose_name_plural = verbose_name

    def getJsonObj(self):
        ziliao = {
            'ziliaoId': self.ziliaoId,
            'ziliaoName': self.ziliaoName,
            'ziliaoFile': self.ziliaoFile.url,
            'userObj': self.userObj.name,
            'userObjPri': self.userObj.user_name,
            'upTime': self.upTime,
            'shenHeState': self.shenHeState,
            'shenHeRen': self.shenHeRen,
            'shenHeTime': self.shenHeTime,
            'xyjf': self.xyjf,
        }
        return ziliao

