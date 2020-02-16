from operator import attrgetter

from django.db.models import QuerySet


class BaseQuerySet(QuerySet):

    def map_by(self, attr_name):
        return {getattr(o, attr_name): o for o in self}

    def map_list_by(self, attr_name):
        res = {}
        for o in self:
            res.setdefault(getattr(o, attr_name), []).append(o)
        return res

    def get_ids(self):
        return set(map(attrgetter("pk"), self))

    def chunks(self, chunk_size=1000):
        offset = 0
        while True:
            chunk = self[offset: chunk_size + offset]
            if not chunk:
                raise StopIteration()
            yield chunk
            chunk_len = len(chunk)
            if chunk_len < chunk_size:
                raise StopIteration()
            offset += chunk_size
