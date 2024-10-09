import sys, os
import re

from Components import ComponentBase as Component
from ParamFilter import FilterObj as Filter

from Stores import en_to_ru_units_decoder


def GenerateFindRequest(component_obj, filter):
    return en_to_ru_units_decoder.GetParametersString(component_obj, filter)


def GenerateFindLink(component_obj, filter):
    find_str = GenerateFindRequest(component_obj, filter)
    find_str = find_str.replace(' ', '+')
    find_str = find_str.replace('%', '%25')
    pattern = ""

    

    while True:
        pattern = re.search(r'[а-яА-я][а-яА-я]?[а-яА-я]?[а-яА-я]?', find_str)
        new_str = ''
        if pattern:
            pattern = pattern[0]
            ref_patern = pattern
            byte_array = pattern.encode("cp1251")

            for item in byte_array:
                new_str += '%' + (hex(item).replace('0x', '')).upper()
            find_str = find_str.replace(ref_patern, new_str)
        else:
            break

    res = f'https://www.platan.ru/cgi-bin/qwery_i.pl?code={find_str}'
    return res