from django.contrib import admin
import jgblue.database.models as models

admin.site.register(models.Item)
admin.site.register(models.Spacecraft)
admin.site.register(models.Medal)

