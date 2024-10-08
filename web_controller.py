#!/usr/bin/env python3
from flask import Flask, render_template, request, make_response
from functools import wraps
import json
import os
import sys
import socket
from ParamFilter import FilterObj as Filter

import model


path = os.path.realpath(os.path.dirname(sys.argv[0]))

#------------------------------
app = Flask(__name__)


def __GetSpec(data):
    result = []
    rows = data.split('\n')

    for row in rows:
        try:
            temp_item = { 
                'name': '', 
                'count': 1, 
                }
            name = row.split('\t')[0]
            if name != "":
                temp_item['name'] = name

            count = row.split('\t')[1]
            if count != "":
                temp_item['count'] = count


            result.append(temp_item)
        except:
            continue

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


    res_list = []
    for item in spec_list:

        model.CorrectionCount(item, device_count, tech_reseve)

        parse_res = model.HandleRowBOM(item, ['elitan', 'chipdip', 'platan', 'promelec'], parser_filter)

        temp_item = { 
            'name': item['name'], 
            'type': parse_res['type'],
            'count': item['count'],
            'params': parse_res['params'],
            'ordering': parse_res['ordering'],
            'ru': parse_res['ru_text_item'],
            'en': parse_res['en_text_item'],
            'elitan': parse_res['elitan_text_item']
            }
        res_list.append(temp_item)

    return res_list
    



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5003)