import sys, os
import re

from Components import ComponentBase as Component
from ParamFilter import FilterObj as Filter
import ManufacturerManager



def GenerateFindRequest(component_obj, filter, manufacturer_settings):
    res = ""
    name_generator = ManufacturerManager.NameGenerator(manufacturer_settings)
    res, man = name_generator.GetManufacturerName(component_obj, filter)
    return res




def GenerateFindLink(component_obj, filter, manufacturer_settings):

    find_str = GenerateFindRequest(component_obj, filter, manufacturer_settings)

    find_str = find_str.replace(' ', '+')
    find_str = find_str.replace('%', '%25')

    link_str = f'https://www.electronshik.ru/search?query={find_str:s}'

    return link_str
