from pathlib import Path
from io import BytesIO

import pytest
from openpyxl import load_workbook

from Components.ComponentBase import ComponentBase
from Components.ReferenceDesignator import (
    get_component_designator,
    get_component_designator_from_type,
    get_component_type_label,
)
from tests.expected_components import (
    EXPECTED_OTHER_COMPONENTS,
    EXPECTED_PASSIVE_COMPONENTS,
)
from web_controller import app


FIXTURE_PATH = Path(__file__).parent / "fixtures" / "bom_items.tsv"
EXPECTED_RESULT_FIELDS = {
    "designator",
    "name",
    "type",
    "count",
    "params",
    "ordering",
    "ru",
    "en",
    "elitan",
    "manufacturer_info",
}


@pytest.fixture
def client():
    app.config.update(TESTING=True)
    with app.test_client() as test_client:
        yield test_client


@pytest.fixture
def bom_data():
    lines = [
        line
        for line in FIXTURE_PATH.read_text(encoding="utf-8").splitlines()
        if line
    ]
    rows = []
    for line in lines:
        separator = "\t" if "\t" in line else ";"
        name, count = line.rsplit(separator, 1)
        rows.append((name, int(count)))
    return "\n".join(lines), rows


def make_form(bom, *, device_count="1", tech_reserve="1.0"):
    return {
        "bom": bom,
        "count": device_count,
        "tech_res": tech_reserve,
        "res_filter[skip_power]": "false",
        "res_filter[skip_tol]": "false",
        "cap_filter[skip_tol]": "false",
        "cap_filter[skip_voltage]": "false",
        "cap_filter[skip_dielectric]": "false",
        "man_settings[smd_res]": "Yageo",
        "man_settings[smd_cer_cap]": "Yageo",
        "man_settings[smd_tant_cap]": "Xiangyee",
    }


def test_bom_data_processes_all_test_parser_and_application_items(client, bom_data):
    bom, bom_rows = bom_data
    assert len(bom_rows) == 128

    response = client.post("/bom_data", data=make_form(bom))

    assert response.status_code == 200
    result = response.get_json()
    assert len(result) == len(bom_rows)

    for parsed_item, (expected_name, expected_count) in zip(
        result, bom_rows, strict=True
    ):
        assert parsed_item["name"] == expected_name
        assert parsed_item["designator"] == ""
        assert parsed_item["count"] == expected_count
        assert set(parsed_item) == EXPECTED_RESULT_FIELDS
        assert isinstance(parsed_item["params"], list)
        assert len(parsed_item["ordering"]) == 5
        assert set(parsed_item["manufacturer_info"]) == {
            "manufacturer_name",
            "component_name",
        }


@pytest.mark.parametrize(
    ("bom_line", "expected_value"),
    [
        ("0.01мкФ 5% 50V NP0 0603 \t2", "0.01 мкФ"),
        ("0.01uF 5% 50V NP0 0603 \t2", "0.01 uF"),
    ],
)
def test_small_capacitance_value_is_not_truncated(client, bom_line, expected_value):
    response = client.post("/bom_data", data=make_form(bom_line))

    assert response.status_code == 200
    item = response.get_json()[0]
    assert item["type"] == "Конденсатор"
    assert item["params"][1] == f"Значение: {expected_value}"


def test_component_parser_matches_expected_results_for_entire_bom(bom_data):
    _, bom_rows = bom_data
    component_names = {name for name, _ in bom_rows}
    assert component_names == (
        set(EXPECTED_PASSIVE_COMPONENTS) | EXPECTED_OTHER_COMPONENTS
    )

    for name, _ in bom_rows:
        component = ComponentBase(name)

        if name in EXPECTED_PASSIVE_COMPONENTS:
            actual = (
                component.GetDesignator(),
                component.GetValue(),
                component.GetUnitsValue(),
                component.GetEndurance(),
                component.GetUnitsEndurance(),
                component.GetTolerance(),
                component.GetCase(),
                component.GetDesignVariant(),
                component.GetManufacturerPartNumber(),
            )
            assert component.IsPassive(), name
            assert actual == EXPECTED_PASSIVE_COMPONENTS[name], name
        else:
            assert not component.IsPassive(), name
            assert component.GetDesignator() not in {"R", "C", "L"}, name
            assert component.GetValue() == 0.0, name
            assert component.GetUnitsValue() == "", name
            assert component.GetEndurance() == 0.0, name
            assert component.GetUnitsEndurance() == "", name
            assert component.GetTolerance() == 0, name
            assert component.GetCase() == "", name
            assert component.GetDesignVariant() == "", name
            assert component.GetManufacturerPartNumber(), name


