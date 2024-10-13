from ParamFilter import FilterObj as Filter
from Manufacturers import yageo
from Components import ComponentBase as Component

class ManufacturerSettings:
    def __init__(self, skip_endurance = False, skip_tolerance = False, skip_designvariant = False):
        self.SkipEndurance = skip_endurance
        self.SkipTolerance = skip_tolerance
        self.SkipVariant = skip_designvariant

class ManufacturerManager:
    pass