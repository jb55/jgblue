from django.shortcuts import render_to_response
from django.http import HttpResponse
from jgblue.database.models.item import Item

def index(request):
    return render_to_response("item/index.htm")

def detail(request, item_id):
    
    item = Item.objects.get_item(item_id)

    data = {}
    data["itemid"] = item_id

    if item == None:
        return render_to_response("item/notfound.htm", data)

    quickinfo = (
        ("Item Number", item_id),
        ("Note", item.note),
        ("Revision Note", item.revision_note),
    )

    data["item"] = item
    data["quickinfo"] = quickinfo
             
    return render_to_response("item/detail.htm", data)
