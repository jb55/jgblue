from django.core import serializers
import simplejson

class SerializeFields():
    Item = ('id', 'name', 'item_class', 'item_subclass', 'level', 'sell_price',
    'power_use', 'size', 'mass', 'fire_rate', 'damage')

def serialize(queryset, limit_items, format="json"):
    serializer = serializers.get_serializer("python")()
    final = {}
    final["_total"] = queryset.count()
    final["_displayed"] = limit_items
    items = serializer.serialize(queryset[:limit_items], ensure_ascii=False, fields=SerializeFields.Item)
    final["items"] = items
    return simplejson.dumps(final, ensure_ascii=False, separators=(',',':'))

