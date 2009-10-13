import uuid
from jgblue.database.tabs import Tabs
from jgblue.database.enums import MAX_VIEW_ITEMS
from jgblue.database.util.serialize import *

def gen_uuid():
    return str(uuid.uuid4()).replace('-','')

def user_msg(message, request, **kwargs):
    request.user.message_set.create(message=message, **kwargs)

def make_thumbnail(src, dest, size=(192,192)):
    """
    makes a thumbnail of a given file 

    src: source filename
    dest: destination filename
    size: constrain size
    """
    from PIL import Image as PImage

    im = PImage.open(src)
    im.thumbnail(size, PImage.ANTIALIAS)
    im.save(dest)

def make_tabs_from_results(results):
    tabs = Tabs()
    for result in results.sets:
        fields = get_serialize_field_by_id(result["id"])
        serialized_data = serialize(result["data"], MAX_VIEW_ITEMS, fields=fields)
        tabs.add_tab(result["id"], serialized_data)
    return tabs
