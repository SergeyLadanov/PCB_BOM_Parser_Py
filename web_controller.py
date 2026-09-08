#!/usr/bin/env python3
from flask import Flask, Response,render_template, request, make_response, send_file
from functools import wraps
import json
import os
import sys
import socket
from ParamFilter import FilterObj as Filter

import ManufacturerManager

from io import BytesIO

import model
from Components.ReferenceDesignator import is_component_type, is_reference_designator

from openpyxl import Workbook
from openpyxl.utils import get_column_letter
from openpyxl.styles import Alignment, Font


path = os.path.realpath(os.path.dirname(sys.argv[0]))

#------------------------------
app = Flask(__name__)


EXCEL_COLUMNS = (
    {"key": "number", "title": "#", "width": 7, "required": True},
    {"key": "designator", "title": "Поз. обознач.", "width": 20},
    {
        "key": "source_name",
        "title": "Исходное наименование",
        "width": 35,
        "required": True,
    },
    {"key": "component_type", "title": "Тип элемента", "width": 24},
    {"key": "parameters", "title": "Параметры", "width": 30},
    {"key": "english_name", "title": "Список на англ.", "width": 30},
    {"key": "russian_name", "title": "Список на рус.", "width": 30},
    {
        "key": "manufacturer_part_name",
        "title": "Наимен. произв.",
        "width": 30,
    },
    {"key": "manufacturer", "title": "Производитель", "width": 20},
    {
        "key": "quantity",
        "title": "Количество",
        "width": 12,
        "required": True,
    },
    {"key": "store_elitan", "title": "elitan", "width": 15, "link": True},
    {
        "key": "store_chipdip",
        "title": "chipdip",
        "width": 15,
        "link": True,
    },
    {"key": "store_platan", "title": "platan", "width": 15, "link": True},
    {
        "key": "store_promelec",
        "title": "promelec",
        "width": 15,
        "link": True,
    },
    {
        "key": "store_dko_electronshik",
        "title": "dko_electronshik",
        "width": 15,
        "link": True,
    },
)

DEFAULT_EXCEL_COLUMN_KEYS = {column["key"] for column in EXCEL_COLUMNS}
REQUIRED_EXCEL_COLUMN_KEYS = {
    column["key"] for column in EXCEL_COLUMNS if column.get("required")
}


def __ParseSpecRow(row):
    separator = '\t' if '\t' in row else (';' if ';' in row else None)
    if separator is None:
        return None

    columns = row.split(separator)
    if len(columns) < 2:
        return None

    count = columns[-1]
    content_columns = columns[:-1]
    if len(content_columns) >= 2:
        first_column = content_columns[0].strip()
        if is_reference_designator(first_column):
            return (
                content_columns[0],
                '',
                separator.join(content_columns[1:]),
                count,
            )
        if is_component_type(first_column):
            return (
                '',
                content_columns[0],
                separator.join(content_columns[1:]),
                count,
            )

    return '', '', separator.join(content_columns), count


def __GetSpec(data):
    result = []
    rows = data.split('\n')

    for line_number, row in enumerate(rows, start=1):
        columns = __ParseSpecRow(row.rstrip('\r'))
        if columns is None:
            continue

        designator, component_type, name, count = columns
        temp_item = {
            'designator': designator.strip(),
            'component_type': component_type.strip(),
            'name': name,
            'count': count or 1,
            'source_line': line_number,
        }
        result.append(temp_item)

    return result

    


@app.route("/")
def index():
    return render_template('index.html')


@app.route("/version", methods=['GET'])
def getversion():
    res = { 
        'version': model.GetVersion()
    }
    return res


# Маршрут для обработки POST запроса и генерации файла
@app.route('/get_manufacturers_info', methods=['GET'])
def get_manufacturers_info():

    res = { 
        'res_smd': ManufacturerManager.GetSmdResManufacturers(), 
        'cer_cap_smd': ManufacturerManager.GetSmdCerCapManufacturers(), 
        'tant_cap_smd': ManufacturerManager.GetSmdTantCapManufacturers(), 
        }
    return res


# Маршрут для обработки POST запроса и генерации файла
@app.route('/download_csv', methods=['POST'])
def download():
    # Получение данных с формы
    name = request.form.get('bom_list')
    # name = name.replace("\t", ";")
    name = name.replace("\r\n", "\n")

    columns = len(name.split("\n")[0].split("\t"))
    # Создание текста для файла

    if (columns < 3):
        file_content = f'Name\tQuantity\n{name}'
    else:
        file_content = f'Name\tQuantity\tManufacturer\n{name}'

    # Создание файла в памяти
    file_stream = BytesIO()
    file_stream.write(file_content.encode('utf-16'))
    file_stream.seek(0)

    # Отправка файла пользователю для скачивания
    return send_file(file_stream, as_attachment=True, download_name="BOM.csv", mimetype='text/plain')



