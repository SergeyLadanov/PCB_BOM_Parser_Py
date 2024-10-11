import sys, os
import re

from Components import ComponentBase as Component
from ParamFilter import FilterObj as Filter


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


def __GenerateValueForCapacitor(component_obj):
    res = ""
    units_str = component_obj.GetUnitsValue()

    val = component_obj.GetValue()

    probe = re.search(r'[а-яА-Я]?[а-яА-Я]?Ф', units_str)

    if probe:
        units_str = re.sub(r'[фФ]', '', units_str)
        units_str = re.sub(r'[мк]', '', units_str)
        units_str = re.sub(r'[нН]', 'n', units_str)
        units_str = re.sub(r'[пП]', 'p', units_str)

    units_str = re.sub(r'[fF]', '', units_str)
    units_str = re.sub(r'[uU]', '', units_str)


    res = re.sub(r'\.[0][0]?[0]?', '', str(val)) + units_str.upper()

    
    
    return res


def __GenerateEnduranceForCapacitor(component_obj):
    res = re.sub(r'\.[0][0]?[0]?', '', str(component_obj.GetEndurance()))
    return res

def GenerateFindRequest(component_obj, filter):
    res = ""

    if component_obj.GetManufacturerPartNumber() != "":
        res = component_obj.GetManufacturerPartNumber()
    else:
        if component_obj.GetDesignator() == "R":
            if component_obj.GetMountWay() == component_obj.MOUNT_WAY_SMD:
                tolerance_str = __GenerateTolerance(component_obj) if not filter.GetFilter(component_obj.GetDesignator()).SkipTolerance else '*'
                # Две буквы серии резистора не генерируются
                res = f'*{component_obj.GetCase():s}{tolerance_str:s}R-07{__GenerateValueForResistor(component_obj):s}L'
        if component_obj.GetDesignator() == "C":
            if component_obj.GetMountWay() == component_obj.MOUNT_WAY_SMD:

                endurance_str = __GenerateEnduranceForCapacitor(component_obj) if not filter.GetFilter(component_obj.GetDesignator()).SkipEndurance else '*'
                tolerance_str = __GenerateTolerance(component_obj) if not filter.GetFilter(component_obj.GetDesignator()).SkipTolerance else '*'
                designvar_str = component_obj.GetDesignVariant().upper() if not filter.GetFilter(component_obj.GetDesignator()).SkipVariant else '*'

                case_probe = re.search(r'[0-9][0-9][0-9][0-9]', component_obj.GetCase())

                if case_probe:
                    res = f'SMCCAP/{component_obj.GetCase():s}-{endurance_str:s}-{__GenerateValueForCapacitor(component_obj):s}-{tolerance_str:s}-{designvar_str:s}'
                
                case_probe = re.search(r'[A-Z]', component_obj.GetCase())

                if case_probe:
                    res = f'SMTCAP/{component_obj.GetCase():s}-{endurance_str:s}-{__GenerateValueForCapacitor(component_obj):s}-{tolerance_str:s}-*'


    return res
