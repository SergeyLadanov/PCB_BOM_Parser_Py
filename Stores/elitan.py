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
    units_str = component_obj.GetUnitsValue()

    probe = re.search(r'[а-яА-Я]?Ом', units_str)

    if probe:
        units_str = re.sub(r'[Ооo][hH]?[мМm]', 'Ohm', units_str)
        units_str = re.sub(r'[кK]', 'k', units_str)
        units_str = re.sub(r'[М]', 'M', units_str)






    probe = re.search(r'[a-zA-Z]?Ohm', units_str)
    if  probe:
        probe = probe[0].replace('Ohm', '')
        if probe != "":
            number_str = str(component_obj.GetValue())
            res = number_str.replace('.', probe.upper())

            probe = re.search(r'[A-Z][0]*[1-9]', res)

            if not probe:
                res = res[:-1]
        else:
            res = str(component_obj.GetValue()) + 'R'

        probe = re.search(r'.0[A-Z]', res)

        if (probe):
            res = res.replace('.0', '')
    return res


def __GenerateToleranceForResistor(component_obj):
    res = "*"
    if component_obj.GetTolerance() == 0.1:
        res = "B"

    if component_obj.GetTolerance() == 0.5:
        res = "D"

    if component_obj.GetTolerance() == 1.0:
        res = "F"

    if component_obj.GetTolerance() == 5.0:
        res = "J"

    return res


def __GenerateValueForCapacitor(component_obj):
    pass




def GenerateFindRequest(component_obj):
    res = ""

    if component_obj.GetManufacturerPartNumber() != "":
        res = component_obj.GetManufacturerPartNumber()
    else:
        if component_obj.GetMountWay() == component_obj.MOUNT_WAY_SMD:
            if component_obj.GetDesignator() == "R":
                res = f'SMRES/{component_obj.GetCase():s}-{__GenerateValueForResistor(component_obj):s}-{__GenerateToleranceForResistor(component_obj):s}'

    return res
