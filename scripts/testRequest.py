import requests

url = "https://amazon-price.p.rapidapi.com/azapi-bulkPrice"

querystring = {"asins":"B0714BNRWC,B07TKNPPDL,B086CX5XFV","marketplace":"US"}

headers = {
	"X-RapidAPI-Key": "694e6913ccmsh726898ada39ae23p1e4165jsn3e71663ec742",
	"X-RapidAPI-Host": "amazon-price.p.rapidapi.com"
}

response = requests.get(url, headers=headers, params=querystring)

print(response.json())