from ParamFilter import FilterObj as Filter
from Manufacturers import yageo, xiangyee, kemet
from Components import ComponentBase as Component
import re

class Settings:
    def __init__(self, chip_res_man = "Yageo", chip_cap_man = "Yageo", chip_tant_cap_man = "Xiangyee"):
        self.__ChipResMan = chip_res_man
        self.__ChipCapMan = chip_cap_man
        self.__ChipTantCapMan = chip_tant_cap_man

    def GetChipResMan(self):
        return self.__ChipResMan
    
    def GetChipCapMan(self):
        return self.__ChipCapMan
    
    def GetChipTantCapMan(self):
        return self.__ChipTantCapMan




def GetSmdResManufacturers():
    res = ["Yageo"]
    return res

def GetSmdCerCapManufacturers():
    res = ["Yageo"]
    return res

def GetSmdTantCapManufacturers():
    res = ["Xiangyee", "Kemet"]
    return res   


class NameGenerator:

    def __init__(self, settings):
        self.__Settings = settings
        self.__Manufacturers = {
            "yageo": yageo,
            "xiangyee": xiangyee,
            "kemet": kemet
        }
    
    def GetSmdResManufacturers(self):
        res = ["Yageo"]
        return res

    def GetSmdCerCapManufacturers(self):
        res = ["Yageo"]
        return res
    
    def GetSmdTantCapManufacturers(self):
        res = ["Xiangyee"]
        return res
    
    def GetManufacturerName(self, component, parse_filter):
        res = component.GetName()
        man_name = ""

        if component.GetManufacturerPartNumber() != "":
            res = component.GetManufacturerPartNumber()
        else:
            if component.GetDesignator() == "R":
                if component.GetMountWay() == component.MOUNT_WAY_SMD: # Для SMD резисторов
                    man_name = self.__Settings.GetChipResMan()
                    res = self.__Manufacturers[self.__Settings.GetChipResMan().lower()].GenerateFindRequest(component, parse_filter)


            if component.GetDesignator() == "C":
                if component.GetMountWay() == component.MOUNT_WAY_SMD:# Для SMD конденсаторов


                    case_probe = re.search(r'[0-9][0-9][0-9][0-9]', component.GetCase())

                    if case_probe: # Для керамических конденсаторов
                        man_name = self.__Settings.GetChipCapMan()
                        res = self.__Manufacturers[self.__Settings.GetChipCapMan().lower()].GenerateFindRequest(component, parse_filter)
                    
                    case_probe = re.search(r'[A-Z]', component.GetCase())

                    if case_probe: # Для танталовых конденсаторов
                        man_name = self.__Settings.GetChipTantCapMan()
                        res = self.__Manufacturers[self.__Settings.GetChipTantCapMan().lower()].GenerateFindRequest(component, parse_filter)


        return res, man_name