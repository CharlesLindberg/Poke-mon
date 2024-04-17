class Pokémon {
  constructor(name, image, types, weight, height, stats) {
    this.name = name;
    this.image = image;
    this.types = types;
    this.weight = weight;
    this.height = height;
    this.stats = stats;
  }
  comparePokémons() {}
}

let dropDown1 = document.querySelector(".selectPokemon1");
let dropDown2 = document.querySelector(".selectPokemon2");
let select1 = document.querySelector(".selectBtn1");
let select2 = document.querySelector(".selectBtn2");
let pokemon1Container = document.querySelector(".pokemon1Container");
let pokemon2Container = document.querySelector(".pokemon2Container");
let pokemonCount1 = 1;
let pokemonCount2 = 1;
let selectedPokemon1 = null;
let selectedPokemon2 = null;
let selectedPokemons = [];
let progressElement = document.querySelectorAll("progress");
let currentPokemons;
let statCountP1 = 0;
let statCountP2 = 0;
let battleField = document.querySelector(".battleField");

// Hämta Pokémon namn till dropdown menyerna
async function fetchPokemons(url, dropdown, count) {
  try {
    let response = await fetch(url);
    let data = await response.json();

    data.results.forEach((pokemon) => {
      let option = document.createElement("option");
      option.value = count;
      option.textContent =
        pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1); // Första bokstaven till stor bokstav
      dropdown.append(option);
      count++;
    });
  } catch (error) {
    console.error("Error fetching data", error);
  }
}

fetchPokemons(
  "https://pokeapi.co/api/v2/pokemon?limit=151",
  dropDown1,
  pokemonCount1
);
fetchPokemons(
  "https://pokeapi.co/api/v2/pokemon?limit=151",
  dropDown2,
  pokemonCount2
);

// Fetch nr2 för att hämta info om Pokémon  |||||||||||||
async function fetchPokemonDetails(pokemonUrl) {
  try {
    let response = await fetch(pokemonUrl);
    let data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching Pokémon data", error);
  }
}

// Hantera val från dropdown menyn |||||||||||||||||||||||
async function handlePokemonSelection(event) {
  let selectedPokemonUrl = event.target.value;
  let pokemonData = await fetchPokemonDetails(selectedPokemonUrl);
  let pokemonInstance = createPokemonInstance(pokemonData);

  displayPokemonDetails(pokemonInstance);
}

// Skapa ny instans av Pokémon-klassen |||||||||||||||||||
function createPokemonInstance(data) {
  // let pokemonInstance = new Pokémon(
  return new Pokémon(
    data.name,
    // data.sprites.front_default,
    // data.sprites.other.dream_world.front_default,
    data.sprites.other.home.front_shiny,
    // data.sprites.other.showdown.front_default,
    // data.sprites.other.showdown.front_shiny,
    data.types.map((type) => type.type.name),
    data.weight,
    data.height,
    {
      HP: data.stats[0].base_stat,
      Attack: data.stats[1].base_stat,
      Defense: data.stats[2].base_stat,
      SpecialAttack: data.stats[3].base_stat,
      SpecialDefense: data.stats[4].base_stat,
      Speed: data.stats[5].base_stat,
    }
  );
}

// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||