def test_bom_data_applies_device_count_and_technical_reserve(client):
    response = client.post(
        "/bom_data",
        data=make_form(
            "10k 1% 0.063W 0603\t3",
            device_count="2",
            tech_reserve="1.1",
        ),
    )

    assert response.status_code == 200
    assert response.get_json()[0]["count"] == 7


def test_bom_data_reports_the_source_line_that_failed(client):
    response = client.post(
        "/bom_data",
        data=make_form("ME6211C33M5G\t1\nBROKEN-COUNT\tnot-a-number"),
    )

    assert response.status_code == 422
    assert response.get_json() == {
        "error": {
            "code": "bom_item_processing_failed",
            "line": 2,
            "message": "Не удалось обработать элемент в строке 2.",
        }
    }


def make_json(bom):
    return {
        "bom": bom,
        "count": 1,
        "tech_res": 1.0,
        "res_filter": {"skip_power": False, "skip_tol": False},
        "cap_filter": {
            "skip_tol": False,
            "skip_voltage": False,
            "skip_dielectric": False,
        },
        "man_settings": {
            "smd_res": "Yageo",
            "smd_cer_cap": "Yageo",
            "smd_tant_cap": "Xiangyee",
        },
    }


@pytest.mark.parametrize(
    ("bom", "expected_designator", "expected_name", "expected_type", "expected_count"),
    [
        ("DD1\tSTM32H743ZIT6\t1", "DD1", "STM32H743ZIT6", "Микросхема", 1),
        (
            "DD1,DD2;STM32H743ZIT6;2",
            "DD1,DD2",
            "STM32H743ZIT6",
            "Микросхема",
            2,
        ),
        (
            "DD1...DD5\tSTM32H743ZIT6\t5",
            "DD1...DD5",
            "STM32H743ZIT6",
            "Микросхема",
            5,
        ),
        (
            "DD1,DD2,DD3...DD7;STM32H743ZIT6;7",
            "DD1,DD2,DD3...DD7",
            "STM32H743ZIT6",
            "Микросхема",
            7,
        ),
        ("ZQ1;HC-49S 8 МГц;1", "ZQ1", "HC-49S 8 МГц", "Кварцевый резонатор", 1),
        ("K1;Relay 5V SPDT;1", "K1", "Relay 5V SPDT", "Реле", 1),
        ("VD1;1N4148;3", "VD1", "1N4148", "Диод", 3),
        (
            "L1;4.7 nH 0.1 A BLM18HG102SN1D;1",
            "L1",
            "4.7 nH 0.1 A BLM18HG102SN1D",
            "Катушка индуктивности",
            1,
        ),
    ],
)
def test_bom_data_uses_optional_reference_designator(
    client, bom, expected_designator, expected_name, expected_type, expected_count
):
    response = client.post("/bom_data", data=make_form(bom))

    assert response.status_code == 200
    item = response.get_json()[0]
    assert item["designator"] == expected_designator
    assert item["name"] == expected_name
    assert item["type"] == expected_type
    assert item["count"] == expected_count


def test_reference_designator_has_priority_over_name_heuristics(client):
    response = client.post(
        "/bom_data", data=make_form("K1\tRelay coil 5V\t1")
    )

    assert response.status_code == 200
    item = response.get_json()[0]
    assert item["type"] == "Реле"
    assert item["ru"] == "Relay coil 5V"
    assert item["en"] == "Relay coil 5V"
    assert item["elitan"] == "Relay coil 5V"


@pytest.mark.parametrize(
    ("component_type", "name", "expected_type"),
    [
        ("Конденсатор", "0.1uF 1% 16V X7R 0603", "Конденсатор"),
        ("резистор", "10 кОм 1% 0603", "Резистор"),
        ("Резистор", "10 k", "Резистор"),
        ("МИКРОСХЕМА", "STM32H743ZIT6", "Микросхема"),
        ("Индуктивность", "4.7 nH 0.1 A", "Катушка индуктивности"),
    ],
)
def test_bom_data_accepts_explicit_component_type(
    client, component_type, name, expected_type
):
    response = client.post(
        "/bom_data", data=make_form(f"{component_type};{name};2")
    )

    assert response.status_code == 200
    item = response.get_json()[0]
    assert item["designator"] == ""
    assert item["name"] == name
    assert item["type"] == expected_type
    assert item["count"] == 2


def test_explicit_component_type_has_priority_over_name_heuristics(client):
    response = client.post(
        "/bom_data", data=make_form("Микросхема;10 кОм 1% 0603;1")
    )

    assert response.status_code == 200
    item = response.get_json()[0]
    assert item["type"] == "Микросхема"
    assert item["ru"] == "10 кОм 1% 0603"
    assert item["en"] == "10 кОм 1% 0603"


def test_component_type_label_lookup_is_case_insensitive():
    assert get_component_designator_from_type("  кОнДеНсАтОр  ") == "C"
    assert get_component_designator_from_type("unknown") is None


