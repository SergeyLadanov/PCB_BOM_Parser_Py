import sys, os
sys.path.append(os.path.abspath(os.path.join('Components')))

import ComponentBase as Component

import re


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
    res.PrintInfo()
