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
