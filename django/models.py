from django.db import models

class Item(models.Model):
    uid = models.IntegerField()
    id = models.IntegerField()
    date_added = models.DateField()
    name = models.CharField(max_length=80)

