import simplejson


filename = 'groups2.txt'

with open(filename) as f:
    data = f.readlines();

k = 0
dataresult = []

confe = True
numero = False
autores = False

arrconfe = []
arraut = []
gender = ""
group = 0

for line in data:
    mistr = ""
    arrconfe = []
    arraut = []
    gender = ""
    group += 1

    confe = True
    numero = False
    autores = False

    numautores = 0
    #print("len",len(line))
    for i in range(0,len(line)-1):
        if line[i] == ',' or line[i] == '(' or line[i] == ')':
            mistr = ''
            continue
        if confe:
            mistr += line[i]
            if line[i+1] == ',':
                if  mistr == "male" or mistr == "female":
                    gender = mistr
                else:
                    arrconfe.append(mistr)    
                mistr = ""
                if line[i+2] == "(":
                    confe = False
                    numero = True    

        if numero:
            mistr += line[i]
            if line[i+1] == ')':
                mistr = ""
                numero = False
                autores = True
                
                
        if autores:
            #print("pos", i, line[i], confe, numero, autores)
            mistr += line[i]
            if line[i+1] == ',':
                arraut.append(mistr)
                mistr = ""
                
    if gender == "":
        gender == "null"
    dataresult.append({"group": group, "conferences": arrconfe, "gender": gender, "authors": arraut})
    
    
#print(dataresult)

class MyError(Exception):
     def __init__(self, value):
         self.value = value
     def __str__(self):
         return repr(self.value)

try:
    jsondata = simplejson.dumps(dataresult,sort_keys=True)
    namejson = "group2JSON"+".json"
    fd = open(namejson, 'w')
    fd.write(jsondata)
    fd.close()
except MyError as e:
    print 'ERROR writing', 'group2JSON.json', e.value