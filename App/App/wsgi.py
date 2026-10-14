import os
import sys
from pathlib import Path

# Добавляем корень проекта (родитель папки App) в sys.path
ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.append(str(ROOT_DIR))

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'App.settings')

application = get_wsgi_application()