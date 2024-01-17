import sys, os
sys.path.append(os.path.abspath(os.path.join('Components')))
sys.path.append(os.path.abspath(os.path.join('Stores')))

import ComponentBase as Component

import re

import elitan as elitanGenerator

from ParamFilter import FilterObj as Filter



def __CorrectionCount(spec_item_name, device_count = 1, tech_reserve = 1.0):
    pass

def __GetParamString(spec_item_name, filter = None):
    pass

def __GetOrderName(spec_item_name, store_name, filter = None):
    pass

def __GetOrderLink(order_name, store_name):
    pass


# testFil = Filter()


# # testFil.SetSkipingEndurance('C', True)
# # testFil.SetSkipingTolerance('R', True)

# testFil.SetSkipingTolerance('C', True)
