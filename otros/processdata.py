import csv
import json
import numpy as np
import simplejson
from sklearn.feature_extraction.text import CountVectorizer,TfidfVectorizer


tokenize = lambda doc: doc.lower().split(" ")

author = []
info = []
with open('keywords.csv') as csvfile:
         reader = csv.DictReader(csvfile)
         for row in reader:
            author.append(row['author_id'])
            info.append(row['keyword'])

lon = len(author)/2
str = ""

newAuthor = []
newInfo = []

newAuthor.append(author[0]);
str = str + info[0]

for i in range(1,lon):
    if author[i-1] == author[i]:
        str = str + ' '
        str = str + info[i]
    else:
        newInfo.append(str)
        str = ""
        str = str + info[i]
        newAuthor.append(author[i])
newInfo.append(str)

#print(len(newAuthor), len(newInfo), newAuthor[len(newAuthor)-1],newInfo[len(newInfo)-1])

#*********process tfidf

vectorizer = TfidfVectorizer(norm='l2',min_df=0, use_idf=True, smooth_idf=False, sublinear_tf=True, tokenizer=tokenize)


#arr = ["a b v", "f a s", "a 5 b"]
X = vectorizer.fit_transform(newInfo)
D = -(X * X.T).todense() # Distance matrix: dot product between tfidf vectors
prev = np.matrix(D)
DD = prev.tolist()
#print(len(D), len(D[0]))
for x in range(0,len(DD)):
    for y in range(0,len(DD)):
        #aux = format(float(D[x][y]), '.8f')
        DD[x][y] = round(DD[x][y],8)

print(len(newAuthor), len(newInfo), len(DD), len(DD[0]), DD[0][300])

#**************output matrix tfidf

#output = json.dumps({"users": newAuthor, "mat": DD})
data1 = {"users": newAuthor,"mat" : DD}
#with open('result.json', 'w') as fp:
#   json.dump(output, data1)

try:
    jsondata = simplejson.dumps(data1,sort_keys=True)
    fd = open('result.json', 'w')
    fd.write(jsondata)
    fd.close()
except:
    print 'ERROR writing', 'result2.json'
    pass    