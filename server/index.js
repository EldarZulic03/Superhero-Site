import express from 'express';
import flatCache from 'flat-cache';
import jsonSuperInfo from './superhero_info.json' assert {type:'json'}
import jsonSuperPower from './superhero_powers.json' assert {type:'json'}
//Import Statements

const app = express();
const port = 5001;//server port number

const cache = flatCache.load('superCache');
cache.setKey('superhero_info', jsonSuperInfo);
cache.setKey('superhero_powers', jsonSuperPower);
//sets index.html as index file

app.use(express.static('../client'));
app.use(express.json({limit: '2mb'}));
app.use(express.urlencoded({extended:true}));

//check if api is running
//local
app.listen(port, ()=>{
    console.log("API running")
});


//GET superhero
app.get('/superhero/:id', (req,res)=>{
    const id = parseInt(req.params.id);
    const superInfo = cache.getKey('superhero_info');
    const superHero = superInfo.find((hero)=>hero.id === id);

    if(superHero){
        res.json(superHero);
    }else{
        res.status(404).json({error: 'SuperHero Not Found'});
        //error if superheroe doesnt exist
    }
});


//GET powers
app.get('/superhero/:id/powers', (req,res)=>{

    const id = parseInt(req.params.id);
    const superheroInfo = cache.getKey('superhero_info');
    const superhero = superheroInfo.find((hero) => hero.id === id);
  
    if (superhero) {
      const superheroName = superhero.name;
      const superheroPowers = cache.getKey('superhero_powers');
      let powers = superheroPowers.find((hero) => hero.hero_names === superheroName);

      powers = remove(powers)
  
      if (powers) {
        delete powers.hero_names;
        res.json(powers);
      } else {
        res.status(404).json({ error: 'Superhero powers not found' });
      }
    } else {
      res.status(404).json({ error: 'Superhero not found' });
    }
});

// SEARCH
app.get('/search', (req, res) => {
    const { field, pattern, n } = req.query;
    const superheroInfo = cache.getKey('superhero_info') || [];
    const superheroPowers = cache.getKey('superhero_powers') || [];
  
    if (!field || !pattern) {
      return res.status(400).json({ error: 'Field and pattern are required query parameters.' });
    }
    
    let matchingSuperheroes;
    let heroIds = [];
  
  
    if (field.toLowerCase() !== "power") {
      const superheroInfo = cache.getKey('superhero_info');
      matchingSuperheroes = superheroInfo.filter((hero) =>
        hero[field] && hero[field].toLowerCase().includes(pattern.toLowerCase())
      );
  
      heroIds = matchingSuperheroes.map((item) => item.id);
  
    } else {
      const superheroPowers = cache.getKey('superhero_powers');
      matchingSuperheroes = superheroPowers.filter((powers) => powers[pattern] === "True");
  
      matchingSuperheroes = remove(matchingSuperheroes);
  
      heroIds = matchingSuperheroes.map((hero) => {
        const heroName = hero.hero_names;
        const matchingHero = superheroInfo.find((info) => info.name === heroName);
    
        if (matchingHero) {
          return matchingHero.id;
        }
      });
    
    }
  
    //console.log(matchingSuperheroes)
  
    console.log(heroIds)
  
    heroIds = heroIds.filter((id) => id !== undefined);
    
  
    //const heroIDs = lists[listName]; //array of heros
    let superheroesInList = heroIds.map((id) => {
      const superhero = superheroInfo.find((hero) => hero.id === id);
      if (superhero) {
        let powers = superheroPowers.find((powers) => powers.hero_names === superhero.name);
        powers = deleteAttributes(powers)
        return { name: superhero.name, info: superhero, powers };
      }
      return null;
    });
  
    let listName = "NA";
    
    // cut the search to match limit
    if (n && superheroesInList.length > n) {
      superheroesInList = superheroesInList.slice(0, n);
    } 
  
    res.json({ listName, superheroes: superheroesInList.filter(Boolean) });
  
  });

// //GET matching superheroes through search
// app.get('/search', (req,res)=>{
    
//     const{field, pattern, n} = req.query;//gets the query

//     const superInfo = cache.getKey('superhero_info') || [];
//     const superHeroPowers = cache.getKey('superhero_powers') || [];


//     if(!field || !pattern){
//         return res.status(400).json({error: 'Field & Pattern Are Needed to Query'});
//         //error if there is no field andpattern
//     }

//     let matchingHeroes;
//     let heroIDs = [];

//     if (field.toLowerCase() !== "power"){
//         const superInfo = cache.getKey('superhero_info');
//         //gets matching heroes
//         matchingHeroes = superInfo.filter((hero)=>{
//             hero[field] && hero[field].toLowerCase().includes(pattern.toLowerCase());
//         });

