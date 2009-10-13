from django.http import HttpResponse, HttpResponseRedirect
from jgblue.database.models.item import *
from jgblue.database.models.image import *
from jgblue.database.util.menu import *
from jgblue.database.util.responses import *
from jgblue.database.util.serialize import *
from jgblue.database.enums import *
from jgblue.database.forms import UploadScreenshotForm
from jgblue.database.util.responses import jgblue_response
from jgblue.database.tabs import Tabs


def get_item_args(has_cls, has_subcls, cls, subcls):
    kwargs = {}
    category = []

    if has_cls:
        category.append(cls)
        if has_subcls:
            category.append(subcls)

    if len(category) > 0:
        kwargs["category"] = category

    return kwargs
    

# /items/cls.subcls
def index(request, cls, subcls):

    has_cls = cls != ""
    has_subcls = subcls != ""

    if has_cls:
        cls = int(cls)
    if has_subcls:
        subcls = int(subcls)

    # for for filtering in Item.objects.get_items
    kwargs = get_item_args(has_cls, has_subcls, cls, subcls)

    # item counts
    items = Item.objects.get_items(**kwargs)
    items_total = items.count()
    items_shown = MAX_VIEW_ITEMS

    # json_items, used in the main page
    json_items = serialize(items, items_shown, fields=SerializeFields.ItemIndex)

    # serialization for format=json, etc
    format = request.REQUEST.get('format') 
    if bool(format):
        serialized_items = serialize(items, items_shown, format=format)
        return serialized_response(serialized_items, format)

    data = {}
    menu = build_item_context(cls, subcls)

    data["menu"] = menu
    data["precalc_lv_note"] = True
    data["items_displayed"] = items_shown
    data["items_total"] = items_total
    data["json_items"] = json_items

    return jgblue_response("item/index.htm", data, request)



def detail(request, item_id):

    upload_msg = ""
    type = IMAGE_TARGET_DICT["Item"]

    # handle screenshot uploads
    if request.GET.has_key('upload_ss'):
        upload_screenshot(request, type, item_id) 
        return HttpResponseRedirect("/item/" + item_id + "#uploaded");

    format = request.REQUEST.get('format')

    # individual item serialization
    if bool(format):
       serialized_item = serialize(Item.objects.get_item(item_id), 1, format=format)
       return serialized_response(serialized_item, format) 

    # grab an Item reference
    item = Item.objects.get_item(item_id)[0]

    data = {}
    data["itemid"] = item_id

    if item == None:
        data["menu"] = build_root_context("items")
        return render_to_response("item/notfound.htm", data)

    # quick info box
    quickinfo = (
        ("Item Number", item_id),
        ("Note", item.note),
        ("Revision Note", item.revision_note),
    )

    screenshots = Image.objects.get_images(item_id, type, "Approved");
    screenshots_shown = screenshots.count()

    # json_items, used in the main page
    json_screenshots = serialize(screenshots, screenshots_shown, fields=SerializeFields.Image)

    # build breadcrumb context menu
    menu = build_item_context(item.item_class, item.item_subclass, item)

    # build tabs
    tabs = Tabs(["screenshots", "comments", "items"])
    tabs.bind_data("screenshots", json_screenshots)
    tabs.bind_data("comments", "undefined")
    tabs.bind_data("items", serialize(Item.objects.get_item(item_id), 1, fields=SerializeFields.ItemIndex))

    data["ss_form"] = UploadScreenshotForm()
    data["menu"] = menu
    data["item"] = item
    data["tooltip"] = Tooltip(item)
    data["tabs"] = tabs
    data["quickinfo"] = quickinfo
    data["has_3d"] = True
             
    return jgblue_response("item/detail.htm", data, request)
