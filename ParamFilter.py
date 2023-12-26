
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

    def SetSkipingEndurance(self, key_str, value):
        self.FilterData[key_str].SkipEndurance = value