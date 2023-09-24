
import pymongo

mongodb_url = 'mongodb+srv://pandeygrocks:Saurabh04@maindb.ijbfr2l.mongodb.net/?retryWrites=true&w=majority'  # Replace with your MongoDB server URL
database_name = "MainDB"  # Replace with your database name
collection_name = "testCentre"  # Replace with your collection name

def pushToDB(data):
    try:
        client = pymongo.MongoClient(mongodb_url)
        database = client[database_name]
        collection = database[collection_name]

        inserted_data = collection.insert_many(data)

        if inserted_data.inserted_ids:
            print("Data inserted successfully. Inserted IDs:", inserted_data.inserted_ids)
        else:
            print("Failed to insert data.")

    except Exception as e:
        print(f"An error occurred: {str(e)}")

    finally:
        # Close the MongoDB connection
        client.close()

def readFromFile():
    with open('LocationData/west.txt', 'r') as file:
        lines = file.readlines()
        lines = [s.replace('\n', '') for s in lines]

        id = 1

        dict = {}
        a = ['centre', 'lat', 'long', 'gmapLink']
        i = 0

        ans = []

        for j in lines:
            x = j

            if i == 1:
                lat, long = map(float, j.split(','))
                # print(lat, long)
                dict[a[i]] = lat
                i += 1
                dict[a[i]] = long
                i += 1
            else:
                dict[a[i]] = x
                i += 1
            
            if(i >= 4):
                i = 0
                dict['_id'] = str(id)
                id += 1
                ans.append(dict)
        # print(ans)

        pushToDB(ans)

        

readFromFile()

# data_to_insert = {
#     "lat":28.646946441937246,
#     "long":77.37414370113076,
#     "centre":"Auctus E-Recycling Solutions Pvt. Ltd.",
#     "gmapLink":"https://www.google.com/maps/place/Auctus+E-Recycling+Solutions+Pvt.+Lt…"
# }

