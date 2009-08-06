from django.db import models

class Item(models.Model):
    uid = models.IntegerField(primary_key=True)
    id = models.IntegerField()
    date_added = models.DateField()
    name = models.CharField(max_length=80)

    def __unicode__(self):
        return self.name

    class Meta:
        db_table = "item"

