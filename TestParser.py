import sys, os

from  Components import ComponentBase as Component

import re

from Stores import elitan as elitanGenerator, chipdip, platan, en_to_ru_units_decoder

from ParamFilter import FilterObj as Filter

from Manufacturers import yageo

import ManufacturerManager



testFil = Filter()

test_encode = "Ом".encode("cp1251")


testFil.SetSkipingEndurance('C', True)
# testFil.SetSkipingTolerance('R', True)

# testFil.SetSkipingTolerance('C', True)

test = [
    "1001312",
    "12pF 1% 50V NP0 0603",
    "100uF 10% 10V Tantalum Case D",
    "0.1uF 1% 16V X7R 0603",
    "1uF 1% 16V X7R 0603",
    "4.7uF 1% 16V X7R 0603",
    "1pF 1% 50V NP0 0603",
    "820pF 1% 50V NP0 0603",
    "4.7uF 10% 10V Tantalum Case A",
    "ME6211C33M5G",
    "MCP73831T-2ACI/OT",
    "DWM1000",
    "nRF52840-QIAA nRF52840-QIAA",
    "RA-08H",
    "MAX16054AZT+T",
    "LSM6DSLTR STMicroelectronics",
    "4.7 nH 0.1 A BLM18HG102SN1D",
    "0 1% 0.063W 0603",
    "5.1k 1% 0.063W 0603",
    "1.5k 1% 0.063W 0603",
    "22 1% 0.063W 0603",
    "10 1% 0.063W 0603",
    "10k 1% 0.063W 0603",
    "1 1% 0.063W 0603",
    "47k 1% 0.063W 0603",
    "2.2k 1% 0.063W 0603",
    "100 1% 0.063W 0603",
    "4.7k 1% 0.063W 0603",
    "470 1% 0.063W 0603",
    "B3U-3100PM",
    "SP0503BAHTG Littelfuse",
    "VS-10BQ100TRPbF Vishay",
    "GNL-3012GD",
    "GNL-3012HD",
    "IRLML2244TRPBF",
    "IRLML2502TRPBF",
    "WF-2R",
    "PLS-6",
    "PLS-3",
    "1054500101 Molex",
    "32.768 кГц KX-327S 32.768 кГц",
    "32 МГц KX-7 32 МГц"
    ]


for item in test:
    res = Component.ComponentBase(item)
    # print(f'Elitan name: {elitanGenerator.GenerateFindRequest(res, testFil):s}')
    # print(f'Elitan link: {elitanGenerator.GenerateFindLink(res, testFil):s}')
    #print(f'Translated string: {en_to_ru_units_decoder.GetParametersString(res, testFil):s}')
    # print(f'Chipdip: {chipdip.GenerateFindRequest(res, testFil):s}')
    # print(f'Platan link: {platan.GenerateFindLink(res, testFil):s}')
    # res.PrintInfo()
    

print("\r\n-----------------------------------\r\n")

test = [
    "1001312",
    "12 пФ 1% 50В NP0 0603",
    "4.7 пФ 1% 50В NP0 0603",
    "100 мкФ 10% 10В тант. тип D",
    "0.1 мкФ 1% 16В X7R 0603",
    "1 мкФ 1% 16В X7R 0603",
    "4.7 мкФ 1% 16В X7R 0603",
    "1 пФ 1% 50В NP0 0603",
    "820 пФ 1% 50В NP0 0603",
    "4.7 мкФ 10% 10В тант. тип A",
    "ME6211C33M5G",
    "MCP73831T-2ACI/OT",
    "DWM1000",
    "nRF52840-QIAA nRF52840-QIAA",
    "RA-08H",
    "MAX16054AZT+T",
    "LSM6DSLTR STMicroelectronics",
    "4.7 нГн 0.1 А BLM18HG102SN1D",
    "0 Ом 1% 0.063 Вт 0603",
    "5.1 кОм 1% 0.063 Вт 0603",
    "1.5 кОм 1% 0.063 Вт 0603",
    "22 Ом 1% 0.063 Вт 0603",
    "10 Ом 1% 0.063 Вт 0603",
    "10 кОм 1% 0.063 Вт 0603",
    "1 Ом 1% 0.063 Вт 0603",
    "47 кОм 1% 0.063 Вт 0603",
    "2.2 кОм 1% 0.063 Вт 0603",
    "100 Ом 1% 0.063 Вт 0603",
    "4.7 кОм 1% 0.063 Вт 0603",
    "470 Ом 1% 0.063 Вт 0603",
    "B3U-3100PM",
    "SP0503BAHTG Littelfuse",
    "VS-10BQ100TRPbF Vishay",
    "GNL-3012GD",
    "GNL-3012HD",
    "IRLML2244TRPBF",
    "IRLML2502TRPBF",
    "WF-2R",
    "PLS-6",
    "PLS-3",
    "1054500101 Molex",
    "32.768 кГц KX-327S 32.768 кГц",
    "32 МГц KX-7 32 МГц"
    ]


settings = ManufacturerManager.Settings()
man_name_generator = ManufacturerManager.NameGenerator(settings)

for item in test:
    res = Component.ComponentBase(item)
    #print(f'Elitan name: {elitanGenerator.GenerateFindRequest(res, testFil):s}')
    #print(f'Elitan link: {elitanGenerator.GenerateFindLink(res, testFil):s}')
    print(man_name_generator.GetManufacturerName(res, testFil))
    # print(yageo.GenerateFindRequest(res, testFil))
    
    #res.PrintInfo()
