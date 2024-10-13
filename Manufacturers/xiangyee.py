import sys, os
import re

from Components import ComponentBase as Component
from ParamFilter import FilterObj as Filter


def __GetNumberOfDigits(n):
    return len(str(abs(int(n))))


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


def __GenerateValueForCapacitor(component_obj):
    res = ""
    units_str = component_obj.GetUnitsValue()

    val = component_obj.GetValue()

    probe = re.search(r'[а-яА-Я]?[а-яА-Я]?Ф', units_str)

    if probe:
        units_str = re.sub(r'[фФ]', '', units_str)
        units_str = re.sub(r'мк', 'u', units_str)
        units_str = re.sub(r'[нН]', 'n', units_str)
        units_str = re.sub(r'[пП]', 'p', units_str)

    cap_val_factors = {
        'u': 1000000,
        'n': 1000,    
        'p': 1,   
    }

    value_pf = cap_val_factors[units_str] * val
    digits_count = __GetNumberOfDigits(value_pf)
    if (digits_count >= 2):
        value_pf = value_pf / (10 ** (digits_count-2))
        digits_count = digits_count - 2
        res = str(value_pf)
        res = f'{Component.remove_trailing_zero(res)}{digits_count}' 
    else:
        res = str(value_pf)
        if res.find('.') != -1:
            res = res.replace('.', 'R')
    
       
    return res


def __GenerateEnduranceForCapacitor(component_obj):
    res = "*"
    if component_obj.GetEndurance() == 6.3:
        res = "6R3"

    if component_obj.GetEndurance() == 10.0:
        res = "010"

    if component_obj.GetEndurance() == 16.0:
        res = "016"

    if component_obj.GetEndurance() == 25.0:
        res = "025"
    
    if component_obj.GetEndurance() == 50.0:
        res = "050"

    if component_obj.GetEndurance() == 35.0:
        res = "035"

    return res


def GenerateFindRequest(component_obj, filter):
    res = component_obj.GetName()

    if component_obj.GetManufacturerPartNumber() != "":
        res = component_obj.GetManufacturerPartNumber()
    else:
        if component_obj.GetDesignator() == "C":
            if component_obj.GetMountWay() == component_obj.MOUNT_WAY_SMD:

                endurance_str = __GenerateEnduranceForCapacitor(component_obj) if not filter.GetFilter(component_obj.GetDesignator()).SkipEndurance else '*'
                tolerance_str = __GenerateTolerance(component_obj) if not filter.GetFilter(component_obj.GetDesignator()).SkipTolerance else '*'
                # designvar_str = component_obj.GetDesignVariant().upper() if not filter.GetFilter(component_obj.GetDesignator()).SkipVariant else '*'

                case_probe = re.search(r'[A-Z]', component_obj.GetCase())
                
                if case_probe:
                    res = f'CA.*-{component_obj.GetCase():s}{endurance_str:s}{tolerance_str:s}{__GenerateValueForCapacitor(component_obj):s}*'

    return res
