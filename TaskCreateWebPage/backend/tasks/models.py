from django.db import models
from django.core.exceptions import ValidationError

# Create your models here.

class Task(models.Model):
    title = models.CharField(max_length=512, null=False)
    description = models.CharField(max_length=512, blank=True, default="")
    status = models.CharField(max_length=512, null=False)
    dueDate = models.DateField()
