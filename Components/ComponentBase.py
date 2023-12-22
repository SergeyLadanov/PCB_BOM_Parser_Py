
import re

TYPE_NONE = 0
TYPE_SMRES = 1
TYPE_AXIALRES = 2
TYPE_SMCCAP = 3
TYPE_AXIALCCAP = 4
TYPE_SMTCAP = 5
TYPE_AXIALTCAP = 6
TYPE_SMIND = 7
TYPE_AXIALIND = 8

class ComponentBase:
    def __init__(self, name=""):
        self.__Name = name
        self.__Designator = ""
        self.__Value = 0.0
        self.__UnitsValue = ""
        self.__Tolerance = 0
        self.__Case = ""
        self.__Endurance = 0.0
        self.__UnitsEndurance = ""
        self.__Type = TYPE_NONE

        self.__Parse(self.__Name)

    def __Parse(self, name):

        # Try to get power value and units in English
        res = re.search(r'[+-]?([0-9]*[.])?[0-9]+[\s]?\w?W', name)
        if res:
            self.__Endurance = float(re.search(r'[+-]?([0-9]*[.])?[0-9]+', res[0])[0])
            self.__UnitsEndurance = re.search(r'\D?W', res[0])[0]
        else:
            # Try to get power value and units in Russian
            res = re.search(r'[+-]?([0-9]*[.])?[0-9]+[\s]?\w?Вт', name)
            if res:
                self.__Endurance = float(re.search(r'[+-]?([0-9]*[.])?[0-9]+', res[0])[0])
                self.__UnitsEndurance = re.search(r'\D?Вт', res[0])[0]



        
        # Try to get res value and units value in Russian
        res = re.search(r'[+-]?([0-9]*[.])?[0-9]+[\s]?\w?Ом', name)
        if res:
            self.__Value = float(re.search(r'[+-]?([0-9]*[.])?[0-9]+', res[0])[0])
            self.__UnitsValue = re.search(r'\D?Ом', res[0])[0]
                
        else:
            # Try to get res value and units in English
            res = re.search(r'[+-]?([0-9]*[.])?[0-9]+[\s]?[kKmM]?\W?', name)
            if res:

                self.__Value = float(re.search(r'[+-]?([0-9]*[.])?[0-9]+', res[0])[0])

                temp_units = re.search(r'\s?[^0-9.]', res[0])[0]

                self.__UnitsValue = "Ohm"

                if temp_units:
                    self.__UnitsValue = temp_units + self.__UnitsValue






    def GetOrderName(self):
        return self.__Name


    def GetName(self):
        return self.__Name
    

    def GetDesignator(self):
        return self.__Designator


    def GetValue(self):
        return self.__Value


    def GetUnitsValue(self):
        return self.__UnitsValue


    def GetTolerance(self):
        return self.__Tolerance


    def GetCase(self):
        return self.__Case


    def GetEndurance(self):
        return self.__Endurance


    def GetUnitsEndurance(self):
        return self.__UnitsEndurance


    def GetType(self):
        return self.__Type