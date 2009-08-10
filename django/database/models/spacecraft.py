from django.db import models

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

