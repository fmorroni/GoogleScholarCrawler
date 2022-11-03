class Serializer:
    SEPARATOR = ";"
    ARRAY_SEPARATOR = ","

    def __init__(self, path):
        self.fileStream =  open(path, "w", encoding="utf-8")
    
    @staticmethod
    def csv_format(var):
        if isinstance(var, list) or isinstance(var, tuple):
            return Serializer.ARRAY_SEPARATOR.join(var)
        elif isinstance(var, int):
            var = str(var)
        elif not var:
            return ""
        if isinstance(var, str):  # replacing "," and ";" with %hex to avoid csv parsing errors
            var = var.replace(",", f"%{ord(','):x}")
            var = var.replace(";", f"%{ord(';'):x}")
        
        return var
    def close(self):
        self.fileStream.close()
    def endl(self):
        self.fileStream.write("\n")
    def writeLine(self, line):
        self.fileStream.write(line)
        self.endl()
    def setHeader(self, keys):
        self.keys = keys
        header = Serializer.SEPARATOR.join(keys)
        self.writeLine(header)
    def writeRow(self, obj):
        for key in self.keys:
            self.fileStream.write(Serializer.csv_format(obj.get(key)))
            self.fileStream.write(Serializer.SEPARATOR)
        self.endl()
    
    @staticmethod
    def dict2csv(arr, csvpath):
        def getKeys(arr):
            keys = set()
            for item in arr:
                keys.update(set(item.keys()))
            return keys 
        serializer = Serializer(csvpath)

        serializer.setHeader(getKeys(arr))

        for row in arr:
            serializer.writeRow(row)

        serializer.close()

import json

with open("2020.json", "r", encoding="utf-8") as f:
    obj = json.load(f)

Serializer.dict2csv(obj["userProfiles"], "userProfiles.csv")
Serializer.dict2csv(obj["parsedArticles"], "parsedArticles.csv")