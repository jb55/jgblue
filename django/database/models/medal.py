from django.db import models

class Medal(models.Model):
    uid = models.AutoField(primary_key=True)
    id = models.IntegerField()
    date_added = models.DateTimeField()
    is_latest = models.BooleanField()
    revision_note = models.CharField(max_length=128)
    name = models.CharField(max_length=80)
    type = models.IntegerField()
    experience = models.IntegerField()
    flavor_text = models.CharField(max_length=512)
    description = models.CharField(max_length=512)
    requirement_1 = models.CharField(max_length=128)
    requirement_2 = models.CharField(max_length=128)
    requirement_3 = models.CharField(max_length=128)

    def __unicode__(self):
        return self.name

    class Meta:
        db_table = "medal"