select1.addEventListener("click", async () => {
  let pokemonIndex = dropDown1.selectedIndex;
  let pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonIndex}`;
  let pokemonData = await fetchPokemonDetails(pokemonUrl);
  //   let pokemonInstance = createPokemonInstance(pokemonData);
  selectedPokemon1 = createPokemonInstance(pokemonData);
  selectedPokemons[0] = createPokemonInstance(pokemonData);

  displayPokemonDetails(selectedPokemon1);

  // if (selectedPokemons[0] && selectedPokemons[1]) {
  //   comparePokemons(selectedPokemons[0], selectedPokemons[1]);
  // }
});

// Display pokemon details

function displayPokemonDetails(pokemonInstance) {
  pokemon1Container.innerHTML = "";

  let name = document.createElement("h2");
  name.textContent = pokemonInstance.name;
  pokemon1Container.appendChild(name);

  // Lägg till bild
  let imageElement = document.createElement("img");
  imageElement.src = pokemonInstance.image;
  imageElement.alt = pokemonInstance.name;
  pokemon1Container.append(imageElement);

  // Lägg till type
  let typePara = document.createElement("p");
  typePara.textContent = "Types: " + pokemonInstance.types.join(", ");
  pokemon1Container.append(typePara);
  console.log(pokemonInstance.types);

  // Vikt
  let weightPara = document.createElement("p");
  weightPara.textContent = "Weight: " + pokemonInstance.weight + " hg";
  weightPara.classList.add("weight");
  pokemon1Container.append(weightPara);

  // Längd
  let heightPara = document.createElement("p");
  heightPara.textContent = "Height: " + pokemonInstance.height + " dm";
  heightPara.classList.add("height");
  pokemon1Container.append(heightPara);

  //Lägg till Stats & skapa progressbar-element SKAPA PROGRESSBAR ELEMENT FÖR FÖRSTA POKEMONEN
  let statsList = document.createElement("ul");
  for (let stat in pokemonInstance.stats) {
    let statItem = document.createElement("li");
    let progress = document.createElement("progress");
    progress.value = pokemonInstance.stats[stat];
    progress.max = 160;
    // progress.classList.add("progress");
    progress.classList.add(`${stat}1`);
    statItem.textContent = `${stat}: ${pokemonInstance.stats[stat]}`;
    statItem.append(progress);
    statsList.append(statItem);
  }

  pokemon1Container.append(statsList);
}

// Få ut info om Pokemon no 2
select2.addEventListener("click", async () => {
  let pokemonIndex = dropDown2.selectedIndex;
  let pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonIndex}`;
  let pokemonData = await fetchPokemonDetails(pokemonUrl);
  //   let pokemonInstance = createPokemonInstance(pokemonData);
  selectedPokemon2 = createPokemonInstance(pokemonData);
  selectedPokemons[1] = createPokemonInstance(pokemonData);

  displayPokemonDetailsForSecondContainer(selectedPokemon2);

  if (selectedPokemons[0] && selectedPokemons[1]) {
    comparePokemons(selectedPokemons[0], selectedPokemons[1]);
  }
});

function displayPokemonDetailsForSecondContainer(pokemonInstance) {
  pokemon2Container.innerHTML = "";

  let name = document.createElement("h2");
  name.textContent = pokemonInstance.name;
  pokemon2Container.append(name);

  let imageElement = document.createElement("img");
  imageElement.src = pokemonInstance.image;
  imageElement.alt = pokemonInstance.name;
  pokemon2Container.append(imageElement);

  let typePara = document.createElement("p");
  typePara.textContent = "Types: " + pokemonInstance.types.join(", ");
  pokemon2Container.append(typePara);

  let weightPara = document.createElement("p");
  weightPara.textContent = "Weight " + pokemonInstance.weight + " hg";
  weightPara.classList.add("weight");
  pokemon2Container.append(weightPara);

  let heightPara = document.createElement("p");
  heightPara.textContent = "Height " + pokemonInstance.height + " dm";
  heightPara.classList.add("height");
  pokemon2Container.append(heightPara);

  // SKAPA PROGRESSBAR ELEMENT FÖR POKEMON2-----
  let statsList = document.createElement("ul");
  for (let stat in pokemonInstance.stats) {
    let statItem = document.createElement("li");
    let progress = document.createElement("progress");
    progress.value = pokemonInstance.stats[stat];
    progress.max = 160;
    // progress.classList.add("progress");
    progress.classList.add(`${stat}2`);
    statItem.textContent = `${stat}: ${pokemonInstance.stats[stat]}`;
    statItem.append(progress);
    statsList.append(statItem);
  }

  pokemon2Container.append(statsList);
}

// ONÖDIG FUNKTION.....
// function createProgressBarElements(stats) {
//   let progressBars = {};

//   for (let stat in stats) {
//     let progress = document.createElement("progress");
//     progress.value = stats[stat];
//     progress.max = 255;

//     let progressBarClassName = `${stat.toUpperCase()}ProgressBar`;
//     progress.className = progressBarClassName;

//     progressBars[stat] = progress;
//   }
//   return progressBars;
// }

