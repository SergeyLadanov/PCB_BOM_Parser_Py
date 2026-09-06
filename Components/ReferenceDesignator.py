import re


# Canonical designators are used internally as component type identifiers.  Several
# schematic conventions can therefore map to the same component type.
REFERENCE_PREFIX_TO_DESIGNATOR = {
    "C": "C",
    "R": "R",
    "L": "L",
    "FB": "L",
    "DA": "IC",
    "DD": "IC",
    "DS": "IC",
    "IC": "IC",
    "U": "IC",
    "Y": "Y",
    "ZQ": "Y",
    "K": "K",
    "KA": "K",
    "KH": "K",
    "KM": "K",
    "KT": "K",
    "KV": "K",
    "D": "D",
    "VD": "D",
    "Q": "Q",
    "VT": "Q",
    "VS": "VS",
    "HL": "LED",
    "LED": "LED",
    "F": "F",
    "FU": "F",
    "T": "T",
    "TR": "T",
    "J": "J",
    "P": "J",
    "X": "J",
    "XP": "J",
    "XS": "J",
    "XT": "J",
    "S": "S",
    "SA": "S",
    "SB": "S",
    "SW": "S",
    "BAT": "BT",
    "BT": "BT",
    "GB": "BT",
    "M": "M",
    "BZ": "BZ",
    "HA": "BZ",
    "BA": "LS",
    "LS": "LS",
    "BM": "MIC",
    "MIC": "MIC",
    "RV": "RV",
    "RU": "RV",
    "RT": "RT",
    "RP": "RP",
}


COMPONENT_TYPE_LABELS = {
    "C": "Конденсатор",
    "R": "Резистор",
    "L": "Индуктивность",
    "IC": "Микросхема",
    "Y": "Кварцевый резонатор",
    "K": "Реле",
    "D": "Диод",
    "Q": "Транзистор",
    "VS": "Тиристор",
    "LED": "Светодиод",
    "F": "Предохранитель",
    "T": "Трансформатор",
    "J": "Разъём",
    "S": "Переключатель",
    "BT": "Источник питания",
    "M": "Электродвигатель",
    "BZ": "Звуковой излучатель",
    "LS": "Динамик",
    "MIC": "Микрофон",
    "RV": "Варистор",
    "RT": "Терморезистор",
    "RP": "Переменный резистор",
}


_SINGLE_REFERENCE_RE = re.compile(
    r"^(?P<prefix>[A-Za-zА-Яа-яЁё]+)\s*\d+[A-Za-zА-Яа-яЁё]?$"
)
_RANGE_SEPARATOR_RE = re.compile(r"\s*(?:\.\.\.|…|\.\.)\s*")


def _get_reference_prefix(reference):
    match = _SINGLE_REFERENCE_RE.fullmatch(reference.strip())
    if not match:
        return None
    return match.group("prefix").upper()


def _get_item_prefixes(item):
    endpoints = _RANGE_SEPARATOR_RE.split(item.strip())
    if len(endpoints) not in {1, 2}:
        return None

    prefixes = [_get_reference_prefix(endpoint) for endpoint in endpoints]
    if any(prefix is None for prefix in prefixes):
        return None
    if len(prefixes) == 2 and prefixes[0] != prefixes[1]:
        return None
    return prefixes


def is_reference_designator(value):
    """Return True for a single RefDes, a range, or their comma-separated list."""
    if not value or not value.strip():
        return False

    items = value.split(",")
    return all(_get_item_prefixes(item) is not None for item in items)


def get_component_designator(value):
    """Map a RefDes expression to one canonical component designator.

    Mixed component types and unknown prefixes deliberately return None: the caller
    must not guess a type when the authoritative RefDes column is ambiguous.
    """
    if not is_reference_designator(value):
        return None

    component_designators = set()
    for item in value.split(","):
        for prefix in _get_item_prefixes(item):
            component_designator = REFERENCE_PREFIX_TO_DESIGNATOR.get(prefix)
            if component_designator is None:
                return None
            component_designators.add(component_designator)

    if len(component_designators) != 1:
        return None
    return component_designators.pop()


def get_component_type_label(designator):
    return COMPONENT_TYPE_LABELS.get(designator, "-")
