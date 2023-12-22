import sys, os
sys.path.append(os.path.abspath(os.path.join('Components')))

import ComponentBase as Component

import re


test = Component.ComponentBase("5.1k 1% 0.063W 0603")

test = Component.ComponentBase("5.1 кОм 1% 0.063Вт 0603")

test = Component.ComponentBase("1uF 1% 16V X7R 0603")

test = Component.ComponentBase("1 мкФ 1% 16В X7R 0603")

print("Test")

# test_var = re.search("", "test_123")


# test_var = re.search(r'[+-]?([0-9]*[.])?[0-9]+[\s]?\w?Wt', "test_123.6 kWt")

# print(test_var[0] if test_var else 'Not found')


# test_var = re.search(r'[+-]?([0-9]*[.])?[0-9]+[\s]?\w?Wt', "test_123.6 Wt")

# print(test_var[0] if test_var else 'Not found')


# test_var = re.search(r'[+-]?([0-9]*[.])?[0-9]+[\s]?\w?Вт', "test_123.6 кВт")

# print(test_var[0] if test_var else 'Not found')


# test_var = re.search(r'[+-]?([0-9]*[.])?[0-9]+[\s]?\w?Вт', "test_0.063 Вт")

# print(test_var[0] if test_var else 'Not found')