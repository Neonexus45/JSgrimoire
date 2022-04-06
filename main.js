const apiUrl = "https://www.dnd5eapi.co/api/spells/";
const maxSuggestions = 5;
var datas;

function loadAllSpells(){
    fetch(apiUrl).then(response => {
        response.json().then(jsonDatas =>{
            datas = jsonDatas.results;
        });
    }).catch(ex => console.log("Can not obtain an answer from the API."));
}

function autocompleteMatch(input) {
    let result = [];

    if(input.length > 0){
      let reg = new RegExp(input.toLowerCase());

        for (let i = 0; i < datas.length && result.length < maxSuggestions; i++){
            if(datas[i].name.toLowerCase().match(reg))
                result.push(datas[i]);
        }
    }

    return result;
}
 
function showResults(val) {
  let res = document.getElementById("result");

  res.innerHTML = '';

  let list = '';
  let terms = autocompleteMatch(val);
  for (i = 0; i < terms.length; i++) {
    list += `<li style="cursor: pointer;" link="${terms[i].index}" onclick="showInformations(this)">${terms[i].name}</li>`;
  }
  
  if(list.length > 0){
    res.innerHTML = `<ul>${list}</ul>`;
    res.style['display'] = 'block';
  }
  else
    res.style['display'] = 'none';
}

function showInformations(element){
  let link = element.getAttribute("link");

  if(link != undefined){
    fetch(apiUrl + link).then(response => {
      response.json().then(jsonDatas => {
        document.getElementById("spell_infos").style['display'] = 'block';

        let classes = [];

        jsonDatas.classes.forEach(element => {
          classes.push(element.name);
        });

        document.getElementsByName("casting-time")[0].innerHTML = jsonDatas.casting_time;
        document.getElementsByName("range")[0].innerHTML = jsonDatas.range;
        document.getElementsByName("damage-type")[0].innerHTML = jsonDatas.damage != undefined ? jsonDatas.damage.damage_type.name : 'None';
        document.getElementsByName("components")[0].innerHTML = jsonDatas.components;
        document.getElementsByName("duration")[0].innerHTML = jsonDatas.duration;
        document.getElementsByName("classes")[0].innerHTML = classes.join(", ");
        document.getElementsByName("description")[0].innerHTML = jsonDatas.desc;
        document.getElementsByName("higher-level")[0].innerHTML = jsonDatas.higher_level.length > 0 ? jsonDatas.higher_level.join("<br>") : 'None';

        showResults("");
        document.getElementById("q").value = "";
      });
    }).catch(ex => console.log("Can not obtain an answer from the API."));
  }
}

window.addEventListener('load', loadAllSpells(), false);

function reset(){
    document.getElementById("spell_infos").style['display'] = 'none';


}