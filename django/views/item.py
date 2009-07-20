from django.shortcuts import render_to_response
from django.http import HttpResponse

def index(request):
	return render_to_response("item/index.htm")

def detail(request, item_id):
	quickinfo = ( 
		{ "label": "Item Number", "value": item_id },
	)
	
	item = { "name": "Item Placeholder",
			 "quickinfo": quickinfo, }
			 
	data = { "item": item }
	return render_to_response("item/detail.htm", data)