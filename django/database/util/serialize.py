from django.core import serializers
import simplejson

class SerializeFields():
    Item = ('id', 'name', 'item_class', 'item_subclass', 'level', 'sell_price',
    'power_use', 'size', 'mass', 'fire_rate', 'damage')
    ItemIndex = ('id', 'name', 'item_class', 'item_subclass', 'level',)
    Image = ('id', 'target_id', 'target_type', 'description', 'uuid', 'thumb_uuid', 'resized_uuid')


def serialize(queryset, limit_items, format="json", fields=SerializeFields.Item):
    serializer = serializers.get_serializer("python")()
    final = {}
    final["_total"] = queryset.count()
    final["_displayed"] = limit_items
    items = serializer.serialize(queryset[:limit_items], ensure_ascii=False, fields=fields)
    final["items"] = items
    return simplejson.dumps(final, ensure_ascii=False, separators=(',',':'))

def jsonize(obj):
    return simplejson.dumps(obj, ensure_ascii=False, separators=(',',':'))