# Маршрут для обработки POST запроса и генерации файла
@app.route('/download_excel', methods=['POST'])
def download_excel():
    parser_filter = Filter()
    data = request.get_json()
    bom = data['bom']
    spec_list = __GetSpec(bom)

    requested_column_keys = data.get('excel_columns')
    if requested_column_keys is None:
        selected_column_keys = DEFAULT_EXCEL_COLUMN_KEYS
    elif isinstance(requested_column_keys, list):
        selected_column_keys = {
            key for key in requested_column_keys if isinstance(key, str)
        }
    else:
        selected_column_keys = set()

    selected_column_keys = selected_column_keys | REQUIRED_EXCEL_COLUMN_KEYS
    selected_columns = [
        column
        for column in EXCEL_COLUMNS
        if column['key'] in selected_column_keys
    ]


    device_count = int(data['count'])
    tech_reseve = float(data['tech_res'])

    parser_filter.SetSkipingEndurance('R', data['res_filter']['skip_power'])
    parser_filter.SetSkipingTolerance('R', data['res_filter']['skip_tol'])

    parser_filter.SetSkipingTolerance('C', data['cap_filter']['skip_tol'])
    parser_filter.SetSkipingEndurance('C', data['cap_filter']['skip_voltage'])
    parser_filter.SetSkipingVariant('C', data['cap_filter']['skip_dielectric'])


    man_res_settings = data['man_settings']['smd_res']
    man_cercap_settings = data['man_settings']['smd_cer_cap']
    man_tantcap_settings = data['man_settings']['smd_tant_cap']

    manufacturers_settings = ManufacturerManager.Settings(chip_res_man=man_res_settings, chip_cap_man=man_cercap_settings, chip_tant_cap_man=man_tantcap_settings)

    wb = Workbook()
    ws = wb.active
    ws.append([column['title'] for column in selected_columns])

    row_number = 1
    for item in spec_list:
        model.CorrectionCount(item, device_count, tech_reseve)
        parse_res = model.HandleRowBOM(item, ['elitan', 'chipdip', 'platan', 'promelec', 'dko_electronshik'], manufacturers_settings, parser_filter)

        store_links = {
            store['store_name']: store['order_link']
            for store in parse_res['ordering']
        }
        values = {
            'number': row_number,
            'designator': item['designator'],
            'source_name': item['name'],
            'component_type': parse_res['type'],
            'parameters': '\n'.join(parse_res['params']),
            'english_name': parse_res['en_text_item'],
            'russian_name': parse_res['ru_text_item'],
            'manufacturer_part_name': parse_res['manufacturer_info']['component_name'],
            'manufacturer': parse_res['manufacturer_info']['manufacturer_name'],
            'quantity': int(item['count']),
            'store_elitan': store_links.get('elitan', ''),
            'store_chipdip': store_links.get('chipdip', ''),
            'store_platan': store_links.get('platan', ''),
            'store_promelec': store_links.get('promelec', ''),
            'store_dko_electronshik': store_links.get('dko_electronshik', ''),
        }
        ws.append([values[column['key']] for column in selected_columns])
        row_number += 1

    for cell in ws[1]:
        cell.font = Font(bold=True)
        cell.alignment = Alignment(wrap_text=True, vertical='top')

    for column_index, column in enumerate(selected_columns, start=1):
        column_letter = get_column_letter(column_index)
        ws.column_dimensions[column_letter].width = column['width']

        for cell in ws[column_letter][1:]:
            cell.alignment = Alignment(wrap_text=True, vertical='top')
            if column.get('link') and cell.value:
                cell.style = "Hyperlink"
                cell.hyperlink = cell.value
                cell.value = "ссылка"

    if selected_columns and selected_columns[0]['key'] == 'number':
        ws['A1'].alignment = Alignment(
            wrap_text=True,
            vertical='top',
            horizontal='right',
        )

    output = BytesIO()
    # Сохраняем рабочую книгу в память
    wb.save(output)
    output.seek(0)  # Перематываем указатель в начало файла

    # Отправляем файл в ответ на запрос
    return send_file(output, as_attachment=True, download_name="ResultTable1.xlsx", mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    

@app.route('/bom_data', methods=['GET', 'POST'])
def handle_bom():
    parser_filter = Filter()
    bom = request.form.get('bom')
    spec_list = __GetSpec(bom)

    device_count = int(request.form.get('count'))
    tech_reseve = float(request.form.get('tech_res'))

    parser_filter.SetSkipingEndurance('R', request.form.get('res_filter[skip_power]') == 'true')
    parser_filter.SetSkipingTolerance('R', request.form.get('res_filter[skip_tol]') == 'true')

    parser_filter.SetSkipingTolerance('C', request.form.get('cap_filter[skip_tol]') == 'true')
    parser_filter.SetSkipingEndurance('C', request.form.get('cap_filter[skip_voltage]') == 'true')
    parser_filter.SetSkipingVariant('C', request.form.get('cap_filter[skip_dielectric]') == 'true')


    man_res_settings = request.form.get('man_settings[smd_res]')
    man_cercap_settings = request.form.get('man_settings[smd_cer_cap]')
    man_tantcap_settings = request.form.get('man_settings[smd_tant_cap]')


    res_list = []
    for item in spec_list:
        try:
            model.CorrectionCount(item, device_count, tech_reseve)

            manufacturers_settings = ManufacturerManager.Settings(chip_res_man=man_res_settings, chip_cap_man=man_cercap_settings, chip_tant_cap_man=man_tantcap_settings)

            parse_res = model.HandleRowBOM(item, ['elitan', 'chipdip', 'platan', 'promelec', 'dko_electronshik'], manufacturers_settings, parser_filter)

            temp_item = {
                'designator': item['designator'],
                'name': item['name'],
                'type': parse_res['type'],
                'count': item['count'],
                'params': parse_res['params'],
                'ordering': parse_res['ordering'],
                'ru': parse_res['ru_text_item'],
                'en': parse_res['en_text_item'],
                'elitan': parse_res['elitan_text_item'],
                'manufacturer_info': parse_res['manufacturer_info']
                }
            res_list.append(temp_item)
        except Exception:
            line_number = item['source_line']
            app.logger.exception('Failed to process BOM item on line %s', line_number)
            return {
                'error': {
                    'code': 'bom_item_processing_failed',
                    'line': line_number,
                    'message': f'Не удалось обработать элемент в строке {line_number}.'
                }
            }, 422

    return res_list
    



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5003)
