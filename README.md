# MicroserviceIEX

## THE CHALLENGE 
 
As a challenge we would like you to use the [​IEX Developer Platform​](https://iextrading.com/developer/) to work with stock price 
data. The implemented solution should … 
-  ... poll the IEX Developer Platform API at a configurable interval for the prices of a 
configurable set of companies ("symbols"), their names and logos (URL to the logo 
image) 
-  ... store a history of all retrieved prices 
-  ... provide an HTTP endpoint that can be queried for one or more companies and 
optionally a time frame 
-  ... return a JSON document that includes each queried company's name, logo (URL) 
and the list of polled prices, optionally limited by the given time frame 
-  ... include testing (of your choice) 
-  ... be designed to be part of a production environment 
 
---
## CONDITIONS 
 
Please use NodeJS (8) to implement the microservices. 
 
Furthermore, please use at least one additional Google services. E.g. messaging via 
PubSub, persistence via Datastore

---
## SCHEME

![scheme](https://raw.githubusercontent.com/hydra13/MicroserviceIEX/master/docs/schema.png)

---
## LINKS

IEX Cloud - https://iexcloud.io/
 
Google Cloud Datastore - https://cloud.google.com/datastore/ 

---
## API FOR CLIENT

### 1) Get information about symbols with prices

#### Request
```
GET /api/client?filter=<symbols>[&adt=<datetime>][&bdt=<datetime>]
```

#### Parameters

- **filter**: one or more symbols
- **adt**: after datetime in a format: *seconds since 1970-01-01 00:00:00 UTC*
- **bdt**: before datetime in format: *seconds since 1970-01-01 00:00:00 UTC*

#### Example
```
GET /api/client?filter=aapl,spy&adt=1564440000000&bdt=1564583880000
```

#### Result
```
[
    {
        "symbol": "spy",
        "name": "SPDR S&P 500 ETF Trust",
        "logo": "/ogso.grpalSihoeeo/mox.app/PstcgetY/nsl//:atisgi.ogp",
        "prices": [
            306.87,
            306,
            315.07,
            309.31,
            313.3,
            311.64
        ]
    },
    {
        "symbol": "aapl",
        "name": "Apple, Inc.",
        "logo": "o.rio/o.gipggmL/pntsogp/sesa.algiPoA:tlsAeoptxch//a/e",
        "prices": [
            212.4,
            209.97,
            212,
            216.39,
            216.63
        ]
    }
]
```
---
## API FOR MANAGEMENT

### 1) Get information about current settings

#### Request
```
GET /api/management
```

#### Result
```
{ 
    "15" : ["ll","spy"],
    "30" : ["aapl"]
}
```

---
### 2) Add symbol for monitoring

#### Request
```
POST /api/management
Content-Type: application/json
{
    "symbol": <symbol>,
    "time": <timeInterval>
}
```

#### Parameters

- **symbol**: symbol for monitoring
- **timeInterval**: interval of time (seconds) for getting an information from the input service (Min = 5 seconds, Max = 3600 seconds (60 min), Value must be a multiple of 5 seconds)  

#### Example
```
POST /api/management
Content-Type: application/json
{
    "symbol": "aapl",
    "time": 5
}
```

#### Result
```
{
    "symbol":"aapl",
    "time":5
}
```

---
### 3) Update symbol monitoring settings

#### Request
```
PUT /api/management
Content-Type: application/json
{
    "symbol": <symbol>,
    "time": <timeInterval>
}
```

#### Parameters

- **symbol**: symbol for monitoring
- **timeInterval**: interval of time (seconds) for getting an information from the input service (Min = 5 seconds, Max = 3600 seconds (60 min), Value must be a multiple of 5 seconds)  

#### Example
```
PUT /api/management
Content-Type: application/json
{
    "symbol": "aapl",
    "time": 20
}
```

#### Result
```
{
    "symbol":"aapl",
    "time":20
}
```

---
### 4) Remove symbol from monitoring settings

#### Request
```
DELETE /api/management/<symbol>
```

#### Parameters

- **symbol**: symbol for removing 

#### Example
```
DELETE /api/management/aapl
```

#### Result
```
aapl was deleted
```

---
## CHANGE DB CLIENT

- Create new class which extends **AbstractDBClient**
- Replace from default to *your client* in **main.js**
---

## CHANGE INPUT SERVICE

- Create new class which extends **AbstractService**
- Replace from default to *your client* in **main.js**