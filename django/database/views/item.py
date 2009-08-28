from django.shortcuts import render_to_response
from django.http import HttpResponse
from jgblue.database.models.item import *
from jgblue.database.util.menu import *
from jgblue.database.util.responses import json_response

# /items/cls.subcls
def index(request, cls, subcls):

    has_cls = cls != ""
    has_subcls = subcls != ""

    if has_cls:
        cls = int(cls)
    if has_subcls:
        subcls = int(subcls)

    kwargs = {}
    category = []

    if has_cls:
        category.append(cls)
        if has_subcls:
            category.append(subcls)

    if len(category) > 0:
        kwargs["category"] = category

    json_items = Item.objects.get_items(json=True, **kwargs)

    if bool(request.REQUEST.get('json')):
        return json_response(json_items)

    data = {}
    menu = build_item_context(cls, subcls)

    data["menu"] = menu
    data["json_items"] = "".join(["{items:",json_items,"}"])

    return render_to_response("item/index.htm", data)



def detail(request, item_id):
    
    if bool(request.REQUEST.get('json')):
       json_item = Item.objects.get_item(item_id, json=True)
       return json_response(json_item) 

    item = Item.objects.get_item(item_id)

    data = {}
    data["itemid"] = item_id

    if item == None:
        data["menu"] = build_root_context("items")
        return render_to_response("item/notfound.htm", data)

    quickinfo = (
        ("Item Number", item_id),
        ("Note", item.note),
        ("Revision Note", item.revision_note),
    )

    menu = build_item_context(item.item_class, item.item_subclass)

    data["menu"] = menu
    data["item"] = item
    data["quickinfo"] = quickinfo
             
    return render_to_response("item/detail.htm", data)