// Funktion för att jämföra Pokémon mot varandra
function comparePokemons(pokemon1, pokemon2) {
  console.log(pokemon1, pokemon2);

  let p1 = [];
  let p2 = [];

  p1.push(pokemon1.stats);
  p2.push(pokemon2.stats);

  let name1 = [];
  let name2 = [];

  name1.push(pokemon1.name);
  name2.push(pokemon2.name);

  if (pokemon1.weight > pokemon2.weight) {
    pokemon1Container.querySelector(".weight").classList.add("green");
    pokemon2Container.querySelector(".weight").classList.add("red");
  } else if (pokemon1.weight < pokemon2.weight) {
    pokemon1Container.querySelector(".weight").classList.add("red");
    pokemon2Container.querySelector(".weight").classList.add("green");
  } else {
    pokemon1Container.querySelector(".weight").classList.add("green");
    pokemon2Container.querySelector(".weight").classList.add("green");
  }

  if (pokemon1.height > pokemon2.height) {
    pokemon1Container.querySelector(".height").classList.add("green");
    pokemon2Container.querySelector(".height").classList.add("red");
  } else if (pokemon1.height < pokemon2.height) {
    pokemon1Container.querySelector(".height").classList.add("red");
    pokemon2Container.querySelector(".height").classList.add("green");
  } else {
    pokemon1Container.querySelector(".height").classList.add("green");
    pokemon2Container.querySelector(".height").classList.add("green");
  }

  // for (let stat in pokemon1.stats) {
  //   let statValue1 = pokemon1.stats[stat];
  //   let statValue2 = pokemon2.stats[stat];

  //   console.log("Stat: ", stat);
  //   console.log("statValue1: ", statValue1);
  //   console.log("statValue2: ", statValue2);

  //   let progressBar1 = pokemon1Container.querySelectorAll(".progress");
  //   let progressBar2 = pokemon2Container.querySelectorAll(".progress");

  //   let stat1GreaterThanStat2 = statValue1 > statValue2;
  //   let stat1LessThanStat2 = statValue1 < statValue2;

  //   for (let i = 0; i < progressBar1.length; i++) {
  //     let progressBarStat1 = progressBar1[i];
  //     let progressBarStat2 = progressBar2[i];

  //     if (stat1GreaterThanStat2) {
  //       progressBarStat1.classList.add("greenProgress");
  //       progressBarStat2.classList.add("redProgress");
  //     } else if (stat1LessThanStat2) {
  //       progressBarStat1.classList.add("redProgress");
  //       progressBarStat2.classList.add("greenProgress");
  //     } else {
  //       progressBarStat1.classList.add("greenProgress");
  //       progressBarStat2.classList.add("greenProgress");
  //     }
  //     // console.log("progressBarStat1: ", progressBarStat1);
  //   }

  // }
  comparePokemonList(p1, p2);
  comparePokemonList(name1, name2);
}

// console.log(selectedPokemons);

