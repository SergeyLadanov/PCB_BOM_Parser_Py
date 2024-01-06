#!/usr/bin/env python3
try:
    from cheroot.wsgi import Server as WSGIServer, PathInfoDispatcher
except ImportError:
    from cherrypy.wsgiserver import CherryPyWSGIServer as WSGIServer, WSGIPathInfoDispatcher as PathInfoDispatcher

from web_controller import app
import subprocess
import sys
import os

path = os.path.realpath(os.path.dirname(sys.argv[0]))



d = PathInfoDispatcher({'/': app})
server = WSGIServer(('0.0.0.0', 5003), d)

if __name__ == '__main__':
   try:
      server.start()
   except KeyboardInterrupt:
      server.stop()