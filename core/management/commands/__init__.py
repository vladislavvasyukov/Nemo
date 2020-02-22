import logging.config
import sys

from django.conf import settings
from django.core.management.base import BaseCommand, CommandError

from core.utils import management_lock

# logging.config.dictConfig(settings.MANAGEMENT_LOGGING)


class CoreCommandError(CommandError):
    pass


class CoreCommand(BaseCommand):

    def __init__(self, *args, **kwargs):
        self.name = sys.argv[1]
        self.logger = logging.getLogger("django.{0}".format(self.name))
        self.__rewrite_root_logger()
        self.options = None
        super().__init__(*args, **kwargs)

    def __rewrite_root_logger(self):
        root_logger = logging.getLogger()
        root_logger.handlers = self.logger.handlers
        root_logger.setLevel(self.logger.level)

    def handle(self, *args, **options):
        self._handle(*args, **options)

    def _handle(self, *args, **options):
        self.args = args
        self.options = options

        try:
            self.run()
        except Exception as e:
            self.logger.exception(e)
            raise

    def run(self):
        raise NotImplementedError


class CoreCommandLocked(CoreCommand):

    @management_lock
    def handle(self, *args, **options):
        self._handle(*args, **options)
