import json
from pydantic import TypeAdapter

from app.models.base_object import BaseObject


class DataUtils:

    @staticmethod
    def read_and_validate_data(filepath: str, data_type: type[BaseObject], data_key: str):
        with open(filepath) as json_file:
            json_data = json.load(json_file)

            data = TypeAdapter(list[data_type]).validate_python(json_data[data_key])
            return {item.id: item for item in data}
