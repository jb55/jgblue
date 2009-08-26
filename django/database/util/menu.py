from jgblue.database.models.item import get_class_name, get_subclass_name

class ContextMenu():
    
    def __init__(self, items=[]):
        self.items = [{"name":"Database", "link":None}]
        self.items.extend(items)

    def __iter__(self):
        for item in self.items:
            yield item

    def add_item(self, name, link=None):
        self.items.append({"name":name, "link":link})

    def iter_render_item(self):
        render = ""
        add = ""
        i = 0
        for item in self.items:
            if item[1] != None:
                render = '<a href="%s">%s</a>' % (item[1],item[0])
            else:
                render = item[0]

            if i == 0:
                add = ' class="first"'
            else:
                add = ""

            render = ''.join(('<li%s>' % add,render,'</li>'))
            yield render


def build_root_context(root, name=""):

    menu = ContextMenu()
    
    if not name:
        name = root.capitalize()

    menu.add_item(name, "/%s" % root)

def build_item_context(cls, subcls):

    has_cls = cls != ""
    has_subcls = subcls != ""

    menu = build_root_context()

    if has_cls:
        menu.add_item(get_class_name(cls), ''.join(["/items/",str(cls)]))
        if has_subcls:
            menu.add_item(get_subclass_name(cls, subcls), ''.join(["/items/",str(cls),".",str(subcls)]))

    return menu



