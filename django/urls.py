from django.conf.urls.defaults import *

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Example:
    # (r'^jgblue/', include('jgblue.foo.urls')),

    # Uncomment the admin/doc line below and add 'django.contrib.admindocs' 
    # to INSTALLED_APPS to enable admin documentation:
    # (r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    (r'^$', "jgblue.database.views.home.index"),
    (r'^admin/', include(admin.site.urls)),
	(r'^item/(\d+)$', 'jgblue.database.views.item.detail'),
    (r'^items/(\d*)\.?(\d*)$', 'jgblue.database.views.item.index'),
    (r'^login/$', 'django.contrib.auth.views.login', {'template_name': 'accounts/login.htm'}),
    (r'^user/profile/$', 'jgblue.database.views.user.profile'),
    (r'^logout/$', 'django.contrib.auth.views.logout', {'next_page': '/'}),
)
