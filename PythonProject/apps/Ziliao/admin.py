from django.contrib import admin
from apps.Ziliao.models import Ziliao

# Register your models here.

admin.site.register(Ziliao,admin.ModelAdmin)