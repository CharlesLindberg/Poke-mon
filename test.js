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
let currentPokemons = [];

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
    data.sprites.other.dream_world.front_default,
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
  // pokemonInstance.progressBars = createProgressBarElements(
  //   pokemonInstance.stats
  // );

  // return pokemonInstance;
}

// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||

select1.addEventListener("click", async () => {
  if (currentPokemons.length >= 2) {
    console.log("Du kan bara välja två Pokemons åt gången.");
    return; //avbryter funktionen
  }
  let pokemonIndex = dropDown1.selectedIndex;
  let pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonIndex}`;
  let pokemonData = await fetchPokemonDetails(pokemonUrl);
  let selectedPokemon = createPokemonInstance(pokemonData);

  currentPokemons.push(selectedPokemon);
  displayPokemonDetails(selectedPokemon);

  if (currentPokemons.length === 2) {
    comparePokemons(currentPokemons[0], currentPokemons[1]);
  }

  //   let pokemonInstance = createPokemonInstance(pokemonData);
  //   selectedPokemon1 = createPokemonInstance(pokemonData);
  //   selectedPokemons[0] = createPokemonInstance(pokemonData);

  //   displayPokemonDetails(selectedPokemon1);

  //   if (selectedPokemons[0] && selectedPokemons[1]) {
  //     comparePokemons(selectedPokemons[0], selectedPokemons[1]);
  //   }
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

  //Lägg till Stats & skapa progressbar-element
  let statsList = document.createElement("ul");
  for (let stat in pokemonInstance.stats) {
    let statItem = document.createElement("li");
    let progress = document.createElement("progress");
    progress.value = pokemonInstance.stats[stat];
    progress.max = 255;
    progress.classList.add("progress");
    statItem.textContent = `${stat}: ${pokemonInstance.stats[stat]}`;
    statItem.append(progress);
    statsList.append(statItem);
  }

  // GAMMAL EJ FUNGERANDE KOD. RADERA
  // let statsList = document.createElement("ul");
  // for (let stat in pokemonInstance.stats) {
  //   let statItem = document.createElement("li");
  //   let progress = pokemonInstance.progressBars[stat.toUpperCase()];
  //   statItem.textContent = `${stat}: ${pokemonInstance.stats[stat]}`;
  //   statItem.append(progress);
  //   statsList.append(statItem);
  // }
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

  let statsList = document.createElement("ul");
  for (let stat in pokemonInstance.stats) {
    let statItem = document.createElement("li");
    let progress = document.createElement("progress");
    progress.value = pokemonInstance.stats[stat];
    progress.max = 255;
    progress.classList.add("progress");
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

  // GAMMAL ONÖDIG KOD
  // let progressBarStats1 = createProgressBarElements(pokemon1.stats);
  // let createProgressBarStats2 = createProgressBarElements(pokemon2.stats);

  // let progressBars1 = pokemon1Container.querySelectorAll("progress");
  // let progressBars2 = pokemon2Container.querySelectorAll("progress");

  for (let stat in pokemon1.stats) {
    let statValue1 = pokemon1.stats[stat];
    let statValue2 = pokemon2.stats[stat];

    console.log("statValue1: ", statValue1);
    console.log("statValue2: ", statValue2);

    let progressBar1 = pokemon1Container.querySelectorAll(".progress");
    let progressBar2 = pokemon2Container.querySelectorAll(".progress");

    let stat1GreaterThanStat2 = statValue1 > statValue2;
    let stat1LessThanStat2 = statValue1 < statValue2;

    // Loopa genom progress-elementen och rensa befintliga klasser
    for (let progressBarStat1 of progressBar1) {
      progressBarStat1.classList.remove("redProgress", "greenProgress");
    }
    for (let progressBarStat2 of progressBar2) {
      progressBarStat2.classList.remove("redProgress", "greenProgress");
    }

    for (let i = 0; i < progressBar1.length; i++) {
      let progressBarStat1 = progressBar1[i];
      let progressBarStat2 = progressBar2[i];

      if (stat1GreaterThanStat2) {
        progressBarStat1.classList.add("greenProgress");
        progressBarStat2.classList.add("redProgress");
      } else if (stat1LessThanStat2) {
        progressBarStat1.classList.add("redProgress");
        progressBarStat2.classList.add("greenProgress");
      } else {
        // progressBarStat1.classList.add("green");
        // progressBarStat2.classList.add("green");
      }
      console.log("progressBarStat1: ", progressBarStat1);
    }

    // for (let i = 0; i < progressBar1.length; i++) {
    //   let innerStatValue1 = pokemon1.stats[i];
    //   let innerStatValue2 = pokemon2.stats[i];
    //   let progressBarStat1 = progressBar1[i];
    //   let progressBarStat2 = progressBar2[i];

    //   if (innerStatValue1 > innerStatValue2) {
    //     progressBarStat1.classList.add("green");
    //     progressBarStat2.classList.add("red");
    //   } else if (innerStatValue1 < innerStatValue2) {
    //     progressBarStat1.classList.add("red");
    //     progressBarStat2.classList.add("green");
    //   } else if (innerStatValue1 === innerStatValue2) {
    //     progressBarStat1.classList.add("green");
    //     progressBarStat2.classList.add("green");
    //   }
    // }

    // let progressBarPokemon1 = progressBar1[stat];
    // let progressBarPokemon2 = progressBar2[stat];

    // let progressBar1 = pokemon1Container.querySelector(
    //   `.${stat.toLowerCase()}ProgressBar`
    // );
    // let progressBar2 = pokemon2Container.querySelector(
    //   `.${stat.toLowerCase()}ProgressBar`
    // );

    // let progressBar1 = pokemon1.progressBars[stat.toUpperCase()];
    // let progressBar2 = pokemon2.progressBars[stat.toUpperCase()];

    // let progressBar1 = pokemon1Container.querySelectorAll("progress");
    // let progressBar2 = pokemon2Container.querySelectorAll("progress");

    // if (statValue1 > statValue2) {
    //   statValue1.classList.add("green");
    //   statValue2.classList.add("red");
    // } else if (statValue1 < statValue2) {
    //   statValue1.classList.add("red");
    //   statValue2.classList.add("green");
    // } else {
    //   statValue1.classList.add("green");
    //   statValue2.classList.add("green");
    // }

    // if (statValue1 > statValue2) {
    //   progressBar1.classList.add("green");
    //   progressBar2.classList.add("red");
    // } else if (statValue1 < statValue2) {
    //   progressBar1.classList.add("red");
    //   progressBar2.classList.add("green");
    // } else {
    //   progressBar1.classList.add("green");
    //   progressBar2.classList.add("green");
    // }
  }
}

// Brandon tillägg
// compare.addEventListener("click", () => {
//   comparePokemons(selectedPokemon1, selectedPokemon2);
// });

console.log(selectedPokemons);
// console.log("Progress bar 1: ", progressBar1);
// console.log("Progress bar 2: ", progressBar2);
