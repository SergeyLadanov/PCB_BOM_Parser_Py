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
                probe = re.search(r'.[0][а-яА-Я]', Value)
                if probe:
                    Value = Value.replace('.0','')

            if component_obj.GetDesignator() == 'C':
                Value = re.sub(r'F', 'Ф', Value)
                Value = re.sub(r'u', 'мк', Value)
                Value = re.sub(r'p', 'п', Value)
                probe = re.search(r'.[0][а-яА-Я]', Value)
                if probe:
                    Value = Value.replace('.0','')


            if component_obj.GetDesignator() == 'L':
                Value = re.sub(r'H', 'Гн', Value)
                Value = re.sub(r'u', 'мк', Value)
                Value = re.sub(r'n', 'н', Value)
                probe = re.search(r'.[0][а-яА-Я]', Value)
                if probe:
                    Value = Value.replace('.0','')

            res = res + Value

        if len(Tolerance):
            Tolerance = Tolerance.replace('.0', '') 
            Tolerance = Tolerance + '%'
            res = res + ' ' + Tolerance

        if len(Endurance):
            if component_obj.GetDesignator() == 'R':
                Endurance = re.sub(r'[W]', 'Вт', Endurance)
                probe = re.search(r'.[0][а-яА-Я]', Endurance)
                if probe:
                    Endurance = Endurance.replace('.0','')

            if component_obj.GetDesignator() == 'C':
                Endurance = re.sub(r'V', 'В', Endurance)
                probe = re.search(r'.[0][а-яА-Я]', Endurance)
                if probe:
                    Endurance = Endurance.replace('.0','')


            if component_obj.GetDesignator() == 'L':
                Endurance = re.sub(r'A', 'А', Endurance)
                probe = re.search(r'.[0][а-яА-Я]', Endurance)
                if probe:
                    Endurance = Endurance.replace('.0','')

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