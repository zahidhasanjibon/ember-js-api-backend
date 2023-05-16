const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv"); 
const jwt = require("jsonwebtoken");
const { faker } = require("@faker-js/faker");
const PORT = 5000;
const app = express();
const cookieParser = require("cookie-parser");
app.use(cors());
dotenv.config();
app.use(express.json());
app.use(cookieParser());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const uri = `mongodb+srv://ph-assign-11:50SP9EQFECJt7RHd@cluster0.nxpijbg.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const emberPostCollection = client.db("ember-project").collection("libraries");
const emberLibraries = client.db("ember-project").collection("libraries");

const emailInvitations = client
  .db("ember-project")
  .collection("emailInvitations");
const emberAuthors = client.db("ember-project").collection("authors");
const emberBooks = client.db("ember-project").collection("books");

app.post("/posts", async (req, res) => {
  const name = req.body.post?.name;

  const result = await emberPostCollection.insertOne({
    name,
  });
  if (result?.acknowledged) {
    return res.send({
      _id: result.insertedId.toString(),
      name,
    });
  } else {
    return res.send({
      success: false,
      message: "post added failed",
    });
  }
});

app.get("/posts", async (req, res) => {
  try {
    const query = {};
    const cursor = emberPostCollection.find(query);
    const allPosts = await cursor.toArray();
    res.status(200).json(allPosts);
  } catch (error) {
    console.log(error);
  }
});
app.get("/blogs", async (req, res) => {
  try {
    const query = {};
    const cursor = emberPostCollection.find(query);
    const allPosts = await cursor.toArray();
    res.status(200).json({
      blogs: allPosts,
    });
  } catch (error) {
    console.log(error);
  }
});
app.get("/tasks", async (req, res) => {
  try {
    const query = {};
    const cursor = emberPostCollection.find(query);
    const allPosts = await cursor.toArray();
    res.status(200).json({
      tasks: allPosts,
    });
  } catch (error) {
    console.log(error);
  }
});
app.get("/bookLibraries", async (req, res) => {
  try {
    const query = {};
    const cursor = emberPostCollection.find(query);
    const allPosts = await cursor.toArray();
    res.status(200).json({
      bookLibrary: allPosts,
    });
  } catch (error) {
    console.log(error);
  }
});
app.get("/posts/:id", async (req, res) => {
  const id = req.params.id;
  const query = {
    _id: new ObjectId(id),
  };
  const result = await emberPostCollection.findOne(query);
  console.log(result);

  res.status(200).json({
    _id: req.params.id,
    result,
  });
});
app.put("/posts/:id", async (req, res) => {
  const newName = req.body.post?.name;

  const id = req.params.id;
  const result = await emberPostCollection.updateOne(
    {
      _id: new ObjectId(id),
    },
    {
      $set: {
        name: newName,
      },
    }
  );

  return res.status(200).json({
    _id: id,
    name: newName,
  });
});

app.delete("/posts/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await emberPostCollection.deleteOne({
      _id: new ObjectId(id),
    });
    return res.send({
      _id: id,
    });
  } catch (err) {
    console.log(err);
  }
});

// for ember books library project

// post email invitation

app.post("/emailInvitations", async (req, res) => {
  const email = req.body?.emailInvitation?.email;

  const result = await emailInvitations.insertOne({
    email,
  });
  if (result?.acknowledged) {
    return res.send({
      emailInvitation: {
        _id: result.insertedId.toString(),
        email,
      },
    });
  } else {
    return res.send({
      success: false,
      message: "email added failed",
    });
  }
});

// get all email invitations

app.get("/emailInvitations", async (req, res) => {
  try {
    const query = {};
    const cursor = emailInvitations.find(query);
    const allInvitations = await cursor.toArray();
    res.status(200).send({
      emailInvitation: allInvitations,
    });
  } catch (error) {
    console.log(error);
  }
});

// for libraries get

app.get("/libraries", async (req, res) => {
  if (req.query?.letter) {
    const letter = req.query.letter;
    const regexPattern = new RegExp("^" + letter);
    const filteredLibraries = emberLibraries.find({
      name: {
        $regex: regexPattern,
        $options: "i",
      },
    });
    const allLibraries = await filteredLibraries.toArray();
    return res.send({
      library: allLibraries,
    });
  }
  try {
    const query = {};
    const cursor = emberLibraries.find(query);
    const allLibraries = await cursor.toArray();
    res.status(200).send({
      library: allLibraries,
    });
  } catch (error) {
    console.log(error);
  }
});

// for libraries post

app.post("/libraries", async (req, res) => {
  const libraryNumber = req.body?.library?.libraryNumber;
  const name = req.body?.library?.name;
  const address = req.body?.library?.address;
  const phone = req.body?.library?.phone;
  if (libraryNumber) {
    let allLibraryData = [];

    function generateFaakeData() {
      const name = faker.name.firstName();
      const address = faker.address.country();
      const phone = faker.phone.number();

      allLibraryData.push({
        name,
        address,
        phone,
      });
    }

    for (let i = 1; i <= libraryNumber; i++) {
      generateFaakeData();
    }
    const result = await emberLibraries.insertMany(allLibraryData);
    console.log(result);

    return res.send({
      library: {
        _id: "feds",
        allLibraryData,
      },
    });
  } else {
    const result = await emberLibraries.insertOne({
      name,
      address,
      phone,
    });
    if (result?.acknowledged) {
      return res.send({
        library: {
          _id: result.insertedId.toString(),
          name,
          address,
          phone,
        },
      });
    } else {
      return res.send({
        success: false,
        message: "library added failed",
      });
    }
  }
});
app.get("/libraries/:id", async (req, res) => {
  const id = req.params.id;
  console.log(id);
  const query = {
    _id: new ObjectId(id),
  };
  const result = await emberLibraries.findOne(query);
  console.log(result);
  res.send({
    library: {
      _id: result?._id.toString(),
      name: result?.name,
      address: result?.address,
      phone: result?.phone,
    },
  });
});

// update

app.put("/libraries/:id", async (req, res) => {
  const body = req.body;

  const id = req.params.id;
  const name = req.body?.library?.name;
  const address = req.body?.library?.address;
  const phone = req.body?.library?.phone;
  const result = await emberLibraries.updateOne(
    {
      _id: new ObjectId(id),
    },
    {
      $set: {
        name,
        address,
        phone,
      },
    }
  );
  if (result?.acknowledged) {
    return res.send({
      library: {
        _id: req.params.id,
        name,
        address,
        phone,
      },
    });
  } else {
    return res.send({
      success: false,
      message: "library updated failed",
    });
  }
});

app.delete("/libraries/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await emberLibraries.deleteOne({
      _id: new ObjectId(id),
    });
    return res.send({
      library: {
        _id: id,
      },
    });
  } catch (err) {
    console.log(err);
  }
});

// for author
// create author

app.post("/authors", async (req, res) => {
  const name = req.body?.author?.name;

  const result = await emberAuthors.insertOne({
    name,
  });
  if (result?.acknowledged) {
    return res.send({
      author: {
        _id: result.insertedId.toString(),
        name,
      },
    });
  } else {
    return res.send({
      author: {
        success: false,
        message: "author added failed",
      },
    });
  }
});

// get all author
app.get("/authors", async (req, res) => {
  try {
    const query = {};
    const cursor = emberAuthors.find(query);
    const allAuthors = await cursor.toArray();
    res.status(200).send({
      author: allAuthors,
    });
  } catch (error) {
    console.log(error);
  }
});

app.get("/authors/:id", async (req, res) => {
  const id = req.params.id;
  const query = {
    _id: new ObjectId(id),
  };
  const result = await emberAuthors.findOne(query);
  return res.send({
    author: {
      _id: result._id.toString(),
      name: result.name,
    },
  });
});

app.put("/authors/:id", async (req, res) => {
  const id = req.params.id;
  const name = req.body?.author?.name;

  const result = await emberAuthors.updateOne(
    {
      _id: new ObjectId(id),
    },
    {
      $set: {
        name,
      },
    }
  );
  if (result?.acknowledged) {
    return res.send({
      author: {
        _id: req.params.id,
        name,
      },
    });
  } else {
    return res.send({
      success: false,
      message: "library updated failed",
    });
  }
});

app.delete("/authors/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await emberAuthors.deleteOne({
      _id: new ObjectId(id),
    });
    return res.send({
      author: {
        _id: id,
      },
    });
  } catch (err) {
    console.log(err);
  }
});

// for create books

app.post("/books", async (req, res) => {
  const title = req.body?.book?.title;
  const releaseYear = req.body?.book?.releaseYear;
  const author = req.body?.book?.author;
  const library = req.body?.book?.library;

  const result = await emberBooks.insertOne({
    title,
    releaseYear,
    author,
    library,
  });
  if (result?.acknowledged) {
    return res.send({
      book: {
        _id: result.insertedId.toString(),
        title,
        releaseYear,
        author,
        library,
      },
    });
  } else {
    return res.send({
      book: {
        success: false,
        message: "author added failed",
      },
    });
  }
});

// get all books

app.get("/books", async (req, res) => {
  const page = req.query?.page;
  const limit = req.query?.limit;

  if (page && limit) {
    const skip = (page - 1) * limit;
    try {
      const query = {};
      const totalDocuments = await emberBooks.estimatedDocumentCount();
      const cursor = emberBooks.find(query).skip(skip).limit(parseInt(limit));
      const allBooks = await cursor.toArray();
      // console.log(allBooks.length);
      // const totalDocuments  = await cursor.count()

      // allBooks = cursor.toArray()
      return res.send({
        book: allBooks,
        meta: {
          totalDocuments,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
  // const count = await emberBooks.find({}).count()
  // console.log(count);
  try {
    const query = {};
    const cursor = emberBooks.find(query);
    const allBooks = await cursor.toArray();
    const totalDocuments = await emberBooks.estimatedDocumentCount();
    // allBooks = cursor.toArray()
    return res.status(200).send({
      book: allBooks,
      meta: {
        totalDocuments,
      },
    });
  } catch (error) {
    console.log(error);
  }
});

// update book

app.put("/books/:id", async (req, res) => {
  const id = req.params.id;
  const author = req.body?.book?.author;
  const title = req.body?.book?.title;
  const library = req.body?.book?.library;

  const result = await emberBooks.updateOne(
    {
      _id: new ObjectId(id),
    },
    {
      $set: {
        author,
        title,
        library,
      },
    }
  );
  if (result?.acknowledged) {
    return res.send({
      book: {
        _id: req.params.id,
        author,
        title,
        library,
      },
    });
  } else {
    return res.send({
      book: {
        success: false,
        message: "library updated failed",
      },
    });
  }

  // if (result.author !== author) {

  //   const result = await emberBooks.updateOne(
  //     { _id: new ObjectId(id) },
  //     {
  //       $set: {
  //         author,
  //       },
  //     }
  //   );
  //   if (result?.acknowledged) {
  //     return res.send({ book: { _id: req.params.id, author } });
  //   } else {
  //     return res.send({
  //       book: { success: false, message: "library updated failed" },
  //     });
  //   }

  // } else {

  //   const result = await emberBooks.updateOne(
  //     { _id: new ObjectId(id) },
  //     {
  //       $set: {
  //         title,
  //       },
  //     }
  //   );
  //   if (result?.acknowledged) {
  //     return res.send({ book: { _id: req.params.id, title } });
  //   } else {
  //     return res.send({
  //       book: { success: false, message: "library updated failed" },
  //     });
  //   }
  // }
});

app.get("/books/:id", async (req, res) => {
  const id = req.params.id;
  const query = {
    _id: new ObjectId(id),
  };
  const result = await emberBooks.findOne(query);
  return res.send({
    book: {
      _id: result._id.toString(),
      title: result.title,
    },
  });
});

app.delete("/books/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await emberBooks.deleteOne({
      _id: new ObjectId(id),
    });
    return res.send({
      book: {
        _id: id,
      },
    });
  } catch (err) {
    console.log(err);
  }
});

app.get("/codes", (req, res) => {
  if (req.headers["authorization"] !== "Bearer some bs") {
    return res.status(401).send("Unauthorize");
  }

  return res.send({
    code: [
      {
        _id: 1,
        description:
          "Obama Nuclear Missile Launching Code is: lovedronesandthensa",
      },
      {
        _id: 2,
        description:
          "Putin Nuclear Missile Launching Code is: invasioncoolashuntingshirtless",
      },
    ],
  });
});

app.post("/token", function (req, res) {
  if (req.body.email == "login" && req.body.password == "ok") {
    setTimeout(() => {
      res.send({
        access_token: "some bs",
      });
    }, 2000);
  } else {
    res.status(400).send({
      error: "invalid_grant",
    });
  }
});
app.get("/cookies", function (req, res) {
  res.cookie("name", "zahidhasanjibon");
  res.send("cookie set");
});
app.get("/cookiess", function (req, res) {
  console.log(req.cookies);
  res.send("ok");
});

// for zakat test project api

// app.get('/zakatTakers',async (req,res) => {
//     const data = {
//       zakatTaker:
//         [
//           {_id:1,
//             name:'md karim',
//             address:'dhaka',
//             phone:'01732432',
//             country:'bangladesh',
//           },
//           {_id:2,
//             name:'md rahim',
//             address:'dhaka',
//             phone:'01732432',
//             country:'bangladesh',
//           },
//           {_id:3,
//             name:'md kamal',
//             address:'dhaka',
//             phone:'01732432',
//             country:'london',
//           },
//         ]

//     }
//   res.send(data)

// })
// app.get('/loanPayouts',async (req,res) => {
//     const data = {
//       loanPayout:
//         [
//           {_id:1,
//             amount:'30000',
//             due:'3454 ',
//             debit:'01732432',
//             credit:'345325',
//           },
//           {_id:2,
//             amount:'234324',
//             due:'3243',
//             debit:'01732432',
//             credit:'324324',
//           },
//           {_id:3,
//             amount:'324324',
//             due:'234324',
//             debit:'01732432',
//             credit:'345425',
//           },
//         ],
//         meta:{ength:10}

//     }
//   res.send(data)

// })

// for ember simple auth

// middleware

function verifyJwtToken(req, res, next) {
  try {
    const token = req.headers?.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).send("token not found");
    }
    console.log(token);
    jwt.verify(token, process.env.JSON_SECRET, (err, decode) => {
      if (err) {
        return res.status(403).json({
          success: false,
          error: "invalid token",
        });
      }
      req.userName = decode.userName;

      next();
    });
  } catch (error) {
    console.log(error);
  }
}

app.get("/messages", verifyJwtToken, (req, res) => {
  // if(req.headers['authorization'] !== "Bearer secret-token"){
  //   return res.status(401).send('Unauthorize')
  // }

  return res.send({
    message: [
      {
        _id: 1,
        message: "Obama Nuclear Missile Launching Code is: lovedronesandthensa",
      },
      {
        _id: 2,
        message:
          "Putin Nuclear Missile Launching Code is: invasioncoolashuntingshirtless",
      },
    ],
  });
});

app.post("/api/token", async (req, res) => {
  const { userName, password } = req.body;

  if (userName === "test" && password === "123") {
    const accessToken = jwt.sign(
      {
        userName,
        password,
      },
      process.env.JSON_SECRET,
      {
        expiresIn: "10s",
      }
    );
    const refreshToken = jwt.sign(
      {
        userName,
        password,
      },
      process.env.JSON_SECRET,
      {
        expiresIn: "20s",
      }
    );

    res.status(200).json({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  } else {
    res.status(400).send("invalid credentials");
  }
});
// create refresh token
app.get("/api/token/new", verifyJwtToken, async (req, res) => {
  const accessToken = jwt.sign(
    {
      userName: req.userName,
    },
    process.env.JSON_SECRET,
    {
      expiresIn: "10s",
    }
  );

  const refreshToken = jwt.sign(
    {
      userName: req.userName,
    },
    process.env.JSON_SECRET,
    {
      expiresIn: "20s",
    }
  );

  res.status(200).json({
    success: true,
    message: "new token create after validate refresh token",
    access_token: accessToken,
    refresh_token: refreshToken,
  });
});

app.get("/api/tokendata", verifyJwtToken, async (req, res) => {
  res.send("okk");
});
app.get("/api/check/token", verifyJwtToken, async (req, res) => {
  res.status(200).json({
    success: true,
  });
});

app.listen(PORT, () => {
  console.log(`server listen on port ${PORT}`);
});

app.get("/api/custom/token", async (req, res) => {
  const accessToken = jwt.sign(
    {
      name: "jibon",
    },
    process.env.JSON_SECRET,
    {
      expiresIn: "4m",
    }
  );
  res.send(accessToken);
});

// admin panel api

app.get("/adminPanels", async (req, res) => {
  const data = {
    data: {
      id: 1,
      name: "admin-panel",
      adminPanelBackground: "white",
      navbarTextColor: "white",
      navbarLogo:
        "https://sadaqatulzakat.com/assets/images/logo-53b2e5631ce2cce6c254cd6c6fff98f9.png",
      navbarColor: "#4db14d",
      searchIcon:
        "https://upload.wikimedia.org/wikipedia/commons/0/0b/Search_Icon.svg",
      accountProfilePic:
        "https://www.shutterstock.com/image-photo/portrait-young-smiling-caucasian-man-260nw-1491969899.jpg",
      searchColor: "white",
      profilePicShape: "square",
      sideNavbarColor: "#3a983a",
      userTableColor: "#4db14d",
      archiveUserTableColor: "#468099",
      footerColor: "#3a983a",
      adminPanelBackground: "white",
      userTableTextColor: "white",
      archiveTableTextColor: "white",
      sideNavbarBtns: [
        "System",
        "User Roles",
        "Manage Admins",
        "Zakat Requests",
        "Zakat Donators",
      ],
    },
  };
  res.status(200).send(data);
});

app.get("/zakatReqTables", async (req, res) => {
  const data = {
    data: [
      {
        id: 1,
        reqType: {
          type: "Medical",
          name: "Mohammad Adnan Akhtar Tony",
        },
        request: {
          date: "20 may,2023",
          token: "34234234234",
        },
        amount: "3242",
        details: { name: "Mohammadd Adnan Akhtar Tony", nid: "23423423423" },
        contacts: {
          phone: "234234324",
          email: "test@gmail.com",
          address: "3rd,house 11/b Dhaka,Bangladesh",
        },
        description: "lorem8dwe wefwwewt w wetw  w ewtf",
        status: [
          {
            name: "Request Pending",
            time: "6th may 23 4:20:12",
            review: "",
            disposition: "",
          },
          {
            name: "File Under Review",
            time: "",

            review: "",
            disposition: "",
          },
          {
            name: "File Under Process",
            time: "",

            review: "",
            disposition: "",
          },
          {
            name: "Request for Budget Allocation",
            time: "",

            review: "",
            disposition: "",
          },
          {
            name: "Donor Acceptance",
            time: "",

            review: "",
            disposition: "",
          },
          {
            name: "Zakat Approval",
            time: "",

            review: "",
            disposition: "",
          },
          {
            name: "Physical Verification",
            time: "",

            review: "",
            disposition: "",
          },
          {
            name: "Zakat Disbursed",
            time: "",

            review: "",
            disposition: "",
          },
        ],
      },
      {
        id: 2,
        reqType: {
          type: "Shelter",
          name: "Mohammad Adnan Akhtar Tony",
        },
        request: {
          date: "20 may,2023",
          token: "34234234234",
        },
        amount: "3242",
        details: { name: "Mohammadd Adnan Akhtar Tony", nid: "23423423423" },
        contacts: {
          phone: "234234324",
          email: "test@gmail.com",
          address: "3rd,house 11/b Dhaka,Bangladesh",
        },
        description: "lorem8dwe wefwwewt w wetw  w ewtf",
        status: [
          {
            name: "Request Pending",
            time: "",

            review: "",
            disposition: "",
          },
          {
            name: "File Under Review",
            time: "",

            review: "",
            disposition: "",
          },
          {
            name: "File Under Process",
            time: "6th may 23 1:20:22",

            review: "",
            disposition: "",
          },
          {
            name: "Request for Budget Allocation",
            time: "",

            review: "",
            disposition: "",
          },
          {
            name: "Donor Acceptance",
            time: "",

            review: "",
            disposition: "",
          },
          {
            name: "Zakat Approval",
            time: "",

            review: "",
            disposition: "",
          },
          {
            name: "Physical Verification",
            time: "",

            review: "",
            disposition: "",
          },
          {
            name: "Zakat Disbursed",
            time: "",

            review: "",
            disposition: "",
          },
        ],
      },
    ],
  };
  res.status(200).send(data);
});
