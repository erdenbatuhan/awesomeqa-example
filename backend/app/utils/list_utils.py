class ListUtils:

    @staticmethod
    def get_paginated_list(lst: list[any], page: int, page_size: int):
        """
        Retrieves a paginated subset of a list based on the specified page and page size.

        Parameters:
        - lst (List[Any]): The list to paginate.
        - page (int): The page number.
        - page_size (int): The number of items per page.

        Returns:
        List[Any]: A paginated subset of the original list.
        """
        start_index = page * page_size
        end_index = start_index + page_size

        return lst[start_index:end_index]
