import re


# Canonical designators are used internally as component type identifiers.  Several
# schematic conventions can therefore map to the same component type.
REFERENCE_PREFIX_TO_DESIGNATOR = {
    # Designators used by the project's Altium Designer template.
    "A": "DEVICE",
    "BAT": "POWER_CELL",
    "BF": "TELEPHONE",
    "BH": "HALL_SENSOR",
    "BM": "MIC",
    "C": "C",
    "D": "IC",
    "DA": "IC",
    "DD": "IC",
    "FU": "FUSE",
    "F": "ARRESTER",
    "GB": "BATTERY",
    "G": "GENERATOR",
    "H": "INDICATOR",
    "HG": "INDICATOR",
    "HL": "INDICATOR",
    "K": "K",
    "KV": "K",
    "L": "L",
    "R": "R",
    "RK": "RT",
    "RP": "RP",
    "RU": "RV",
    "S": "S",
    "SA": "S",
    "SB": "S",
    "T": "T",
    "VD": "D",
    "VS": "VS",
    "VT": "Q",
    "WA": "ANTENNA",
    "X": "J",
    "XP": "J",
    "XS": "J",
    "XW": "J",
    "Z": "Y",
    "ZQ": "Y",
    "FP": "THERMAL_FUSE",
    "U": "OPTOCOUPLER",

    # Additional widespread aliases that do not conflict with the template.
    "FB": "L",
    "DS": "IC",
    "IC": "IC",
    "Y": "Y",
    "KA": "K",
    "KH": "K",
    "KM": "K",
    "KT": "K",
    "Q": "Q",
    "LED": "INDICATOR",
    "TR": "T",
    "J": "J",
    "P": "J",
    "XT": "J",
    "SW": "S",
    "BT": "POWER_CELL",
    "M": "M",
    "BZ": "BZ",
    "HA": "BZ",
    "BA": "LS",
    "LS": "LS",
    "MIC": "MIC",
    "RV": "RV",
    "RT": "RT",
}


COMPONENT_TYPE_LABELS = {
    "DEVICE": "Устройство",
    "POWER_CELL": "Элемент питания",
    "TELEPHONE": "Телефон",
    "HALL_SENSOR": "Датчик Холла",
    "MIC": "Микрофон",
    "C": "Конденсатор",
    "R": "Резистор",
    "L": "Катушка индуктивности",
    "IC": "Микросхема",
    "FUSE": "Предохранитель",
    "ARRESTER": "Разрядник",
    "BATTERY": "Батарея",
    "GENERATOR": "Генератор",
    "INDICATOR": "Устройство индикации",
    "Y": "Кварцевый резонатор",
    "K": "Реле",
    "D": "Диод",
    "Q": "Транзистор",
    "VS": "Тиристор",
    "T": "Трансформатор",
    "J": "Соединитель",
    "S": "Переключатель",
    "ANTENNA": "Антенна",
    "THERMAL_FUSE": "Термопредохранитель",
    "OPTOCOUPLER": "Оптопара",
    "M": "Электродвигатель",
    "BZ": "Звуковой излучатель",
    "LS": "Динамик",
    "RV": "Варистор",
    "RT": "Терморезистор",
    "RP": "Потенциометр",
}


# Labels accepted in the optional first BOM column instead of a RefDes.  Keep the
# lookup case-insensitive while preserving COMPONENT_TYPE_LABELS as the single
# source of the labels displayed by the application.
COMPONENT_TYPE_TO_DESIGNATOR = {
    label.casefold(): designator
    for designator, label in COMPONENT_TYPE_LABELS.items()
}
# The application historically displayed this shorter label for inductors whose
# type was inferred from the component name.
COMPONENT_TYPE_TO_DESIGNATOR["индуктивность"] = "L"


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


def get_component_designator_from_type(value):
    """Map a displayed component type to its canonical designator."""
    if not isinstance(value, str):
        return None
    return COMPONENT_TYPE_TO_DESIGNATOR.get(value.strip().casefold())


def is_component_type(value):
    return get_component_designator_from_type(value) is not None
