import csv
import json
import random


import numpy as np
import simplejson
from sklearn.feature_extraction.text import CountVectorizer,TfidfVectorizer
from sklearn.manifold import TSNE
from sklearn import manifold 
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


#######################3
#with normalization
#####################33

dataori1 = []
info = []

#array zeros 500 conferences
confe_zeros = [0]*1000

with open('../data/group3NewJSON2.json') as data_file:
    dataori1 = json.load(data_file)
print("longitud data original", len(dataori1))
auxarr = random.sample(range(0, 74194), 10)
print("auxarr", auxarr)    
dataori = []
for xx in xrange(0,len(auxarr)):
    dataori.append(dataori1[auxarr[xx]])
#dataori = dataori[0:1000]
print(len(dataori))

longitud = len(dataori)

for x in xrange(0,longitud):
    aux = []
    aux.append(dataori[x]['seniority'])
    aux.append(dataori[x]['Pubrate'])
    #aux.append(dataori[x]['numPub'])
    auxcon = confe_zeros
    dd = dataori[x]['conferences']
    for k in xrange(0,len(dd)):
        print("q", dd[k])
        auxcon[dd[k]] = 1
    ddd  = tuple(dd)
    hashconfe = hash(ddd)
    aux.append(hashconfe)    
    info.append(aux)

print("info", len(info), len(info[0]))
print("confe", dataori[0]['conferences'], len(dataori[0]['conferences']))    

arrinfo = np.array(info)
arrinfo_norm = normalize(arrinfo, axis=0, norm='max')


#start tsne
tsnet0 = time()
model = TSNE(n_components=2, random_state=0)
np.set_printoptions(suppress=True)
puntos = model.fit_transform(arrinfo_norm)
tsnet1 = time()
print("Time TSNE", (tsnet1 - tsnet0))
#end tsne

"""
#start isomap
n_neighbors = 1000
isot0 = time()
puntos = manifold.Isomap(n_neighbors, n_components =2).fit_transform(arrinfo_norm)
isot1 = time()
print("Time Isomap", (isot1 - isot0))
#end isomap
"""
que = np.matrix(puntos)
ptos = que.tolist()
print(puntos)

#Usaremos un algoritmo de cluster
 #bandwidth = cluster.estimate_bandwidth(puntos, quantile = 0.3)
 #db = cluster.MeanShift(bandwidth = bandwidth, bin_seeding = True).fit(puntos)

affinity_propagation = cluster.AffinityPropagation(damping=.9, preference=-200)
db = affinity_propagation.fit(puntos)


labels = db.labels_
hh = np.array(labels)
labelsOK = hh.tolist()
n_clusters_ = len(set(labels)) - (1 if -1 in labels else 0)
print("Nro Clusters", n_clusters_)


group = range(1,longitud+1)
data3 = {"groups": auxarr, "mat": ptos, "cluster": labelsOK}
#data3 = {"groups": group, "mat": ptos, "cluster": labelsOK}
try:
    jsondata = simplejson.dumps(data3,sort_keys=True)
    namejson = "group3_norm3_projection"+str(len(group))+".json"
    #namejson = "group3_norm_projection_confe1000isomap"+str(len(group))+".json"
    fd = open(namejson, 'w')
    fd.write(jsondata)
    fd.close()
except MyError as e:
    print 'ERROR writing', 'group3_norm3_projection.json', e.value
    #print 'ERROR writing', 'group3_norm_projection_isomap.json', e.value
"""
#######################3
#processing with tfidf results, but not with normalization
#####################33


tokenize = lambda doc: doc.lower().split(" ")

group = []
info = []

dataori = []

with open('group1JSON.json') as data_file:
    dataori = json.load(data_file)

for s in xrange(0,len(dataori)):
    mistr = ''
    for x in dataori[s]['conferences']:
        mistr = mistr + " " + str(x)
    info.append(mistr)



lon = len(dataori)
lon = int(lon)
group = range(1,lon+1)
group = group[0:5000]
info = info[0:5000]





#*********process tfidf

vectorizer = TfidfVectorizer(norm='l2',min_df=0, use_idf=True, smooth_idf=False, sublinear_tf=True, tokenizer=tokenize)


#arr = ["a b v", "f a s", "a 5 b"]
X = vectorizer.fit_transform(info)
D = -(X * X.T).todense() # Distance matrix: dot product between tfidf vectors
prev = np.matrix(D)
DD = prev.tolist()
#print(len(D), len(D[0]))
for x in range(0,len(DD)):
    for y in range(0,len(DD)):
        #aux = format(float(D[x][y]), '.8f')
        DD[x][y] = round(DD[x][y],8)


#**************output matrix tfidf



#with open('result.json', 'w') as fp:
#   json.dump(output, data1)
#print(DD)
tsnet0 = time()
X = np.array(X.todense())
model = TSNE(n_components=2, random_state=50)
np.set_printoptions(suppress=True)
puntos = model.fit_transform(X)
tsnet1 = time()
print("Time TSNE", (tsnet1 - tsnet0))
que = np.matrix(puntos)
ptos = que.tolist()

print(puntos)

clustert0 = time()
#4db = cluster.AffinityPropagation(damping=.9, preference=-50).fit(puntos)
bandwidth = cluster.estimate_bandwidth(puntos, quantile = 0.3)
db = cluster.MeanShift(bandwidth = bandwidth, bin_seeding = True).fit(puntos)
#2db = DBSCAN(eps=0.2).fit(puntos)
#3db = KMeans(n_clusters = 3, random_state = 0).fit(ptos)
#2core_samples_mask = np.zeros_like(db.labels_, dtype=bool)
#2core_samples_mask[db.core_sample_indices_] = True
clustert1 = time()
print("Time Cluster", (clustert1 - clustert0))

labels = db.labels_
hh = np.array(labels)
labelsOK = hh.tolist()
n_clusters_ = len(set(labels)) - (1 if -1 in labels else 0)
print("Nro Clusters", n_clusters_)

data3 = {"groups": group, "mat": ptos, "cluster": labelsOK}
try:
    jsondata = simplejson.dumps(data3,sort_keys=True)
    namejson = "groupsnecluster"+str(len(labelsOK))+".json"
    fd = open(namejson, 'w')
    fd.write(jsondata)
    fd.close()
except MyError as e:
    print 'ERROR writing', 'groupsnecluster.json', e.value




"""