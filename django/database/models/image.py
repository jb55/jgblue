from django.db import models
from datetime import datetime

APPROVAL_STATUS = (
    (0, "Pending"),
    (1, "Approved"),
    (2, "Rejected"),
)

IMAGE_TARGET = (
    (0, 'Item'),
    (1, 'Medal'),
    (2, 'Spacecraft'),
)

IMAGE_TARGET_DICT = {
    "Item": 0,
    "Medal": 1,
    "Spacecraft": 2,
}

class Image(models.Model):
    id = models.AutoField(primary_key=True)
    target_id = models.IntegerField()
    target_type = models.IntegerField(choices=IMAGE_TARGET)
    user_id = models.IntegerField()
    date_added = models.DateTimeField()
    uuid = models.CharField(max_length=42)
    thumb_uuid = models.CharField(max_length=42)
    resized_uuid = models.CharField(max_length=42)
    description = models.CharField(max_length=200, blank=True)
    approval_status = models.IntegerField(choices=APPROVAL_STATUS)
    rejected_reason = models.CharField(max_length=200, blank=True)

    @classmethod
    def create(cls, uuid, thumb_uuid, resized_uuid, type, id, user_id=1, description="", 
                date_added=None, approval_status=APPROVAL_STATUS[0][0]):
        if not date_added:
            date_added = datetime.now()
        img = Image()
        img.uuid = uuid
        img.thumb_uuid = thumb_uuid
        img.resized_uuid = resized_uuid
        img.target_type = type
        img.target_id = id
        img.date_added = date_added
        img.user_id = user_id
        img.approval_status = approval_status
        img.description = description
        return img

    def __unicode__(self):
        return " ".join([IMAGE_TARGET[self.target_type][1], self.uuid])

    class Meta():
        db_table = "image"

