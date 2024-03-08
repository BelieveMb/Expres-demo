const express = require("express");
const PORT = 3002;
const app = express();

const data = require("./data.json");

app.use(express.json());

function findArticleById(id) {
  return data.find((article) => article.id === +id);
}

function findArticleIndex(id) {
  return data.findIndex((article) => article.id === +id);
}
// function paginateArticle(pageStart, pageEnd) {
  function paginateArticle(page) {
  return data.slice((page - 1) * 10, page * 10);
  // return data.slice(pageStart, pageEnd);
}
function showPageArticle(page){
  if(page === 1){
    // return paginateArticle(0,10);
    return paginateArticle(1);
    
  }else if (page === 2) {
    // return paginateArticle(10,20);
    return paginateArticle(2);
  } else if (page === 3) {
    // return paginateArticle(20,30);
    return paginateArticle(3);
  } 
  else {
    // return paginateArticle(40,50); 
    return paginateArticle(5); 
  }
  
}


app.get("/", (req, res) => {
  console.log("L'application fonctionne");
  res.send("L'application fonctionne");
});
app.get("/articles", (req, res) => {
  res.send(data);
});

/*------------------la pagination par 10 ------------------*/
app.get("/articles-page=:id", (req, res) => {
  const { id } = req.params;
  res.send(showPageArticle(+id));
});


app.get("/articles/:id", (req, res) => {
  const { id } = req.params;
  const article = findArticleById(id);
  if (article) {
    return res.send(article);
  }

  res.status(404).send(`L'article avec l'id : ${id} n'existe pas`);
});

app.post("/articles", (req, res) => {
  const newArticle = req.body;

  data.push(newArticle);

  res.status(201).send(data[data.length - 1]);
});

app.put("/articles/:id", (req, res) => {
  const article = req.body;
  const { id } = req.params;
  const articleIndex = findArticleIndex(id);
  if (articleIndex < 0) {
    data.push(article);
    return res.status(201).send(data[data.length - 1]);
  } else {
    data[articleIndex] = article;
    return res.status(200).send(data[articleIndex]);
  }
});

app.delete("/articles/:id", (req, res) => {
  const { id } = req.params;
  const articleIndex = findArticleIndex(id);
  const article = findArticleById(id);
  if (articleIndex < 0) {
    res.status(404).send(`L'article avec l'id ${id} n'existe pas`);
  } else {
    data.splice(articleIndex, 1);
    res.status(202).send(article);
  }
});

/*------------------supprimer un groupe de données------------------*/
app.delete("/articles/delete/:id", (req, res) => {
  const { id } = req.params; 
  for (let i = 0; i < id; i++) {

    data.shift(id); 
    res.status(200).send(`Les ${id} premiers articles ont été supprimé  `);  

  }

});


app.listen(PORT, () => {
  console.log(`Le serveur écoute sur le port ${PORT}`);
});


