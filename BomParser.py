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
    "4.7 nH 0.1 A BLM18HG102SN1D"
    ]


for item in test:
    res = Component.ComponentBase(item)
    res.PrintInfo()
