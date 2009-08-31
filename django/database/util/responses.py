from django.http import HttpResponse

def json_response(data):
    return HttpResponse(''.join(['(',data,')']), mimetype='application/x-javascript; charset=utf-8')

RESPONSE_FN = {
    "json": json_response,
}

FORMATS = (
    "json",
)

def serialized_response(data, format):
    fn = RESPONSE_FN.get(format)
    if not fn:
        out = ["Invalid format. Available formats:"]
        out.extend(FORMATS)
        render = " ".join(out)
        return HttpResponse(render)
    else:
        return fn(data)

