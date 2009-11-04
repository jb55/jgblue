from django.shortcuts import render_to_response
from django.http import HttpResponse
from jgblue.database.util.responses import jgblue_response 
from jgblue.database.util.responses import opensearch_response 
from jgblue.database.util.search import search
from jgblue.database.util.misc import make_tabs_from_results
from jgblue.database.util.misc import make_opensearch_from_results

def index(request):
  tabs = None
  data = {}
  q = request.GET.get("q")
  if q:
    is_opensearch = request.GET.get("os") == ''
    search_results = search(q) 
    if is_opensearch:
      data = make_opensearch_from_results(q, search_results)
      return opensearch_response(data) 
    else:
      tabs = make_tabs_from_results(search_results)
      data["tabs"] = tabs      
      data["is_search"] = True
      return jgblue_response("home/search.htm", data, request)
      

  return jgblue_response("home/index.htm", data, request)
