from pathlib import Path

import pytest

from Components.ComponentBase import ComponentBase
from tests.expected_components import (
    EXPECTED_OTHER_COMPONENTS,
    EXPECTED_PASSIVE_COMPONENTS,
)
from web_controller import app


FIXTURE_PATH = Path(__file__).parent / "fixtures" / "bom_items.tsv"
EXPECTED_RESULT_FIELDS = {
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
    assert len(bom_rows) == 126

    response = client.post("/bom_data", data=make_form(bom))

    assert response.status_code == 200
    result = response.get_json()
    assert len(result) == len(bom_rows)

    for parsed_item, (expected_name, expected_count) in zip(
        result, bom_rows, strict=True
    ):
        assert parsed_item["name"] == expected_name
        assert parsed_item["count"] == expected_count
        assert set(parsed_item) == EXPECTED_RESULT_FIELDS
        assert isinstance(parsed_item["params"], list)
        assert len(parsed_item["ordering"]) == 5
        assert set(parsed_item["manufacturer_info"]) == {
            "manufacturer_name",
            "component_name",
        }


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
