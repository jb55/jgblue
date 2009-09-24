from django.db import models
from jgblue.database.managers.item import ItemManager
from jgblue.database.enums import *


UNK_CLASS = "Unknown Class (%d)"
UNK_SUBCLASS = "Unknown Subclass (%d)"

def get_class_name(class_id):
    if class_id > len(ITEM_CLASS) or class_id < 0:
        return UNK_CLASS % class_id
    else:
        return ITEM_CLASS[class_id]

def get_subclass_name(class_id, subclass_id):
    class_len = len(ITEM_CLASS)

    if class_id >= class_len:
        return UNK_SUBCLASS % subclass_id

    subclasses = len(ITEM_SUBCLASS)
    if class_id >= subclasses:
        return UNK_SUBCLASS % subclass_id

    subclass_len = len(ITEM_SUBCLASS[class_id])
    if subclass_id >= subclass_len:
        return UNK_SUBCLASS % subclass_id

    return ITEM_SUBCLASS[class_id][subclass_id]

def item_class_choices():
    i = -1
    for item in ITEM_CLASS:
        i += 1
        yield (i, item)


class Item(models.Model):
    uid = models.AutoField(primary_key=True)
    id = models.IntegerField()
    date_added = models.DateTimeField()
    is_latest = models.BooleanField()
    revision_note = models.CharField(max_length=128)
    note = models.CharField(max_length=128)
    name = models.CharField(max_length=80)
    item_class = models.IntegerField(choices=item_class_choices())
    item_subclass = models.IntegerField()
    level = models.IntegerField()
    sell_price = models.IntegerField()
    power_use = models.IntegerField()
    size = models.IntegerField()
    mass = models.IntegerField()
    fire_rate = models.IntegerField()
    damage = models.FloatField()
    
    objects = ItemManager()

    @property
    def smart_serialized_fields(self):
        """ Todo: only return needed fields depending on class """
        return ""

    @property
    def item_class_str(self):
        return ITEM_CLASS[self.item_class]

    @property
    def dps(self):
        return self.damage * self.fire_rate

    @property
    def item_subclass_str(self):
        return get_subclass_name(self.item_class, self.item_subclass)

    def __unicode__(self):
        return self.name

    class Meta:
        db_table = "item"
        ordering = ['id']

