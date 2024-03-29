
class FilterItem:
    def __init__(self, skip_endurance = False, skip_tolerance = False, skip_designvariant = False):
        self.SkipEndurance = skip_endurance
        self.SkipTolerance = skip_tolerance
        self.SkipVariant = skip_designvariant


class FilterObj:
    FilterData = {
                  'C': FilterItem(),
                  'R': FilterItem(),
                  'L': FilterItem(),
                  }

    def SetFilter(self, key_str, filter):
        self.FilterData[key_str] = filter


    def GetFilter(self, key_str):
        try:
            return self.FilterData[key_str]
        except:
            return FilterItem(True, True, True)


    def SetSkipingEndurance(self, key_str, value):
        self.FilterData[key_str].SkipEndurance = value


    def SetSkipingTolerance(self, key_str, value):
        self.FilterData[key_str].SkipTolerance = value


    def SetSkipingVariant(self, key_str, value):
        self.FilterData[key_str].SkipVariant = value