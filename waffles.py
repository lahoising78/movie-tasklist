import sys
import requests

#start=time.clock()
page = 1
data = []
#pp = pprint.PrettyPrinter(indent=4)
while True:
    print(sys.argv[1])
    url = "http://www.omdbapi.com/?s=" + sys.argv[1] + "&apikey=thewdb&page=" + str(page)
    response = requests.get(url).json()
##    pp.pprint(response)
    page += 1
    if response["Response"] == "True":
        #print(response)
        data.append(response)
    else:
        print(data)
        break
