from django.core import serializers
import simplejson

class SerializeFields():
  Item = ('id', 'name', 'item_class', 'item_subclass', 'level', 'sell_price',
  'power_use', 'size', 'mass', 'fire_rate', 'damage')
  ItemIndex = ('id', 'name', 'item_class', 'item_subclass', 'level',)
  Image = ('id', 'target_id', 'target_type', 'description', 'uuid', 'thumb_uuid', 'resized_uuid')

RESULT_SERIALIZE_FIELDS = {
  "items": SerializeFields.ItemIndex,
  "screenshots": SerializeFields.Image,
}

def get_serialize_field_by_id(id):
  return RESULT_SERIALIZE_FIELDS[id]

def serialize(queryset, limit_items, format="json", 
              fields=SerializeFields.Item):
  serializer = serializers.get_serializer("python")()
  final = {}
  final["_total"] = queryset.count()
  if final["_total"] <= limit_items:
    limit_items = final["_total"]
  final["_displayed"] = limit_items
  items = serializer.serialize(queryset[:limit_items], ensure_ascii=False, 
                               fields=fields)
  final["items"] = items
  return simplejson.dumps(final, ensure_ascii=False, separators=(',',':'))

def serialize_opensearch(query, querysets, fields=SerializeFields.Item):
  serializer = serializers.get_serializer("python")()
  final = []
  names = []
  descriptions = []
  urls = []
  final.append(query)
  slots_left = 10

  # only return 10 results for search suggestions
  for queryset in querysets:

    # disabled screenshots for now
    if queryset["id"] == "screenshots":
      continue

    querydata = queryset["data"]
    set_count = querydata.count()
    fields = get_serialize_field_by_id(queryset["id"])
    items = serializer.serialize(querydata[:slots_left], ensure_ascii=False, fields=fields)

    for item in items:
      names.append("%s (%s)" % (item["name"], queryset["id"][:-1].capitalize()))
    if set_count <= slots_left:
      slots_left = slots_left - set_count
    else:
      break

  final = [query, names, descriptions, urls]
  data = simplejson.dumps(final, ensure_ascii=False)
  return data


def jsonize(obj):
  return simplejson.dumps(obj, ensure_ascii=False, separators=(',',':'))
