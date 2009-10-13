from django.db import models, connection
from django.core import serializers

class ItemManager(models.Manager):
    
    def get_item(self, id):
        q = self.filter(id=id, is_latest=1)
        return q;

    def search_item_name(self, search):
        return self.filter(name__icontains=search, is_latest=1)

    def get_items(self, category=(-1,-1), page=1, per_page=25):
        cat_filter = {}
        if category[0] != -1:
            cat_filter["item_class"] = category[0]
            if len(category) >= 2:
                if category[1] != -1:
                    cat_filter["item_subclass"] = category[1]
        
        q = self.filter(is_latest=1,**cat_filter)
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


