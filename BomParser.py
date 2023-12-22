import sys, os
sys.path.append(os.path.abspath(os.path.join('Components')))

import ComponentBase as Component

import re


test = [
    "5.1k 1% 0.063W 0603",
    ]


test = Component.ComponentBase("5.1k 1% 0.063W 0603")
test.PrintInfo()
test = Component.ComponentBase("5.1 кОм 1% 0.063Вт 0603")
test.PrintInfo()
test = Component.ComponentBase("1uF 1% 16V X7R 0603")
test.PrintInfo()
test = Component.ComponentBase("1 мкФ 1% 16В X7R 0603")
test.PrintInfo()