function comparePokemonList(p1, p2) {
  console.log("p1", p1[0]);
  console.log("p2", p2[0]);

  let stats1 = p1[0];
  let stats2 = p2[0];

  console.log("P1 HP: ", p1[0].HP);
  console.log("P1 Attack: ", p1[0].Attack);

  console.log("P1: ", p1);
  console.log("P2: ", p2);

  // let progressBar1 = pokemon1Container.querySelectorAll(".progress");
  // let progressBar2 = pokemon2Container.querySelectorAll(".progress");

  let p1HP = document.querySelector(".HP1");
  let p2HP = document.querySelector(".HP2");

  let p1Attack = document.querySelector(".Attack1");
  let p2Attack = document.querySelector(".Attack2");

  let p1Defense = document.querySelector(".Defense1");
  let p2Defense = document.querySelector(".Defense2");

  if (p1[0].HP > p2[0].HP) {
    p1HP.classList.add("greenProgress");
    p2HP.classList.add("redProgress");
    statCountP1++;
  } else if (p1[0].HP < p2[0].HP) {
    p1HP.classList.add("redProgress");
    p2HP.classList.add("greenProgress");
    statCountP2++;
  } else {
    p1HP.classList.add("orangeProgress");
    p2HP.classList.add("orangeProgress");
  }

  if (p1[0].Attack > p2[0].Attack) {
    p1Attack.classList.add("greenProgress");
    p2Attack.classList.add("redProgress");
    statCountP1++;
  } else if (p1[0].Attack < p2[0].Attack) {
    p1Attack.classList.add("redProgress");
    p2Attack.classList.add("greenProgress");
    statCountP2++;
  } else {
    p1Attack.classList.add("orangeProgress");
    p2Attack.classList.add("orangeProgress");
  }

  if (p1[0].Defense > p2[0].Defense) {
    p1Defense.classList.add("greenProgress");
    p2Defense.classList.add("redProgress");
    statCountP1++;
  } else if (p1[0].Defense < p2[0].Defense) {
    p1Defense.classList.add("redProgress");
    p2Defense.classList.add("greenProgress");
    statCountP2++;
  } else {
    p1Defense.classList.add("orangeProgress");
    p2Defense.classList.add("orangeProgress");
  }

  let p1SpecialAttack = document.querySelector(".SpecialAttack1");
  let p2SpecialAttack = document.querySelector(".SpecialAttack2");

  if (p1[0].SpecialAttack > p2[0].SpecialAttack) {
    p1SpecialAttack.classList.add("greenProgress");
    p2SpecialAttack.classList.add("redProgress");
    statCountP1++;
  } else if (p1[0].SpecialAttack < p2[0].SpecialAttack) {
    p1SpecialAttack.classList.add("redProgress");
    p2SpecialAttack.classList.add("greenProgress");
    statCountP2++;
  } else {
    p1SpecialAttack.classList.add("orangeProgress");
    p2SpecialAttack.classList.add("orangeProgress");
  }

  let p1SpecialDefense = document.querySelector(".SpecialDefense1");
  let p2SpecialDefense = document.querySelector(".SpecialDefense2");

  if (p1[0].SpecialDefense > p2[0].SpecialDefense) {
    p1SpecialDefense.classList.add("greenProgress");
    p2SpecialDefense.classList.add("redProgress");
    statCountP1++;
  } else if (p1[0].SpecialDefense < p2[0].SpecialDefense) {
    p1SpecialDefense.classList.add("redProgress");
    p2SpecialDefense.classList.add("greenProgress");
    statCountP2++;
  } else {
    p1SpecialDefense.classList.add("orangeProgress");
    p2SpecialDefense.classList.add("orangeProgress");
  }

  let p1Speed = document.querySelector(".Speed1");
  let p2Speed = document.querySelector(".Speed2");

  if (p1[0].Speed > p2[0].Speed) {
    p1Speed.classList.add("greenProgress");
    p2Speed.classList.add("redProgress");
    statCountP1++;
  } else if (p1[0].Speed < p2[0].Speed) {
    p1Speed.classList.add("redProgress");
    p2Speed.classList.add("greenProgress");
    statCountP2++;
  } else {
    p1Speed.classList.add("orangeProgress");
    p2Speed.classList.add("orangeProgress");
  }

  if (statCountP1 > statCountP2) {
    let h3 = document.createElement("h3");
    h3.textContent = "Pokemon1 has better stats than pokemon2";
    battleField.append(h3);
  } else if (statCountP1 < statCountP2) {
    let h3 = document.createElement("h3");
    h3.textContent = "Pokemon2 has better stats than pokemon1";
    battleField.append(h3);
  } else {
    let h3 = document.createElement("h3");
    h3.textContent = "These Pokémons are evenly matched";
    battleField.append(h3);
  }

  console.log("P1 stat count: ", statCountP1);
  console.log("P2 stat count: ", statCountP2);

  for (let stat in stats1) {
    if (stats1[stat] > stats2[stat]) {
      console.log(
        `${p1.name} has higher ${stat} (${stats1[stat]} vs ${stats2[stat]})`
      );
    } else if (stats1[stat] < stats2[stat]) {
      console.log(
        `${p2.name} has higher ${stat} (${stats2[stat]} vs ${stats1[stat]})`
      );
    } else {
      console.log(`Both have the same ${stat} (${stats1[stat]})`);
    }
  }

  // for (let stat in stats1) {
  //   if (stats1[stat] > stats2[stat]) {
  //     result += `${pokemon1.name} has higher ${stat} (${stats1[stat]} vs ${stats2[stat]})<br>`;
  //   } else if (stats1[stat] < stats2[stat]) {
  //     result += `${pokemon2.name} has higher ${stat} (${stats2[stat]} vs ${stats1[stat]})<br>`;
  //   } else {
  //     result += `Both have the same ${stat} (${stats1[stat]})<br>`;
  //   }
  // }

  // Assuming you have a div with id 'result' in your HTML
  // document.querySelector(".result").innerHTML = result;

  fight(p1, p2);
}

function fight() {
  console.log(p1);
  console.log(p2);
  // let button = document.createElement("button");
  // button.innerText = "FIGHT";
  // battleField.append(button);
}
