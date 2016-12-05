import simplejson

def imprimit_erro(des, num):
    if num >= 2:
        print("ERROR en ", des)
#Group with format ID from all items and authors
#format: items (support) Authors
#support is # authors
filename = 'groups3.txt'

with open(filename) as f:
    data = f.readlines();

dataresult = []

f = 1
num = -1
contador_grupos = 0

for line in data:
    count_gender = 0
    count_senio = 0
    count_ratepubli = 0
    count_numPub = 0
    longi = len(line)
    
    ptodiv = -1
    mistr = ''

    confe = []
    gender = "#"
    senio = -1
    rate = -1
    numPub = -1
    keyword = []

    autores = []
    
    for i in xrange(0,longi-1): #para items
        

        if line[i] == '(':
            for x in xrange(i+1,longi-1):
                if line[x] == ')':
                    ptodiv = x
                    break
            break        
        else:
            if line[i] == ' ':
                #decidir que es
                num = int(mistr)
                if num >= 100 and num <= 599: #conferencia
                    confe.append(num)
                elif num >=1 and num <= 3: #gender
                    gender = num
                    count_gender+=1
                    imprimit_erro("gender", count_gender)
                elif num >=15 and num <= 19: #seniority
                    senio = num
                    count_senio+=1
                    imprimit_erro("senio", count_senio)
                elif num >= 20 and num <= 24: #publication rate
                    rate = num
                    count_ratepubli += 1
                    imprimit_erro("rate", count_ratepubli)
                elif num >= 10 and num <= 14: #num publication
                    numPub = numPub
                    count_numPub += 1
                    imprimit_erro("num pub", count_numPub)
                elif num >= 7000 and num <= 7999: #keyword
                    keyword.append(num)

                mistr = ''                      
            else:
                mistr += line[i]  

    ptodiv +=2  #salto de support
    
    for j in xrange(ptodiv,longi): #para autores
        if line[j] == ' ' or line[j] == '\n':
            num = int(mistr)
            autores.append(num)
            mistr = ''
        else:
            mistr += line[j]                    

              
    
    dataresult.append({"id": contador_grupos, "conferencia": confe, "gender": gender, "seniority": senio, "Pubrate": rate, "numPub": numPub, "keyword": keyword, "authors": autores});


    contador_grupos +=1                  
    
            
#print("mira", dataresult[0:2], len(dataresult))

class MyError(Exception):
     def __init__(self, value):
         self.value = value
     def __str__(self):
         return repr(self.value)

try:
    jsondata = simplejson.dumps(dataresult,sort_keys=True)
    namejson = "group3NewJSON"+".json"
    fd = open(namejson, 'w')
    fd.write(jsondata)
    fd.close()
except MyError as e:
    print 'ERROR writing', 'group3NewJSON.json', e.value



"""
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

#*


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

"""