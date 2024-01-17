class ListUtils:

    @staticmethod
    def get_paginated_list(lst: list[any], page: int, page_size: int):
        start_index = page * page_size
        end_index = start_index + page_size

        return lst[start_index:end_index]
