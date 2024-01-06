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

@app.route("/")
def index():
    return render_template('index.html')



@app.route('/get_data', methods=['GET', 'POST'])
def control():
    try:
        sock = socket.socket()
        sock.connect(('localhost', 9090))
        data = sock.recv(1024)
        sock.close()
        data = data.decode()
    except:
        #data = "49.1;26.8\r\n09:11 10/06/22\r\n26.7;26.7;\r\n49.1;26.7;\r\n09:00;09:30;\r\n"
        data = "none;none\r\nnone\r\n"
    if data is None:
        return "No data"
    else:
        return data
    



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5003)