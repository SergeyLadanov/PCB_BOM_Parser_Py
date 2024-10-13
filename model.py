import sys, os

from Components import ComponentBase as Component

import re

from ParamFilter import FilterObj as Filter

import math

from Stores import en_to_ru_units_decoder, ru_to_en_units_decoder

from Stores import elitan as elitanGenerator, platan, chipdip, promelec, dko_electronshik

import ManufacturerManager


import version


def GetVersion():
    return version.Value


def GetEnSpecItem(spec_item, filter = None):
    pass


def GetRuSpecItem(spec_item, filter = None):
    pass



def CorrectionCount(spec_item, device_count = 1, tech_reserve = 1.0):
    spec_item['count'] = int(spec_item['count']) * device_count
    spec_item['count'] = math.ceil(float(spec_item['count']) * tech_reserve)

    return spec_item


def __GetComponentClass(spec_component):
        res = "-"
        if spec_component.GetDesignator() == "C":
            res = "Конденсатор"

        if spec_component.GetDesignator() == "R":
            res = "Резистор"

        if spec_component.GetDesignator() == "L":
            res = "Индуктивность"

        return res 



def __GetParamArray(spec_component):
    EnduranceName = None
    mout_way_str = ""

    isParameters = False


    res = [
        f'Способ монтажа: -',
        f'Значение: -',
        f'Корпус: -',
        f'Точность: -',
        f'Тип: -'
    ]


    if spec_component.GetDesignator() == "C":
        EnduranceName = "Напряжение"
        isParameters = True

    if spec_component.GetDesignator() == "R":
        EnduranceName = "Мощность"
        isParameters = True

    if spec_component.GetDesignator() == "L":
        EnduranceName = "Ток"
        isParameters = True
    

    if spec_component.GetMountWay() == spec_component.MOUNT_WAY_AXIAL:
        mout_way_str = "Axial"

    if spec_component.GetMountWay() == spec_component.MOUNT_WAY_SMD:
        mout_way_str = "SMD"

    if isParameters:
        res = [
            f'Способ монтажа: {mout_way_str:s}',
            f'Значение: {spec_component.GetValue():.1f} {spec_component.GetUnitsValue():s}',
            f'Корпус: {spec_component.GetCase():s}',
            f'Точность: {spec_component.GetTolerance():.1f} %',
            f'Тип: {spec_component.GetDesignVariant():s}'
            ]

        if EnduranceName:
            enndurance_str = f'{EnduranceName:s}: {spec_component.GetEndurance():.3f} {spec_component.GetUnitsEndurance():s}'
            res.insert(2, enndurance_str)

    return res



def __GetOrderName(spec_component, store_name, filter = None, manufacturer_settings = None):
    res = '-'
    if store_name == 'elitan':
        res = elitanGenerator.GenerateFindRequest(spec_component, filter)

    if store_name == 'chipdip':
        res = chipdip.GenerateFindRequest(spec_component, filter)

    if store_name == 'platan':
        res = platan.GenerateFindRequest(spec_component, filter)

    if store_name == 'promelec':
        res = promelec.GenerateFindRequest(spec_component, filter)

    if store_name == 'dko_electronshik':
        res = dko_electronshik.GenerateFindRequest(spec_component, filter, manufacturer_settings)

    return res


def __GetOrderLink(spec_component, store_name, filter = None, manufacturer_settings = None):

    res = '-'

    if store_name == 'elitan':
       res = elitanGenerator.GenerateFindLink(spec_component, filter)

    if store_name == 'chipdip':
        res = chipdip.GenerateFindLink(spec_component, filter)

    if store_name == 'platan':
        res = platan.GenerateFindLink(spec_component, filter)

    if store_name == 'promelec':
        res = promelec.GenerateFindLink(spec_component, filter)

    if store_name == 'dko_electronshik':
        res = dko_electronshik.GenerateFindLink(spec_component, filter, manufacturer_settings)

    return res


def HandleRowBOM(spec_item, store_array, manufacturers_settings, filter = None):

    res = { 
        'type': "-",
        'params': [],
        'ordering': [],
        'ru_text_item': "-",
        'en_text_item': "-",
        'elitan_text_item': "-",
        'manufacturer_name': "-",
        }
    
    manNameGenerator = ManufacturerManager.NameGenerator(manufacturers_settings)

    parse_res = Component.ComponentBase(spec_item['name'])

    res['type'] = __GetComponentClass(parse_res)
    res['params'] = __GetParamArray(parse_res)

    ParamFilter = filter

    if not ParamFilter:
        ParamFilter = Filter()
    
    for store in store_array:
        store_item = {
            'store_name': store,
            'order_name': __GetOrderName(parse_res, store, ParamFilter, manufacturers_settings),
            'order_link':  __GetOrderLink(parse_res, store, ParamFilter, manufacturers_settings)
        }

        res['ordering'].append(store_item)
    
    res['ru_text_item'] = en_to_ru_units_decoder.GetParametersString(parse_res, filter)
    res['en_text_item'] = ru_to_en_units_decoder.GetParametersString(parse_res, filter)
    res['elitan_text_item'] = elitanGenerator.GenerateFindRequest(parse_res, filter)

    man_name, man = manNameGenerator.GetManufacturerName(parse_res, filter)

    res['manufacturer_name'] = {
        'manufacturer': man,
        'name': man_name
    }
    
    return res
