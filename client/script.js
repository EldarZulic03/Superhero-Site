document.addEventListener("DOMContentLoaded", ()=>{
    
    const search_input = document.getElementById("search_input");
    const search_field = document.getElementById('search_field');
    const search_btn = document.getElementById('search_btn');
    const create_list_btn = document.getElementById('create_list_button');
    const edit_list_btn = document.getElementById('edit_list_button');
    const edit_list_inpt = document.getElementById('edit_content');
    const edit_name_inpt = document.getElementById('edit_list_name');

    const del_list_btn = document.getElementById('del_list_btn');
    const del_inpt = document.getElementById('del_name');

    const ret_btn = docment.getElementById('ret_list_btn');
    const ret_inpt = document.getElementById('ret_name')

    const list_cont = document.getElementById('lists');
    const listID_inpt = document.getElementById('list_content');
    const listName_inpt = document.getElementById('list_name');
    const sort_select = document.getElementById('sort_by');

    const clear_btn = document.getElementById('clear_btn');
    const hero_display = document.getElementById('hero_display');
    const small_HD = document.getElementById('small_display');

    const display_num = document.getElementById('display_number')
    let n = 6;

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




    //clears the hero display and small display if the clear button is clicked
    clear_btn.addEventListener("click", async(e) =>{
        e.preventDefault();
        hero_display.innerHTML = "";
        small_HD.innerHTML = "";
    })


    //searches when the search button is clicked
    search_btn.addEventListener("click", async (e) =>{
        
        e.preventDefault();
        
        
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

        

    })

});

