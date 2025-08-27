from django.db import models

# Create your models here.

class EmployeeModel(models.Model):
    emp_id = models.AutoField(primary_key=True)
    emp_name = models.CharField(max_length=100)
    emp_role = models.CharField(max_length=100)

    def __str__(self):
        return self.emp_name
     