import json
import simplejson


class MyError(Exception):
     def __init__(self, value):
         self.value = value
     def __str__(self):
         return repr(self.value)

dataGroups = []

with open('../data/group1JSON.json') as data_file:
    dataGroups = json.load(data_file)

with open('../data/authorsjson.json') as data_aut:
    dataAuthors = json.load(data_aut)

print('groups', len(dataGroups))              
print('authors', len(dataAuthors))   

lenAuthors = len(dataAuthors)
mapaAuthors = {}

contrepetidos = 0

for x in xrange(0,lenAuthors):
    if mapaAuthors.has_key(dataAuthors[x]["name"]):
        contrepetidos = contrepetidos + 1;
        print("repe", dataAuthors[x]["author_id"])

    mapaAuthors[dataAuthors[x]["name"]] = dataAuthors[x]["author_id"]


print("len mapa authors", len(mapaAuthors))    
print("repetidos", contrepetidos)    