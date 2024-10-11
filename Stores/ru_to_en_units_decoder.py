import sys, os
import re

from Components import ComponentBase as Component
from ParamFilter import FilterObj as Filter


def GetParametersString(component_obj, filter):
    res = ""
    ManufacturerPartNumber = component_obj.GetManufacturerPartNumber()
    Value = str(component_obj.GetValue())+component_obj.GetUnitsValue()
    Tolerance = str(component_obj.GetTolerance()) if not filter.GetFilter(component_obj.GetDesignator()).SkipTolerance else ''
    Endurance = str(component_obj.GetEndurance()) + component_obj.GetUnitsEndurance() if not filter.GetFilter(component_obj.GetDesignator()).SkipEndurance else ''
    DesignVariant = component_obj.GetDesignVariant() if not filter.GetFilter(component_obj.GetDesignator()).SkipVariant else ''
    Case = component_obj.GetCase()

    if ManufacturerPartNumber == "":

        if len(Value) > 0:
            if component_obj.GetDesignator() == 'R':
                Value = re.sub(r'[кК][оО][мМ]', 'k', Value)
                Value = re.sub(r'[М][оО][мМ]', 'M', Value)
                Value = re.sub(r'[оО][мМ]', '', Value)
                Value = Component.remove_trailing_zero(Value)


            if component_obj.GetDesignator() == 'C':
                Value = re.sub(r'мкФ', 'uF', Value)
                Value = re.sub(r'пФ', 'pF', Value)
                Value = re.sub(r'Ф', 'F', Value)
                Value = Component.remove_trailing_zero(Value)
                # probe = re.search(r'.[0]', Value)
                # if probe:
                #     Value = Value.replace('.0','')


            if component_obj.GetDesignator() == 'L':
                Value = re.sub(r'мкГн', 'uH', Value)
                Value = re.sub(r'нГн', 'nH', Value)
                Value = re.sub(r'Гн', 'H', Value)
                Value = Component.remove_trailing_zero(Value)

            res = res + Value

        if len(Tolerance) and component_obj.GetTolerance() != 0.0:
            Tolerance = Tolerance.replace('.0', '') 
            Tolerance = Tolerance + '%'
            res = res + ' ' + Tolerance

        if len(Endurance) and component_obj.GetEndurance() != 0.0:
            if component_obj.GetDesignator() == 'R':
                Endurance = re.sub(r'Вт', 'W', Endurance)
                Endurance = Component.remove_trailing_zero(Endurance)

            if component_obj.GetDesignator() == 'C':
                Endurance = re.sub(r'В', 'V', Endurance)
                Endurance = Component.remove_trailing_zero(Endurance)


            if component_obj.GetDesignator() == 'L':
                Endurance = re.sub(r'А', 'A', Endurance)
                Endurance = Component.remove_trailing_zero(Endurance)

            res = res + ' ' + Endurance

        if len(DesignVariant):
            res = res + ' ' + DesignVariant

        if len(Case):
            probe = re.search(r'[A-Z]', Case)
            if probe:
                Case = 'Tantalum Case ' + Case
            res = res + ' ' + Case

    else:
        res = ManufacturerPartNumber

    return res