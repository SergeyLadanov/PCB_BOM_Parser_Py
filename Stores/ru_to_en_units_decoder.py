import sys, os
import re

sys.path.append(os.path.abspath(os.path.join('../Components')))
sys.path.append(os.path.abspath(os.path.join('..')))

import ComponentBase as Component
from ParamFilter import FilterObj as Filter


def GetParametersString(component_obj, filter):
    pass