from collections import OrderedDict

from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class BasePagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 10

    def get_paginated_response(self, data):
        return Response(
            OrderedDict([
                ('count', self.page.paginator.count),
                ('num_pages', self.page.paginator.num_pages),
                ('next_page', self.page.next_page_number() if self.page.has_next() else None),
                ('previous_page', self.page.previous_page_number() if self.page.has_previous() else None),
                ('current_page', self.page.number),
                ('results', data)
            ]),
        )
