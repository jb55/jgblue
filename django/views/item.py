from django.shortcuts import render_to_response
from django.http import HttpResponse

def index(request):
	return render_to_response("item/index.htm")

def detail(request, item_id):
	item = {"name": "Item Placeholder",}
	return render_to_response("item/detail.htm", item)