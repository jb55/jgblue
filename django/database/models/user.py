from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, unique=True)

    def __unicode__(self):
        return self.user.name

    class Meta:
        db_table = "user_profile"

