import sys, os
sys.path.append(os.path.abspath(os.path.join('Components')))
sys.path.append(os.path.abspath(os.path.join('Stores')))

import ComponentBase as Component

import re

import elitan as elitanGenerator

from ParamFilter import FilterObj as Filter

import math



def __CorrectionCount(spec_item, device_count = 1, tech_reserve = 1.0):
    spec_item['count'] = spec_item['count'] * device_count
    spec_item['count'] = math.ceil(spec_item['count'] * tech_reserve)

    return spec_item

def __GetParamString(spec_item, filter = None):
    pass

def __GetOrderName(spec_item, store_name, filter = None):
    pass

def __GetOrderLink(spec_item, store_name, filter = None):
    if store_name == 'elitan':
        pass

    if store_name == 'chipdip':
        pass

    if store_name == 'platan':
        pass


# testFil = Filter()


# # testFil.SetSkipingEndurance('C', True)
# # testFil.SetSkipingTolerance('R', True)

# testFil.SetSkipingTolerance('C', True)
