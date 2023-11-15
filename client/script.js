document.addEventListener("DOMContentLoaded", ()=>{
    //creating all event listeners
    
    const searchForm = document.getElementById('search_form');

    const create_list_btn = document.getElementById('create_list_button');
    
    const edit_btn = document.getElementById('edit_list_button');
    const edit_list_inpt = document.getElementById('edit_content');
    const edit_name_inpt = document.getElementById('edit_list_name');

    const del_btn = document.getElementById('del_list_btn');
    const del_inpt = document.getElementById('del_name');

    const ret_btn = docment.getElementById('ret_list_btn');
    const ret_inpt = document.getElementById('ret_name')

    const listID_inpt = document.getElementById('list_content');
    const listName_inpt = document.getElementById('list_name');
    const sort_select = document.getElementById('sort_by');

    const clear_btn = document.getElementById('clear_btn');
    const hero_display = document.getElementById('hero_display');
    const small_HD = document.getElementById('small_display');

    const display_num = document.getElementById('display_number')
    let n = 6;

    //function to display the searched heroes
    const displayHeroes = (data, info,  sort) =>{
        hero_display.innerHTML = "";
        small_HD.innerHTML = "";

        if(data.superheroes.length === 0){
            hero_display.innerHTML = "No Heroes Found!";
        }
        else{


            if(info !==false){
                const dataContent = document.createElement("pre");
                dataInfo.textContent = JSON.stringify(info, null, 1);
                small_HD.appendChild(dataContent);
            }

            const title = document.createElement('h3');
            title.textContent = "Info: ";
            small_HD.appendChild(title);

            if(sort !=="none"){
                data = sortHeroes(data,sort);
            }

            data.superheroes.forEach(superhero =>{
                //create heroElement add name, info, powers
                const heroElement = document.createElement("div");
                heroElement.classList.add('superhero');
                const heroName = document.createElement("h3");
                heroName.textContent = superhero.name;
                heroElement.appendChild(heroName);
                const heroInfo = document.createElement("h3");

                for(const sup in superhero.info){
                    const supVal = superhero.info[sup];
                    if(supVal !== "-"){
                        const listContent = document.createElement("li");
                        listContent.textContent = sup + ": " + supVal;
                        heroInfo.appendChild(listContent);
                    }
                }
                heroElement.appendChild(heroInfo);

                const powers = document.createElement("ul");
                for(const sup in superhero.powers){

                    const powerBool = superhero.powers[sup] === "True";

                    if(powerBool){

                        const listContent = document.createElement("li");
                        listContent.textContent = sup;
                        powers.appendChild(listContent);
                    }
                }
                heroElement.appendChild(powers);

                
                hero_display.appendChild(heroElement);
            })
        }
    };



    searchForm.addEventListener("click", async(e)=>{
        e.preventDefault();

        const search_input = document.getElementById("search_input");
        const search_field = document.getElementById('search_field');
        const search_btn = document.getElementById('search_btn');

        //searches when the search button is clicked
        search_btn.addEventListener("click", async (e) =>{
            e.preventDefault();
            alert("search button pressed");
        
        
            //check the number of heroes that need to be displayed
            if(display_num.value){
                if(!positiveCheck(display_num.value)){
                    alert("Number of displayed heroes must be positive.")
                }
                else{
                    n = display_num.value;
                }
            }else{
                n = 6;
            }

            let search;
            const sort = sort_select.value;
            

            if(search_field.value !== "name"){
                search = capLetter(search_field.value);
            }else{
                search = search_field.value;
            }

            const searchInpt = clean(search_input.value);

            if(!searchInpt){
                alert("The field and the search input are needed")
                return;
            }

            try{
                //calls api
                const url = `http://localhost:5001/search?=${search}&pattern=${searchInpt}&n=${n}`;
                const resp = await fetch(url);

                if(resp.ok){
                    const result = await resp.json();
                    displayHeroes(result,false,sort)
                }else{
                    alert("ERROR: could not search for superheroes");
                }
        
            }catch(error){
                console.error("API Error: ", error);
                alert("Error popped up while search for the superheroes");
            }

            //searches for heroes that fit the parameters
        });
    });

    //clears the hero display and small display if the clear button is clicked
    clear_btn.addEventListener("click", async(e) =>{
        e.preventDefault();
        hero_display.innerHTML = "";
        small_HD.innerHTML = "";
    })


    // //searches when the search button is clicked
    // search_btn.addEventListener("click", async (e) =>{
    //     e.preventDefault();
    //     alert("search button pressed");
        
        
    //     //check the number of heroes that need to be displayed
    //     if(display_num.value){
    //         if(!positiveCheck(display_num.value)){
    //             alert("Number of displayed heroes must be positive.")
    //         }
    //         else{
    //             n = display_num.value;
    //         }
    //     }else{
    //         n = 6;
    //     }

    //     let search;
    //     const sort = sort_select.value;
        

    //     if(search_field.value !== "name"){
    //         search = capLetter(search_field.value);
    //     }else{
    //         search = search_field.value;
    //     }

    //     const searchInpt = clean(search_input.value);

    //     if(!searchInpt){
    //         alert("The field and the search input are needed")
    //         return;
    //     }

    //     try{
    //         //calls api
    //         const url = `http://localhost:5001/search?=${search}&pattern=${searchInpt}&n=${n}`;
    //         const resp = await fetch(url);

    //         if(resp.ok){
    //             const result = await resp.json();
    //             displayHeroes(result,false,sort)
    //         }else{
    //             alert("ERROR: could not search for superheroes");
    //         }
        
    //     }catch(error){
    //         console.error("API Error: ", error);
    //         alert("Error popped up while search for the superheroes");
    //     }

    //     //searches for heroes that fit the parameters
    // });

    //checks if create list button was clicked
    create_list_btn.addEventListener("click", async(e)=>{
        e.preventDefault();
        const name = clean(listName_inpt.value);
        const heroes = listID_inpt.value.split(',').map(id => parseInt(id));

        if(!name || !heroes || heroes.length ===0){
            alert("The name of the list and the heroe IDS are needed to create the list");
            return;
        }
        try{
            //calls api
            const url = "http://localhost:5001/lists";
            const body = JSON.stringify({name, heroes});

            const resp = await fetch(url,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body,
            });

            if(resp.ok){
                alert("List Created!");

            }else{
                alert("ERROR: List was already previously made");
            }

        }catch (error){
            console.error("API calling error:", error);
            alert("Error occured while making the list")
        }
        //creates list with chosen name and heroes
    });

    //checks if edit button was clicked
    edit_btn.addEventListener("click", async(e) =>{
        e.preventDefault();
        const listName = clean(edit_name_inpt.value);
        const heroes = edit_list_inpt.value.split(',').map(id =>{
            parseInt(id);
        });
        
        if(!listName || !heroes || heroes.length ===0){
            alert("The list name and heroes names are required in the fields.")
            return;
        }

        try{
            //calls api
            const url = `http://localhost:5001/lists/${listName}`;
            const body = JSON.stringify({heroes});

            const resp = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body,
            });
            if(resp.ok){
                alert("List was edited");

            }else{
                alert("List was not edited");
            }
        }catch(error){
            alert("ERROR brought up while editing the list")
            console.error("API calling error: ", error);
            
        };//error handling
        //edits the selected list
    });

    //checks if delete button is clicked
    del_btn.addEventListener("click", async(e)=>{
        
        e.preventDefault();
        const deletedList = clean(del_inpt.value);

        if(!deletedList){
            alert("Enter name of the list you want to delete");
            return;
        }

        //if delete list button is clicked deletes the named list

        try{
            //calls api
            const url = `http://localhost:5001/lists/${deletedList}`;
            //api call 

            const resp  = await fetch(url,{
                method: "DELETE",
            });//deleted method

            if(resp.ok){
                alert("List deleted");
            }else{
                alert("Could not delete list")
            }
        }catch(error){
            console.error("API calling eror: ", error);
            alert("Error while trying to delete list");
        }
    });

    //checks if ret list button was clicked
    ret_btn.addEventListener("click", async(e) =>{

        e.preventDefault();
        const sort = sort_select.value;
        const listName = clean(ret_inpt.value);

        if(!listName){
            alert("Name of list is needed");
            return;
        }
        try{
            //api call 
            const url = `http://localhost:5001/lists/${listName}`;
            const contentUrl = `http://localhost:5001/lists/${listName}/superheroes`;

            const contentUrlResp = await fetch(contentUrl);
            const resp = await fetch(url);
            //await api response

            if(contentUrlResp.ok && resp.ok){
                const result = await resp.json();
                const contentUrlResult = await contentUrlResp.json();
                alert("list retrieved");

                displayHeroes(contentUrlResult, result, sort);
                //displays the heros 
            }
        }catch(error){
            //error handling
            console.error("APi calling error",error);
            alert("error while creating list")
        }
    });
   
});

