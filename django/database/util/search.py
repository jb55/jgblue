from jgblue.database.models.item import Item
from jgblue.database.models.image import Image

class SearchResults(object):
    """
    Our search result object, stores result sets
    from different tables. We will serialize these
    result sets and bind their data to a tab control
    for the search result page.
    """
    def __init__(self, sets=[]):
        # result sets
        sets = []
        self.sets = sets

    def add_set(self, data, id):
        if len(data) != 0:
            self.sets.append({"data": data, "id": id})
    

def search(q):
    results = SearchResults()
    items = Item.objects.search_item_name(q)
    screens = Image.objects.filter(description__icontains=q)

    results.add_set(items, "items")
    results.add_set(screens, "screenshots")

    return results


