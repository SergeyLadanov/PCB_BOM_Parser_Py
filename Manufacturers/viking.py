import sys, os
import re

from Components import ComponentBase as Component
from ParamFilter import FilterObj as Filter

def __GetNumberOfDigits(n):
    return len(str(abs(int(n))))


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
            res = Component.remove_trailing_zero(str(component_obj.GetValue()))
            if res.find('.') != -1:
                res = str(component_obj.GetValue()).replace('.', 'R')
            else:
                res = str(component_obj.GetValue()) + 'R'

        probe = re.search(r'.0[A-Z]', res)

        if (probe):
            res = res.replace('.0', '')
        
        if (res != '*'):
            temp = 6 - len(res)
            if (temp > 2):
                temp = 2
            res = '-' * temp + res
    return res


def __GenerateTolerance(component_obj):
    res = "*"
    if component_obj.GetTolerance() == 0.1:
        res = "B"

    if component_obj.GetTolerance() == 0.5:
        res = "D"

    if component_obj.GetTolerance() == 1.0:
        res = "F"

    if component_obj.GetTolerance() == 5.0:
        res = "J"
    
    if component_obj.GetTolerance() == 10.0:
        res = "K"

    if component_obj.GetTolerance() == 20.0:
        res = "M"

    return res

def __GenerateCaseForResistors(component_obj):
    res = "*"
    if component_obj.GetCase() == "0402":
        res = "02"

    if component_obj.GetCase() == "0603":
        res = "03"

    if component_obj.GetCase() == "0805":
        res = "05"

    if component_obj.GetCase() == "1206":
        res = "06"

    if component_obj.GetCase() == "2512":
        res = "12"
    

    return res


def GenerateFindRequest(component_obj, filter):
    res = component_obj.GetName()

    if component_obj.GetManufacturerPartNumber() != "":
        res = component_obj.GetManufacturerPartNumber()
    else:
        if component_obj.GetDesignator() == "R":
            if component_obj.GetMountWay() == component_obj.MOUNT_WAY_SMD:
                tolerance_str = __GenerateTolerance(component_obj) if not filter.GetFilter(component_obj.GetDesignator()).SkipTolerance else '*'
                # Две буквы серии резистора не генерируются
                res = f'CR-{__GenerateCaseForResistors(component_obj):s}{tolerance_str:s}L*{__GenerateValueForResistor(component_obj):s}'
    return res
