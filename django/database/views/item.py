from django.shortcuts import render_to_response
from django.http import HttpResponse
from jgblue.database.models.item import Item

def json_response(data):
    return HttpResponse(''.join(['({"items":',data,'})']), mimetype='application/x-javascript; charset=utf-8')

def index(request):
    
    if bool(request.REQUEST.get('json')):
        json_items = Item.objects.get_items(json=True)
        return json_response(json_items)

    return render_to_response("item/index.htm")

def detail(request, item_id):
    
    if bool(request.REQUEST.get('json')):
       json_item = Item.objects.get_item(item_id, json=True)
       return json_response(json_item) 

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
