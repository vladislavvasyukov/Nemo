import os
from collections import defaultdict
from django.conf import settings
from core.management.commands import CoreCommandLocked


class Command(CoreCommandLocked):
    help = """
        Подсчет количества строк в проекте (без учета автогенерируемых файлов)
    """

    EXCLUDE_PARTS = (
        'node_modules', 
        '/.git/', 
        'migrations', 
        '__pycache__', 
        'package-lock.json',
        'app.build.js',
        'vendor-manifest.json',
        'dll.vendor.js.LICENSE.txt',
        'dll.vendor.js',
    )

    def run(self, *args, **options):

        files_dict = defaultdict(lambda: {'count': 0, 'files': set()})

        for root, dirs, files in os.walk(settings.BASE_DIR):
            all_files = [os.path.join(root, name) for name in files]
            for filename in all_files:
                if all([part not in filename for part in self.EXCLUDE_PARTS]):
                    ext = filename.split('.')[-1]
                    files_dict[ext]['files'].add(filename)
                    with open(filename) as fi:
                        files_dict[ext]['count'] += len(fi.readlines())

        total_count = 0
        for key, value in files_dict.items():
            total_count += value["count"]
            print(f'-----{key}-----{value["count"]}')
            for f in value["files"]:
                print(f'          {f}')

        print(f'\n\n{"="*100}\n\nTOTAL COUNT ROWS = {total_count}')
