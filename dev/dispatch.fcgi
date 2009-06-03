#!/usr/bin/env python

import sys
sys.path += ['/home/jb555/django/django_src']
sys.path += ['/home/jb555/django/django_projects']
from fcgi import WSGIServer
from django.core.handlers.wsgi import WSGIHandler
import os
os.environ['DJANGO_SETTINGS_MODULE'] = 'jgblue.settings'
WSGIServer(WSGIHandler()).run()


