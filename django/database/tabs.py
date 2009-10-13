from jgblue.database.enums import CONTROL_TEMPLATES, TAB_LABELS

LISTVIEWS = (
    "items",
    "screenshots",
)

class Tab(object):
    def __init__(self, name, data=""):
        self.name = name

    @property
    def label(self):
        return TAB_LABELS[self.name]

    @property
    def template(self):
        return CONTROL_TEMPLATES["controls"][self.name]
        

class Tabs(object):
    def __init__(self, tabs=[]):
        self.tabs = []
        self.tab_data = {}
        for tab in tabs:
            self.add_tab(tab)

    def __iter__(self):
        for tab in self.tabs:
            yield tab

    def add_tab(self, name, data=""):
        self.tabs.append(Tab(name))
        self.tab_data[name] = data

    def bind_data(self, name, data):
        self.tab_data[name] = data

    @property
    def listviews(self):
        return [tab.name for tab in self.tabs if tab.name in LISTVIEWS]

    @property
    def js_vars(self):
        for tab in self.tabs:
            yield "".join(["var g_", tab.name, " = ", self.tab_data[tab.name], ";"])

