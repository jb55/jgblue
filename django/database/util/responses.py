from django.http import HttpResponse
from django.template import RequestContext
from jgblue.database.forms import UploadScreenshotForm
from jgblue.database.models import Image
from jgblue.database.util.serialize import *
from jgblue.database.util.file_handlers import *
from jgblue.database.util.misc import user_msg
from django.utils.translation import ugettext as _
from django.shortcuts import render_to_response

def jgblue_response(template, data, request, **kwargs):
    return render_to_response(template, data, context_instance=RequestContext(request), **kwargs)

def json_response(data):
    return HttpResponse(''.join(['(',data,')']), mimetype='application/javascript')

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


def upload_screenshot(request, type, id):
    """
    Generic upload screenshot handler.
    Takes an UploadScreenshotForm and a target type (Item, Spacecraft, etc.)
    and uploads a screenshot for that item
    """
    resp = None

    if request.method == 'POST':
        form = UploadScreenshotForm(request.POST, request.FILES)
        if form.is_valid():
            uuid, thumb_uuid, resized_uuid = handle_screenshot_file(request.FILES['file'])
            image = Image.create(uuid, thumb_uuid, resized_uuid, type, id, description=form.cleaned_data['description'])
            image.save()
            resp = _("Upload successful. Screenshots must be approved by the moderators before they appear.")
            #    resp = _("There was an error with the database when attempting to save the screenshot")
        else:
            resp = _("Form is not valid")
    else:
        resp = _("Method is not POST")

    user_msg(resp, request)

