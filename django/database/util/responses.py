from django.http import HttpResponse

def json_response(data):
    return HttpResponse(''.join(['({"items":',data,'})']), mimetype='application/x-javascript; charset=utf-8')

