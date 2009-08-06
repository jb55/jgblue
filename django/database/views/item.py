from django.shortcuts import render_to_response
from django.http import HttpResponse

def index(request):
	return render_to_response("item/index.htm")

def detail(request, item_id):
	
	item = { "name": "Item Placeholder", "level": 5}
			 
	quickinfo = ( 
		{ "label": "Level", 		"value": item["level"] },
		{ "label": "Item Number",	"value": item_id },
		{ "label": "Class", 		"value": "Placeholder Class" },
	)
			 
	data = { "item": item, "quickinfo": quickinfo }
	return render_to_response("item/detail.htm", data)
