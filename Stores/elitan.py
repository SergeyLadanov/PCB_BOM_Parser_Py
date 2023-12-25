import sys, os
import re

sys.path.append(os.path.abspath(os.path.join('../Components')))

import ComponentBase as Component


def __count_decimal_places(number):
    number_str = str(number)
    if '.' in number_str:
        return len(number_str.split('.')[1])
    return 0

def __GenerateValueForResistor(component_obj):
    res = ""


    probe = re.search(r'[a-zA-Z]?Ohm', component_obj.GetUnitsValue())
    if  probe:
        probe = probe[0].replace('Ohm', '')
        if probe != "":
            number_str = str(component_obj.GetValue())
            res = number_str.replace('.', probe.upper())
        else:
            res = str(component_obj.GetValue()) + 'R'

        probe = re.search(r'.0[A-Z]', res)

        if (probe):
            res = res.replace('.0', '')


    return res


def __GenerateValueForCapacitor(component_obj):
    pass




def GenerateFindRequest(component_obj):
    res = ""

    if component_obj.GetMountWay() == component_obj.MOUNT_WAY_SMD:
        if component_obj.GetDesignator() == "R":
           res = f'SMRES/{component_obj.GetCase():s}-{__GenerateValueForResistor(component_obj):s}-F'

    return res
