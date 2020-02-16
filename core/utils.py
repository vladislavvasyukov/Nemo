import fcntl
import os
from django.conf import settings
import logging
from hashlib import md5
from urllib.parse import urlparse
from uuid import uuid4


def management_lock(view_func):
    def wrapper_lock(*args, **kwargs):
        try:
            lock_file_path = os.path.join(settings.LOCK_DIR, "{0}.lock".format(args[0].name))
            f = open(lock_file_path, 'w')
            fcntl.lockf(f, fcntl.LOCK_EX + fcntl.LOCK_NB)
        except IOError:
            logging.debug("Process already is running.")
            os._exit(1)
        return view_func(*args, **kwargs)

    wrapper_lock.view_func = view_func.view_func if hasattr(view_func, 'view_func') else view_func
    return wrapper_lock


def get_site_main_page():
    return "{}://{}{}".format(
        settings.SITE_PROTOCOL,
        "www." if settings.SITE_IS_WWW else '',
        settings.SITE_DOMAIN
    )


def get_uniq_filename(filename):
    salt = str(uuid4())
    name, ext = os.path.split(filename)
    new_name = md5(f"{name}_{salt}".encode('utf8')).hexdigest()
    if ext:
        new_name += f".{ext}"
    return new_name
