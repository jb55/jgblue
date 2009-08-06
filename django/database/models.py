from django.db import models

#
# the default deicmal digits and places
#
default_digits = 10
default_places = 5

class Item(models.Model):
    uid = models.AutoField(primary_key=True)
    id = models.IntegerField()
    date_added = models.DateTimeField()
    name = models.CharField(max_length=80)

    def __unicode__(self):
        return self.name

    class Meta:
        db_table = "item"

class Medal(models.Model):
    uid = models.AutoField(primary_key=True)
    id = models.IntegerField()
    date_added = models.DateTimeField()
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


class Spacecraft(models.Model):
    uid = models.AutoField(primary_key=True)
    id = models.IntegerField()
    date_added = models.DateTimeField()
    name = models.CharField(max_length=80)
    class_id = models.IntegerField()
    size = models.FloatField()
    mass = models.FloatField()
    engines = models.IntegerField()
    max_engine_size = models.IntegerField()
    gun_hardpoints = models.IntegerField()
    missile_hardpoints = models.IntegerField()
    modx_hardpoints = models.IntegerField()
    drag_factor = models.FloatField()
    max_pitch = models.FloatField()
    max_roll = models.FloatField()
    max_yaw = models.FloatField()
    max_cargo = models.FloatField()
    max_pp_size = models.FloatField()
    max_radar_size = models.FloatField()
    max_ecm_size = models.FloatField()
    max_shield_size = models.FloatField()
    max_capacitor_size = models.FloatField()

    def __unicode__(self):
        return self.name

    class Meta():
        db_table = "spacecraft"

