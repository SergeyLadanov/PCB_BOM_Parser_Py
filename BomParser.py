import sys, os
sys.path.append(os.path.abspath(os.path.join('Components')))

import ComponentBase

import re


# test_var = re.search("", "test_123")


test_var = re.search(r'[+-]?([0-9]*[.])?[0-9]+[\s]?\w?Wt', "test_123.6 kWt")

print(test_var[0] if test_var else 'Not found')


test_var = re.search(r'[+-]?([0-9]*[.])?[0-9]+[\s]?\w?Wt', "test_123.6 Wt")

print(test_var[0] if test_var else 'Not found')


test_var = re.search(r'[+-]?([0-9]*[.])?[0-9]+[\s]?\w?Вт', "test_123.6 кВт")

print(test_var[0] if test_var else 'Not found')


test_var = re.search(r'[+-]?([0-9]*[.])?[0-9]+[\s]?\w?Вт', "test_123.6 Вт")

print(test_var[0] if test_var else 'Not found')