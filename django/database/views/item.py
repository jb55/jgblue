from django.http import HttpResponse
from jgblue.database.models.item import *
from jgblue.database.models.image import *
from jgblue.database.util.menu import *
from jgblue.database.util.responses import *
from jgblue.database.util.serialize import *
from jgblue.database.enums import *
from jgblue.database.forms import UploadScreenshotForm
from jgblue.database.util.responses import jgblue_response
from django.views.decorators.cache import cache_page

MAX_VIEW_ITEMS = 200

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
@cache_page(60 * 15)
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

    if items_total < MAX_VIEW_ITEMS:
        items_shown = items_total

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
    data["items_displayed"] = items_shown
    data["items_total"] = items_total
    data["json_items"] = json_items

    return jgblue_response("item/index.htm", data, request)



def detail(request, item_id):

    upload_msg = ""
    type = IMAGE_TARGET_DICT["Item"]

    if request.GET.has_key('upload_ss'):
        upload_msg = upload_screenshot(request, type, item_id) 

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

    data["ss_msg"] = upload_msg
    data["ss_form"] = UploadScreenshotForm()
    data["json_screenshots"] = json_screenshots
    data["menu"] = menu
    data["item"] = item
    data["quickinfo"] = quickinfo
             
    return jgblue_response("item/detail.htm", data, request)
