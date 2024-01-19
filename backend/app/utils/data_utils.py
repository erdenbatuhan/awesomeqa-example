import json
from typing import TypeVar, Union
from pydantic import TypeAdapter

from ..models.base_object import BaseObject


class DataUtils:

    T = TypeVar("T", bound=BaseObject)

    @staticmethod
    def read_and_validate_data(
        filepath: str,
        data_types: list[type[T]],
        data_keys: list[str]
    ) -> dict[str, dict[str, Union[T]]]:
        """
        Reads data from a JSON file, validates it, and returns a dictionary of validated data.

        Parameters:
        - filepath (str): The path to the JSON file.
        - data_types (List[type[T]]): List of data types to validate.
        - data_keys (List[str]): List of keys corresponding to different data types.

        Returns:
        Dict[str, Dict[str, Union[T]]]: A dictionary containing validated data for each data type.
        """
        with open(filepath) as json_file:
            json_data = json.load(json_file)

            return {
                data_key: {
                    item.id: item
                    for item in TypeAdapter(list[data_type]).validate_python(json_data[data_key])
                }
                for data_type, data_key in zip(data_types, data_keys)
            }