def test_legacy_name_with_commas_remains_supported(client):
    response = client.post(
        "/bom_data", data=make_form("22 Ом, 1%, 0.063 Вт 0603;9")
    )

    assert response.status_code == 200
    item = response.get_json()[0]
    assert item["designator"] == ""
    assert item["name"] == "22 Ом, 1%, 0.063 Вт 0603"
    assert item["type"] == "Резистор"
    assert item["count"] == 9


def test_unknown_reference_designator_does_not_guess_type_from_name(client):
    response = client.post(
        "/bom_data", data=make_form("ABC1;10 кОм 1% 0603;1")
    )

    assert response.status_code == 200
    item = response.get_json()[0]
    assert item["designator"] == "ABC1"
    assert item["type"] == "-"


def test_legacy_inductor_type_label_remains_unchanged(client):
    response = client.post(
        "/bom_data", data=make_form("4.7 nH 0.1 A BLM18HG102SN1D;1")
    )

    assert response.status_code == 200
    assert response.get_json()[0]["type"] == "Индуктивность"


def test_excel_export_contains_reference_designator_column(client):
    response = client.post(
        "/download_excel", json=make_json("DD1,DD2;STM32H743ZIT6;2")
    )

    assert response.status_code == 200
    worksheet = load_workbook(BytesIO(response.data)).active
    assert [cell.value for cell in worksheet[1]][:5] == [
        "#",
        "Поз. обознач.",
        "Исходное наименование",
        "Тип элемента",
        "Параметры",
    ]
    assert worksheet["B2"].value == "DD1,DD2"
    assert worksheet["C2"].value == "STM32H743ZIT6"
    assert worksheet["D2"].value == "Микросхема"
    assert worksheet["K2"].value == "ссылка"
    assert worksheet["K2"].hyperlink is not None


def test_excel_export_uses_selected_columns_and_keeps_required_ones(client):
    data = make_json("DD1,DD2;STM32H743ZIT6;2")
    data["excel_columns"] = ["designator", "component_type"]

    response = client.post("/download_excel", json=data)

    assert response.status_code == 200
    worksheet = load_workbook(BytesIO(response.data)).active
    assert [cell.value for cell in worksheet[1]] == [
        "#",
        "Поз. обознач.",
        "Исходное наименование",
        "Тип элемента",
        "Количество",
    ]
    assert [cell.value for cell in worksheet[2]] == [
        1,
        "DD1,DD2",
        "STM32H743ZIT6",
        "Микросхема",
        2,
    ]


def test_excel_export_formats_store_link_in_any_selected_position(client):
    data = make_json("R1;10 кОм 1% 0603;1")
    data["excel_columns"] = ["store_chipdip"]

    response = client.post("/download_excel", json=data)

    assert response.status_code == 200
    worksheet = load_workbook(BytesIO(response.data)).active
    assert [cell.value for cell in worksheet[1]] == [
        "#",
        "Исходное наименование",
        "Количество",
        "chipdip",
    ]
    assert worksheet["D2"].value == "ссылка"
    assert worksheet["D2"].hyperlink is not None


@pytest.mark.parametrize(
    ("prefix", "expected_type"),
    [
        ("A", "Устройство"),
        ("BAT", "Элемент питания"),
        ("BF", "Телефон"),
        ("BH", "Датчик Холла"),
        ("BM", "Микрофон"),
        ("C", "Конденсатор"),
        ("D", "Микросхема"),
        ("DA", "Микросхема"),
        ("DD", "Микросхема"),
        ("FU", "Предохранитель"),
        ("F", "Разрядник"),
        ("GB", "Батарея"),
        ("G", "Генератор"),
        ("H", "Устройство индикации"),
        ("HG", "Устройство индикации"),
        ("HL", "Устройство индикации"),
        ("K", "Реле"),
        ("KV", "Реле"),
        ("L", "Катушка индуктивности"),
        ("R", "Резистор"),
        ("RK", "Терморезистор"),
        ("RP", "Потенциометр"),
        ("RU", "Варистор"),
        ("S", "Переключатель"),
        ("SA", "Переключатель"),
        ("SB", "Переключатель"),
        ("T", "Трансформатор"),
        ("VD", "Диод"),
        ("VS", "Тиристор"),
        ("VT", "Транзистор"),
        ("WA", "Антенна"),
        ("X", "Соединитель"),
        ("XP", "Соединитель"),
        ("XS", "Соединитель"),
        ("XW", "Соединитель"),
        ("Z", "Кварцевый резонатор"),
        ("ZQ", "Кварцевый резонатор"),
        ("FP", "Термопредохранитель"),
        ("U", "Оптопара"),
    ],
)
def test_altium_template_reference_designators(prefix, expected_type):
    designator = get_component_designator(f"{prefix}1")
    assert get_component_type_label(designator) == expected_type
