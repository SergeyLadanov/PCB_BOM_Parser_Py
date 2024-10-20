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


def __GenerateCaseForCapacitor(component_obj):
    res = "*"
    if component_obj.GetCase() == '0402':
        res = "15"

    if component_obj.GetCase() == '0603':
        res = "18"

    if component_obj.GetCase() == '0805':
        res = "21"

    if component_obj.GetCase() == '1206':
        res = "31"

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
        
    units_str = re.sub(r'[fF]', '', units_str)

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
        res = "0J"

    if component_obj.GetEndurance() == 10.0:
        res = "1A"

    if component_obj.GetEndurance() == 16.0:
        res = "1C"

    if component_obj.GetEndurance() == 25.0:
        res = "1E"
    
    if component_obj.GetEndurance() == 50.0:
        res = "1H"

    if component_obj.GetEndurance() == 100.0:
        res = "2A"

    return res


def __GenerateDesignVariantForCapacitor(component_obj):
    res = "*"
    if component_obj.GetDesignVariant() == "X7R":
        res = "R7"

    if component_obj.GetDesignVariant() == "X5R":
        res = "R6"

    if component_obj.GetDesignVariant() == "NP0" or  component_obj.GetDesignVariant() == "NPO":
        res = "5C"

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
                designvar_str = __GenerateDesignVariantForCapacitor(component_obj) if not filter.GetFilter(component_obj.GetDesignator()).SkipVariant else '*'

                if designvar_str.upper() == "NP0":
                    designvar_str = "NPO"

                case_probe = re.search(r'[0-9][0-9][0-9][0-9]', component_obj.GetCase())
                
                if case_probe:
                    res = f'GRM{__GenerateCaseForCapacitor(component_obj):s}*{designvar_str:s}{endurance_str:s}{__GenerateValueForCapacitor(component_obj):s}{tolerance_str:s}*'


    return res
