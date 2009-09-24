import uuid

def gen_uuid():
    return str(uuid.uuid4()).replace('-','')



def make_thumbnail(src, dest, size=(192,192)):
    """
    makes a thumbnail of a given file 

    src: source filename
    dest: destination filename
    size: constrain size
    """
    from PIL import Image as PImage

    im = PImage.open(src)
    im.thumbnail(size, PImage.ANTIALIAS)
    im.save(dest)
