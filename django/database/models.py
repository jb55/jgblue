from django.db import models
import jgblue.database.managers as managers
from jgblue.database.choices import ITEM_CLASS, ITEM_SUBCLASS

#
# the default deicmal digits and places
#
default_digits = 10
default_places = 5

class Item(models.Model):
    uid = models.AutoField(primary_key=True)
    id = models.IntegerField()
    date_added = models.DateTimeField()
    is_latest = models.BooleanField()
    revision_note = models.CharField(max_length=128)
    name = models.CharField(max_length=80)
    item_class = models.IntegerField(choices=ITEM_CLASS)
    item_subclass = models.IntegerField()
    level = models.IntegerField()
    sell_price = models.IntegerField()
    power_use = models.IntegerField()
    size = models.IntegerField()
    mass = models.IntegerField()
    fire_rate = models.IntegerField()
    damage = models.FloatField()

    objects = managers.ItemManager()

    def __unicode__(self):
        return self.name

    class Meta:
        db_table = "item"
        ordering = ['id']

class ItemImage(models.Model):
    id = models.AutoField(primary_key=True)
    item_id = models.IntegerField()
    user_id = models.IntegerField()
    date_added = models.DateTimeField()
    uuid = models.CharField(max_length=32)
    description = models.CharField(max_length=200)
    
    def __unicode__(self):
        return " ".join([self.uuid, self.description])

    class Meta:
        db_table = "item_images"

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


class Spacecraft(models.Model):
    uid = models.AutoField(primary_key=True)
    id = models.IntegerField()
    date_added = models.DateTimeField()
    is_latest = models.BooleanField()
    revision_note = models.CharField(max_length=128)
    name = models.CharField(max_length=80)
    class_id = models.IntegerField()
    size = models.FloatField()
    mass = models.FloatField()
    engines = models.IntegerField()
    max_engine_size = models.IntegerField()
    gun_hardpoints = models.IntegerField()
    missile_hardpoints = models.IntegerField()
    mod_hardpoints = models.IntegerField()
    drag_factor = models.FloatField()
    max_pitch = models.FloatField()
    max_roll = models.FloatField()
    max_yaw = models.FloatField()
    max_cargo = models.FloatField()
    max_pp_size = models.FloatField()
    max_ecm_size = models.FloatField()
    max_shield_size = models.FloatField()
    max_capacitor_size = models.FloatField()
    max_radar_size = models.FloatField()

    def __unicode__(self):
        return self.name

    class Meta():
        db_table = "spacecraft"

    revision_note = models.CharField(max_length=128)
