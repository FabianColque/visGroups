import csv
import json

import numpy as np
import simplejson
from sklearn.feature_extraction.text import CountVectorizer,TfidfVectorizer
from sklearn.manifold import TSNE
from sklearn.preprocessing import normalize

#clustering
from sklearn import cluster
"""
from sklearn.cluster import DBSCAN
from sklearn.cluster import KMeans
from sklearn.cluster import MeanShift as meanshift
from sklearn.cluster import estimate_bandwidth
"""
from time import time


class MyError(Exception):
     def __init__(self, value):
         self.value = value
     def __str__(self):
         return repr(self.value)


tokenize = lambda doc: doc.lower().split(" ")

author = []
info = []
arrinfo = []
#max and min from attirbutes
sen_min = 10000
sen_max = 0

nbpub_min = 10000
nbpub_max = 0

rpub_min = 10000
rpub_max = -1



#Authors
with open('../data/authors.csv') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        aux = []
        author.append(row['author_id'])
        aux.append(int(row['nbpub']))
        nbpub_min = min(nbpub_min, int(row['nbpub']))
        nbpub_max = max(nbpub_max, int(row['nbpub']))
        aux.append(int(row['seniority']))
        sen_min = min(sen_min, int(row['seniority']))
        sen_max = max(sen_max, int(row['seniority']))
        aux.append(float(row['pubrate']))
        rpub_min = min(rpub_min, float(row['pubrate']))
        rpub_max = max(rpub_max, float(row['pubrate']))
        arrinfo.append(aux)
 
"""
print('+++++++++++++++++++')
print(arrinfo[1:5])
print('+++++++++++++++++++')
"""

#normalize
arrinfonp = np.array(arrinfo)
arrinfo_norm = normalize(arrinfonp, axis=0, norm='max')

print('+++++++++++++++++++')
print(arrinfo_norm[1:5])
print('+++++++++++++++++++')        

lon = len(author)
lon = int(lon)
author = author[0:lon]
info = info[0:lon]


tsnet0 = time()

model = TSNE(n_components=2, random_state=0)
np.set_printoptions(suppress=True)
puntos = model.fit_transform(arrinfo_norm)
tsnet1 = time()
print("Time TSNE", (tsnet1 - tsnet0))
que = np.matrix(puntos)
ptos = que.tolist()

print(puntos)


data3 = {"users": author, "mat": ptos}
try:
    jsondata = simplejson.dumps(data3,sort_keys=True)
    namejson = "pauthorsnecluster"+str(len(author))+".json"
    fd = open(namejson, 'w')
    fd.write(jsondata)
    fd.close()
except MyError as e:
    print 'ERROR writing', 'resultAuthortsneCluster.json', e.value


#gerar lista de pontos 2D TSNE
"""
data2 = {"users": author, "mat" : ptos, "gen": gen}
try:
    jsondata = simplejson.dumps(data2,sort_keys=True)
    fd = open('resultAuthortsne.json', 'w')
    fd.write(jsondata)
    fd.close()
except MyError as e:
    print 'ERROR writing', 'resultAuthor.json', e.value
    

"""
#gerar matrix tfidf
"""
#data1 = {"users": author,"mat" : DD}

try:
    jsondata = simplejson.dumps(data1,sort_keys=True)
    fd = open('resultAuthor.json', 'w')
    fd.write(jsondata)
    fd.close()
except:
    print 'ERROR writing', 'resultAuthor.json'
    pass 
"""

