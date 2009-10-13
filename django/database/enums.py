###############################
# Items
#
ITEM_CLASS = (
    'Gun',
    'Missile',
    'Shield',
    'Power Plant',
    'Armor',
    'Radar',
    'Engine',
    'Mining',
    'Mod',
)

ITEM_GUN_CLASS = (
    'Electron Gun',
)

ITEM_SUBCLASS = (
    ITEM_GUN_CLASS,
)

MAX_VIEW_ITEMS = 200

################################ 
# Images
#
APPROVAL_STATUS = (
    (0, "Pending"),
    (1, "Approved"),
    (2, "Rejected"),
)

APPROVAL_STATUS_DICT = {
    "Pending": 0,
    "Approved": 1,
    "Rejected": 2,
}

IMAGE_TARGET = (
    (0, 'Item'),
    (1, 'Medal'),
    (2, 'Spacecraft'),
)

IMAGE_TARGET_DICT = {
    "Item": 0,
    "Medal": 1,
    "Spacecraft": 2,
}


##
# OTHER
#
CONTROL_TEMPLATES = {
    "controls": {
        "items": "controls/items.htm",
        "screenshots": "controls/screenshots.htm",
        "comments": "controls/comments.htm",
        "tabs": "controls/tabs.htm",
    },
}

TAB_LABELS = {
    "items": "Items",
    "screenshots": "Screenshots",
    "comments": "Comments",
}
