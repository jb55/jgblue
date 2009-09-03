from django.db import models

UPLOAD_STATUS = (
    (0, "Not Uploaded"),
    (1, "Uploading"),
    (2, "Uploaded"),
)

IMAGE_TARGET = (
    (0, 'Item'),
    (1, 'Medal'),
    (2, 'Spacecraft'),
)

class Image(models.Model):
    id = models.AutoField(primary_key=True)
    target_id = models.IntegerField()
    target_type = models.IntegerField(choices=IMAGE_TARGET)
    user_id = models.IntegerField()
    date_added = models.DateTimeField()
    uuid = models.CharField(max_length=32)
    description = models.CharField(max_length=200, blank=True)
    upload_status = models.IntegerField(choices=UPLOAD_STATUS)
    approved = models.BooleanField()

    def __unicode__(self):
        return " ".join([IMAGE_TARGET[self.target_type][1], self.uuid])

    class Meta():
        db_table = "image"

