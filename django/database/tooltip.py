
class TooltipTemplate(object):
    pass

class ItemTooltipTemplate(TooltipTemplate):
    item_tooltip = True
    name = True
    item_class = True
    item_subclass = True
    sell_price = True
    level = True
    mass = True
    size = True

class WeaponTooltipTemplate(ItemTooltipTemplate):
    dps = True
    fire_rate = True
    power_use = True
    damage = True

# item tooltip templates, keyed on class/subclass or just class
ITEM_TOOLTIP_TEMPLATES = {
     0    : WeaponTooltipTemplate,
    (0, 0): WeaponTooltipTemplate,
}

class Tooltip(object):
    
    def __getattr__(self, key):
        """ intercept has_ calls, and look in the template to see if 
            it exists on the current tooltip

            For example:
            tt = Tooltip(template=WeaponTooltipTemplate)
            tt.has_dps
            >>> True
        """

        if key[:4] == "has_":
            has = False
            try: 
                has = getattr(self.template, key[4:])
            except AttributeError:
                has = False
            return has
        else:
            attr = None
            try:
                attr = getattr(self.model, key)
            except AttributeError:
                raise AttributeError
            return attr
            

    def __init__(self, model=None, template=TooltipTemplate, custom_text=""):
        try:
            self.template = getattr(model, "tooltip_template")
        except AttributeError:
            self.template = template
            
        self.custom_text = custom_text
        self.model = model
        


