from django.contrib import admin
from apps.Employee.models import Employee

# Register your models here.

admin.site.register(Employee,admin.ModelAdmin)