from django.db import models, connection
from django.core import serializers
from jgblue.database.models import *

FORMATS = ('xml', 'json')

class ItemManager(models.Manager):
    serializer = serializers.get_serializer("json")()
    
    def get_item(self, id, json=False):
        q = self.filter(id=id, is_latest=1)

        # I have to do a len() before the limit or it wont return
        # the results in the right order. wtf?
        # TODO: figure out what's going on here
        l = len(q)
        if l == 0:
            return None

        item = q[0]
        if not json:
            return item
        else:
            return self.serializer.serialize(q, ensure_ascii=False )


    def get_items(self, category=(-1,-1), page=1, per_page=25, json=False):

        cat_filter = {}
        if category[0] != -1:
            cat_filter["item_class"] = category[0]
            if len(category) >= 2:
                if category[1] != -1:
                    cat_filter["item_subclass"] = category[1]
        
        q = self.filter(is_latest=1,**cat_filter)

        if not json:
            return q
        else:
            return self.serializer.serialize(q, ensure_ascii=False)

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


