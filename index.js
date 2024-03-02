const express = require("express")
const app = express()
// to use body parameters we must add this line
app.use(express.json())
// create mongodb class
const Mongodb = require("mongodb")
// import mongoose
const mongoose = require("mongoose")

// connect to the mongodb using mongoose to create the documet
mongoose.connect('mongodb://localhost:27017/nodejs-db')
    .then(() => console.log("mongoose Succeccfully connected to the mongodb"))
    .catch(err => console.error('Connection error', err))

// import the article model // this is a class
const article = require("./models/article") // this will automaticly create the article collection 
// in the db that i specified in the link (nodejs-db)
// if i don't specify a db in the url it will create
// the collection in the test db which exist by default in mongodb

app.get("/", (req, res) => {
    res.send("You are on the root")
})

app.get("/hello", function (req, res) {
    res.send("Hello");
});

app.get("/hi", (req, res) => {
    res.send("You are in the hi page");
});

app.get("/numbers", (req, res) => {
    let numbers = ""
    for (let i = 0; i < 100; i++) {
        numbers += i + "-";
    };
    res.send(`The numbers are: ${numbers}`);
});

// Path parameters
app.get("/findSummation/:number1/:number2", (req, res) => {
    const num1 = req.params.number1;
    const num2 = req.params.number2;

    // + befor num1 here is like Number() on num2 but it quick conversion
    let total = +num1 + Number(num2);

    res.send(`The summation is: ${total}`)
})

//body parameters
app.get("/sayHallo", (req, res) => {
    console.log(req.body);
    res.send(`Hello ${req.body.Name}`)
})

// Query Parameters
app.get("/getAge", (req, res) => {
    res.send(`Hello ${req.body.Name}, The age is: ${req.query.age}`)
})


// all parameters but this time with json response 
app.get("/allParameters/:language", (req, res) => {
    res.json({
        firstName: req.body.Name,
        lastName: "Zedan",
        age: req.query.age,
        language: req.params.language
    })
})

// we can send html as a response that will be (server side render)
app.get("/html", (req, res) => {
    res.send("<h1>Hello World</h1>");
})

// send html as a file not a code
app.get("/htmlFile", (req, res) => {
    res.sendFile(__dirname + "/site/main.html")
})

// send content to html file in variable or any thing else
app.get("/htmlVar", (req, res) => {
    let numbers = "";
    for (let i = 0; i < 100; i++) {
        numbers += i + "-";
    };

    res.render("main.ejs", {
        Name: "Ahmed",
        numbers: numbers,
    });
})

app.put("/test", (req, res) => {
    res.send("Hello World");
});

app.post("addComment", (req, res) => {
    res.send("post request on add comment");
})

// Connect to the mongodb server on my local machine 

// Connection URL
const url = 'mongodb://localhost:27017';
const client = new Mongodb.MongoClient(url);

// Database Name
const dbName = 'TA-data';

app.get("/database", async (req, res) => {
    // const a = () => {
    //     const x = 4
    //     const b = () => {
    //         console.log(x)
    //     }
    //     b()
    // }
    // a()
    // let db
    // client.connect().then(
    //     () => {
    //         console.log("Connected successfully to the db server");
    //         db = client.db(dbName);
    //         return db.listCollections().toArray()
    //     }
    // ).then((collections) => {
    //     if (collections.length === 0) {
    //         throw new Error("No collections found in the database");
    //     }
    //     const firstCollectionName = collections[0].name;
    //     console.log("Using collection:", firstCollectionName);
    //     const collection = db.collection(firstCollectionName);
    //     return collection.findOne({})
    // }).then((firstDocument) => {
    //     console.log("First document found:", firstDocument);
    //     res.json({ ...firstDocument });
    // })
    try {
        // Connect to the MongoDB client
        await client.connect();
        console.log("Connected successfully to the db server");

        const db = client.db(dbName);

        // Get the list of collection names
        const collections = await db.listCollections().toArray();
        if (collections.length === 0) {
            throw new Error("No collections found in the database");
        }
        // Assuming you want to use the first collection's name
        const firstCollectionName = collections[0].name;
        console.log("Using collection:", firstCollectionName);

        // Use the first collection found
        const collection = db.collection(firstCollectionName);

        // Finding the first document in this collection
        const firstDocument = await collection.findOne({});
        // console.log("First document found:", firstDocument);

        // Properly send the found document as the response
        res.json({ ...firstDocument });

    } catch (err) {
        console.error(err)
    } finally {
        await client.close()
    }
})

// article endpoint
app.post("/article", async (req, res) => {
    const newArticle = new article();

    const artTitle = req.body.articleTitle;
    const artBody = req.body.articleBody;

    newArticle.title = artTitle;
    newArticle.body = artBody;
    // newArticle.title = "the title of article-1";
    // newArticle.body = "the body of the article-1"
    newArticle.numberOfLikes = 0;
    await newArticle.save();

    res.send("the new article has been saved");
})

app.get("/articles", async (req, res) => {
    const articles = await article.find();
    res.send(`The articles are: ${articles}`);
})

app.get("/article/:articleId", async (req, res) => {
    const articleId = req.params.articleId
    try {
        console.log(`${articleId}`)
        const art = await article.findById(articleId);
        res.send(`The article is: ${art}`);
    } catch (error) {
        console.log("there is an error", error)
    }
})

app.delete("/article/:articleId", async (req, res) => {
    const articleId = req.params.articleId
    try {
        console.log(`${articleId}`)
        const art = await article.findByIdAndDelete(articleId);
        res.send(`The article is: ${art}`);
    } catch (error) {
        res.json(error);
    }
})

app.get("/showArticles", async (req, res) => {
    const articles = await article.find();
    res.render("articles.ejs", {
        allArticles: articles
    });
})

var port = 3000
app.listen(port, () => {
    console.log(`I am listening in port ${port}`)
})