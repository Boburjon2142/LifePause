import os
import sys

path = '/home/akramjonovich2/lifepause/backend'
if path not in sys.path:
    sys.path.append(path)

os.environ['DJANGO_SETTINGS_MODULE'] = 'core.settings'

from django.core.wsgi import get_wsgi_application
from whitenoise import WhiteNoise

application = get_wsgi_application()
application = WhiteNoise(application, root='/home/akramjonovich2/lifepause/backend/staticfiles')
