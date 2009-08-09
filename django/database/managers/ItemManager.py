from django.db import models, connection
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
        
        # NOTE: the dictionary  passed into the tables parameter is a custom patch
        # and is not currently in the django revision we're using (r11410)
        q = self.filter(is_latest='1')

        return q

    def set_latest_item(self, item_id):
        cursor = connection.cursor()
        cursor.callproc('set_latest_item', (item_id,))
        ret = int(cursor.fetchone()[0])
        cursor.close()
        return ret

    def set_latest_items(self):
        cursor = connection.cursor()
        cursor.callproc('set_latest_items')
        cursor.close()


