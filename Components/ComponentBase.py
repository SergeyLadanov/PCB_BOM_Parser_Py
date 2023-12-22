
TYPE_NONE = 0
TYPE_SMRES = 1
TYPE_SMCCAP = 2
TYPE_SMTCAP = 3
TYPE_SMIND = 4

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

    def __Parse(self, name):
        pass


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