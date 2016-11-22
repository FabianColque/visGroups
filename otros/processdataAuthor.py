import csv
import json

import numpy as np
import simplejson
from sklearn.feature_extraction.text import CountVectorizer,TfidfVectorizer
from sklearn.manifold import TSNE

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

#Authors
with open('authors.csv') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        author.append(row['author_id'])
        straux = ""
        straux = straux + row['gender'] +" "+ row['seniority'] +" "+ row['nbpub'] +" "+ row['pubrate']
        info.append(straux)
        

lon = len(author)
lon = int(lon)
author = author[0:lon]
info = info[0:lon]


"""
#Keywords
infor = []
aut = []
with open('keywords.csv') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        aut.append(row['author_id'])
        infor.append(row['keyword'])


lon = len(aut)/2
str = ""

author.append(aut[0]);
str = str + infor[0]

for i in range(1,lon):
    if aut[i-1] == aut[i]:
        str = str + ' '
        str = str + infor[i]
    else:
        info.append(str)
        str = ""
        str = str + infor[i]
        author.append(aut[i])
info.append(str)
"""


#print(len(newAuthor), len(newInfo), newAuthor[len(newAuthor)-1],newInfo[len(newInfo)-1])

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

print(len(DD), len(DD[0]), DD[0][300])

#**************output matrix tfidf

#output = json.dumps({"users": newAuthor, "mat": DD})



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

data3 = {"users": author, "mat": ptos, "cluster": labelsOK}
try:
    jsondata = simplejson.dumps(data3,sort_keys=True)
    namejson = "pauthorsnecluster"+str(len(labelsOK))+".json"
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

