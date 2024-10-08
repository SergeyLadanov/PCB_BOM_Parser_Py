import sys, os
import re

sys.path.append(os.path.abspath(os.path.join('../Components')))
sys.path.append(os.path.abspath(os.path.join('..')))

import ComponentBase as Component
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
                Value = re.sub(r'[Oo][Hh][Mm]', 'Ом', Value)
                Value = re.sub(r'[kK]', 'к', Value)
                Value = re.sub(r'[M]', 'М', Value)
                Value = Component.remove_trailing_zero(Value)
                # probe = re.search(r'.[0][а-яА-Я]', Value)
                # if probe:
                #     Value = Value.replace('.0','')

            if component_obj.GetDesignator() == 'C':
                Value = re.sub(r'F', 'Ф', Value)
                Value = re.sub(r'u', 'мк', Value)
                Value = re.sub(r'p', 'п', Value)
                Value = Component.remove_trailing_zero(Value)



            if component_obj.GetDesignator() == 'L':
                Value = re.sub(r'H', 'Гн', Value)
                Value = re.sub(r'u', 'мк', Value)
                Value = re.sub(r'n', 'н', Value)
                Value = Component.remove_trailing_zero(Value)


            res = res + Value

        if len(Tolerance) and component_obj.GetTolerance() != 0.0:
            Tolerance = Tolerance.replace('.0', '') 
            Tolerance = Tolerance + '%'
            res = res + ' ' + Tolerance

        if len(Endurance) and component_obj.GetEndurance() != 0.0:
            if component_obj.GetDesignator() == 'R':
                Endurance = re.sub(r'[W]', 'Вт', Endurance)
                Endurance = Component.remove_trailing_zero(Endurance)


            if component_obj.GetDesignator() == 'C':
                Endurance = re.sub(r'V', 'В', Endurance)
                Endurance = Component.remove_trailing_zero(Endurance)



            if component_obj.GetDesignator() == 'L':
                Endurance = re.sub(r'A', 'А', Endurance)
                Endurance = Component.remove_trailing_zero(Endurance)

            res = res + ' ' + Endurance

        if len(DesignVariant):
            res = res + ' ' + DesignVariant

        if len(Case):
            probe = re.search(r'[A-Z]', Case)
            if probe:
                Case = 'Тип ' + Case
            res = res + ' ' + Case

    else:
        res = ManufacturerPartNumber
    

    return res