//function to choose which sorting function the heroes will go to 
const sortHeroes = (heroes,sortVal) =>{
    if(sortVal==="race"){
        return sortByRace(heroes);
    }else if(sortVal ==='power'){
        return sortByPower(heroes);

    }
    else if(sortVal ==="name"){
        return sortByName(heroes);
    }
    else if(sortVal==='publisher'){
        return sortByPublisher(heroes);
    }

};


function capLetter(word){
    
    const firstChar = word.charAt(0);
    const capital = firstChar.toUpperCase();
    
    const restOfWord = word.slice(1);
    const newWord = capital + restOfWord;

    return newWord;
};

//sorts by race
function sortByRace(heroes){
    if(!heroes.superheroes || !Array.isArray(heroes)){
        return heroes;
    };

    heroes.superheroes.sort((a,b) =>{
        a.info.Race.localeCompare(b.info.Race)
    });
    //sorts by race alphabetically
    return heroes;
};

//sorts by name
function sortByName(heroes){

    if(!Array.isArray(heroes.superheroes) || !heroes.superheroes){
        return heroes;
    }

    heroes.superheroes.sort((a,b) =>{
        a.name.localeCompare(b.name)
    })
    //sorts alphabetically
    return heroes;
};

//sorts by publisher
function sortByPublisher(heroes){
    if(!Array.isArray(heroes.superheroes) || !heroes.superheroes){
        return heroes;
    }

    heroes.superheroes.sort((a,b) =>{
        a.info.Publisher.localeCompare(b.info.Publisher)
        //returns which is publisher alphabetically
    });
    return heroes;
};

//sorts list of heroesby power
function sortByPowers(heroes){

    if(!heroes.superheroes || !Array.isArray(heroes.superheroes)){
        return heroes;
    }

    heroes.superheroes.sort((a,b) =>{

        const aPowers = Object.values(a.powers).filter(power =>{
            power === "True"
        }).length;
        const bPowers = Object.value(b.powers).filter(power =>{
            power === "True"
        }).length;
        //returns which hero has more powers a or b
        return aPowers - bPowers;
    });
    return heroes;
}

//cleans the input data so no issues arise
function clean(needsCleaning){

    needsCleaning.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    needsCleaning.replace(/<\/?[^>]+(>|$)/g, '');
    //removes any javascript code or html tags

    return needsCleaning;
};


//checks if number for display length is positive or not
function positiveCheck(str){
    var num = Math.floor(Number(str));
    return  num >=0 && String(n) && num !== Infinity;
};



