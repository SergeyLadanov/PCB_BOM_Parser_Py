import sys, os
import re

sys.path.append(os.path.abspath(os.path.join('../Components')))
sys.path.append(os.path.abspath(os.path.join('..')))

import ComponentBase as Component
from ParamFilter import FilterObj as Filter


import en_to_ru_units_decoder


def GenerateFindRequest(component_obj, filter):
    return en_to_ru_units_decoder.GetParametersString(component_obj, filter)


def GenerateFindLink(component_obj, filter):
    find_str = GenerateFindRequest(component_obj, filter)
    find_str = find_str.replace(' ', '+')
    find_str = find_str.replace('%', '%25')
    res = f'https://www.promelec.ru/search/?query={find_str}'
    return res