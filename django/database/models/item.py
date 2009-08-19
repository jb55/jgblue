from django.db import models
import jgblue.database.managers as managers

ITEM_CLASS = (
    'Gun',
    'Missile',
    'Shield',
    'Power Plant',
    'Armor',
    'Radar',
    'Engine',
    'Mining',
    'Mod',
)

ITEM_GUN_CLASS = (
    'Electron Gun',
)

ITEM_SUBCLASS = (
    ITEM_GUN_CLASS,
)

IMAGE_TARGET = (
    (1, 'Item'),
    (2, 'Medal'),
    (3, 'Spacecraft'),
)

def get_subclass_name(class_id, subclass_id):
    class_len = len(ITEM_CLASS)
    subclass_len = len(ITEM_SUBCLASS)

    if class_id >= class_len or subclass_id >= subclass_len:
        return "Unknown Subclass"

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
    revision_note = models.CharField(max_length=128, blank=True)
    note = models.CharField(max_length=128, blank=True)
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

    objects = managers.ItemManager()

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

class ItemImage(models.Model):
    id = models.AutoField(primary_key=True)
    target_id = models.IntegerField()
    target_type = models.IntegerField(choices=IMAGE_TARGET)
    user_id = models.IntegerField()
    date_added = models.DateTimeField()
    uuid = models.CharField(max_length=32)
    description = models.CharField(max_length=200)
    
    def __unicode__(self):
        return " ".join([self.uuid, self.description])

    class Meta:
        db_table = "item_images"

