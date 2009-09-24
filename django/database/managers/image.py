from django.db import models, connection
from jgblue.database.enums import APPROVAL_STATUS_DICT

class ImageManager(models.Manager):
    
    def get_images(self, id, type, approval_status="Approved"):
        """
        id: target id
        type: target type
        approval_status:
            Pending
            Approved
            Rejected
            All
        """
        kwargs = {}
        if approval_status and approval_status != "All":
            kwargs["approval_status"] = APPROVAL_STATUS_DICT[approval_status]

        q = self.filter(target_id=id, target_type=type, **kwargs)
        return q

    def get_image(self, image_id):
        q = self.filter(id=image_id)
        return q
        
