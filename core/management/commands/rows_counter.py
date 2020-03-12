import os
from collections import defaultdict

from django.conf import settings

from core.management.commands import CoreCommandLocked


class Command(CoreCommandLocked):
    help = """
        Подсчет количества строк в проекте (без учета автогенерируемых файлов)
    """

    EXCLUDE_PARTS = (
        'Nemo/Nemo/.idea/',
        'Nemo/Nemo/.git/',
        'Nemo/Nemo/.pytest_cache',
        'Nemo/Nemo/node_modules/',
        'Nemo/Nemo/htmlcov/',
        'Nemo/Nemo/package-lock.json',
        'Nemo/Nemo/core/migrations/',
        'Nemo/Nemo/core/static/core/js/apps/build/',
        'Nemo/Nemo/core/static/core/vendor/build/',
    )

    EXCLUDE_EXTENSIONS = ('coverage', 'pyc', 'lock', 'log')

    def run(self, *args, **options):

        files_dict = defaultdict(lambda: {'count': 0, 'files': set()})

        for root, dirs, files in os.walk(settings.BASE_DIR):
            all_files = [os.path.join(root, name) for name in files]
            for filename in all_files:
                if self.valid(filename):
                    ext = filename.split('.')[-1]
                    files_dict[ext]['files'].add(filename)
                    with open(filename) as fi:
                        print(filename)
                        files_dict[ext]['count'] += len(fi.readlines())

        total_count = 0
        for key, value in files_dict.items():
            total_count += value["count"]
            print(f'-----{key}-----{value["count"]}')
            for f in value["files"]:
                print(f'          {f}')

        print(f'\n\n{"="*100}\n\nTOTAL COUNT ROWS = {total_count}')

    def valid(self, filename):
        cause_one = all([part not in filename for part in self.EXCLUDE_PARTS])
        cause_two = all([ext != filename.split('.')[-1] for ext in self.EXCLUDE_EXTENSIONS])

        return cause_one and cause_two
