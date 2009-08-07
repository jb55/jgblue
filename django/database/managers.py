from django.db import models
from jgblue.database.models import *


class ItemManager(models.Manager):
    
    def get_item(self, id):
        q = self.filter(id__exact=id)

        # I have to do a len() before the limit or it wont return
        # the results in the right order. wtf?
        # TODO: figure out what's going on here
        len(q)
        item = q[0]

        return item

    def get_items(self, page=1, per_page=25):

        # this subquery is used to match the latest item revision when
        # enumerating the entire item database
        subquery = "(select max(uid) uid from item group by id)"
        condition = "item.uid = b.uid"

        # NOTE: the dir passed into the tables parameter is a custom patch
        # and is not currently in the current django trunk (r11410)
        q = self.extra(tables={'b':subquery}, where=[condition])

        return q

    