//         heroIDs = matchingHeroes.map((item)=>{
//             item.id
//         });

        
//     }else{

//         const superHeroPowers = cache.getKey('superhero_powers');
//         matchingHeroes = superHeroPowers.filter((powers)=>{
//             powers[pattern]==="True"
//         });
//         matchingHeroes = remove(matchingHeroes);//removes matching heroes from the results list

//         heroIDs = matchingHeroes.map((hero)=>{
//             const heroName = hero.hero_names;
//             const matchingHero = superInfo.find((info)=>info.name ===heroName);

//             if(matchingHero){
//                 return matchingHero.id;
//             }
//         });

//     }

//     heroIDs = heroIDs.filter((id) =>{
//         id !== undefined
//     });

//     let heroList = heroIDs.map((id) =>{
//         const superHero = heroIDs.map((hero)=>{
//             hero.id ===id;
//         });
//         if(superHero){
//             let powers = superHeroPowers.find((powers)=>powers.hero_names ===superHero.name);
//             powers = deleteAttributes(powers);
//             return{name: superHero.name, info: superHero, powers };
//         }
//         return null;
//     });

//     let listsName = "NONE";

//     if(n && heroList.length>n){
//         heroList = heroList.slide(0,n);
//     }//cuts the search to fit the limit

//     res.json({
//         listsName, 
//         superheroes: heroList.filter(Boolean)
//     });
// });

//create list
app.post('/lists', (req,res)=>{

    // console.log("/lists requested")
    //debugging

    const {name,heroes} = req.body;
    
    

    if(!name || !heroes){
        return res.status(400).json({error:'Both the Name and Heroes is Needed in the Request Body'});
    }
    const lists = cache.getKey('lists') || {};

    if(lists[name]){
        return res.status(409).json({error:'This List Name Already Exists'});
    }

    lists[name] = heroes;
    cache.setKey('lists',lists);
    cache.save();

    res.status(201).json({message: "List Successfully Created"})

});

//Edit List
app.post('/lists/:name', (req,res)=>{
    const listName = req.params.name;
    const {heroes} = req.body;

    if(!heroes){
        return res.status(400,json({error: 'Heroes Array is Needed in The Request Body'}))
    };

    const lists = cache.getKey('lists') || {};

    if(!lists[listName]){
        return res.status(404).json({error: 'List Name Does Not Exists'});
    }

    lists[listName] = heroes;
    cache.setKey('lists', lists);
    cache.save();

    res.status(200).json({message: "List Successfully Updated"});
    //edits hero list 
});


//Get List
app.get('/lists/:name', (req,res)=>{
    const listName = req.params.name;
    const lists = cache.getKey('lists')||{};

    if(!lists[listName]){
        return res.status(404).json({error:'List Name Does Not Exist'});

    };

    const heroes = lists[listName];
    res.json({listName,heroes});
    //returns list of hero names
});

//Delete List
app.delete('/lists/:name',(req,res) =>{
    const listName = req.params.name;
    const lists = cache.getKey('lists')||{};

    if(!lists[listName]){
        return res.status(404).json({error:'List Name Does Not Exisr'});
    };

    delete lists[listName];
    cache.setKey('lists',lists);
    cache.save();
    res.status(200).json({message:'List Successfully Deleted'});
})

//GET List SuperHero Info
app.get('/lists/:name/superheroes', (req,res)=>{
    const listName = req.params.name;
    const lists = cache.getKey('lists')||{};
    const superInfo = cache.getKey('superhero_info')||[];
    const superHeroPowers = cache.getKey('superhero_powers')||[];

    if(!lists[listName]){
        return res.status(404).json({error:'List Name Doesnt Exist'});

    }

    const heroIDs = lists[listName];
    //heroID
    const heroList = heroIDs.map((id)=>{
        const superhero = superInfo.find((hero)=>hero.id ===id);
        if(superhero){
            let powers = superHeroPowers.find((powers) =>powers.hero_names === superhero.name);
            powers = deleteAttributes(powers);
            return{name: superhero, info: superhero, powers};

        }
        return null;
    });
    res.json({listName, superheroes: heroList.filter(Boolean)});
});

function deleteAttributes(data){
    const result = {};

    for(const key in data){
        if(data[key] === "True"){
            result[key] = data[key];
        }
    }

    return result;
}

function remove(jsonData) {
    if (jsonData && jsonData.hero_names) {
      const cleanedData = { hero_names: jsonData.hero_names };
      
      for (const key in jsonData) {
        if (jsonData[key] === 'True') {
          cleanedData[key] = 'True';
        }
      }
  
      return cleanedData;
    }
  
    return jsonData;
  }