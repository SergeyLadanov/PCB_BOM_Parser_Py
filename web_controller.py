#!/usr/bin/env python3
from flask import Flask, render_template, request, make_response
from functools import wraps
import json
import os
import sys
import socket


path = os.path.realpath(os.path.dirname(sys.argv[0]))

#------------------------------
app = Flask(__name__)


def __GetComponentList(data):
    result = []
    rows = data.split('\n')

    for row in rows:
        try:
            name = row.split('\t')[0]
            if name != "":
                result.append(name)
        except:
            continue

    return result

def __GetCountList(data):
    result = []
    rows = data.split('\n')

    for row in rows:
        try:
            count = row.split('\t')[1]
            if count != "":
                result.append(count)
        except:
            continue

    return result

    


@app.route("/")
def index():
    return render_template('index.html')

    

@app.route('/bom_data', methods=['GET', 'POST'])
def handle_bom():
    bom = request.form.get('bom')
    component_list = __GetComponentList(bom)
    count_list = __GetCountList(bom)
    res_list = []
    for item in component_list:
        temp_item = { 
            'name': item, 
            'type': 'none',
            'count': 1,
            'params': 1,
            'links': ['test'] 
            }
        res_list.append(temp_item)

    return res_list
    



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5003)