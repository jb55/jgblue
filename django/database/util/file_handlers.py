from jgblue.database.util.misc import gen_uuid
from jgblue.database.util.misc import make_thumbnail
from django.conf import settings
import os.path

def handle_screenshot_file(f):
    dir = settings.SCREENSHOTS_UPLOAD_DIR
    uuid = gen_uuid()
    thumb_uuid = gen_uuid()
    resized_uuid = gen_uuid()
    name, ext = os.path.splitext(f.name)

    dest_filename = uuid + ext
    thumb_filename = thumb_uuid + ext
    resized_filename = resized_uuid + ext

    dest_path = os.path.join(dir, dest_filename)
    thumb_path = os.path.join(dir, thumb_filename)
    resized_path = os.path.join(dir, resized_filename)

    dest_file = open(dest_path, "wb")
    for chunk in f.chunks():
        dest_file.write(chunk)
    dest_file.close()

    # make a thumbnail from the uploaded file
    make_thumbnail(dest_path, thumb_path, size=(192,192))
    make_thumbnail(dest_path, resized_path, size=(640,640))

    return (dest_filename, thumb_filename, resized_filename)
