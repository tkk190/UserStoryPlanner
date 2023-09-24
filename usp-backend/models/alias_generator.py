import re

def to_camel(snake: str) -> str:
    """Convert a snake_case string to camelCase.

    Args:
        snake: The string to convert.

    Returns:
        The converted camelCase string.
    """
    camel = snake.title()
    camel = re.sub('([0-9A-Za-z])_(?=[0-9A-Z])', lambda m: m.group(1), camel)
    return re.sub('(^_*[A-Z])', lambda m: m.group(1).lower(), camel)
