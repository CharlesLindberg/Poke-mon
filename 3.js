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
let currentPokemon1 = [];
let currentPokemon2 = [];

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

// Fetch 2 - Hantera val från dropdown menyn ||||||||||
async function handlePokemonSelection(event) {
  let selectedPokemonUrl = event.target.value;
  let pokemonData = await fetchPokemonDetails(selectedPokemonUrl);
  let pokemonInstance = createPokemonInstance(pokemonData);

  displayPokemonDetails(pokemonInstance);
}

// Skapa ny instans av Pokémon-klassen |||||||||||||||||||
function createPokemonInstance(data) {
  return new Pokémon(
    data.name,
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
}

select1.addEventListener("click", async () => {
  currentPokemon1 = [];
  let pokemonIndex = dropDown1.selectedIndex;
  let pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonIndex}`;
  let pokemonData = await fetchPokemonDetails(pokemonUrl);
  let selectedPokemon1 = createPokemonInstance(pokemonData);

  currentPokemon1.push(selectedPokemon1);

  displayPokemonDetails(selectedPokemon1);

  // Testar att ta bort denna if-sats och se om det fungerar bättre
  //   if (currentPokemon1[0] && currentPokemon2[0]) {
  //     comparePokemons(currentPokemon1[0], currentPokemon2[0]);
  //   }

  //   if (currentPokemons.length === 2) {
  //     comparePokemons(currentPokemons[0], currentPokemons[1]);
  //   }
});

// Funktion för att visa pokomon1 i DOM:en
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
  //   console.log(pokemonInstance.types);

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

  pokemon1Container.append(statsList);
}

// Få ut info om Pokemon no 2
select2.addEventListener("click", async () => {
  currentPokemon2 = [];

  let pokemonIndex = dropDown2.selectedIndex;
  let pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonIndex}`;
  let pokemonData = await fetchPokemonDetails(pokemonUrl);
  let selectedPokemon2 = createPokemonInstance(pokemonData);

  currentPokemon2.push(selectedPokemon2);

  displayPokemonDetailsForSecondContainer(selectedPokemon2);

  if (currentPokemon1 && currentPokemon2) {
    comparePokemons(currentPokemon1, currentPokemon2);
  }
});

// Funktion för att visa ut det andra pokemonobjektet i DOM:en
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

  console.log("currentPokemon1: ", currentPokemon1);
  console.log("currentPokemon2: ", currentPokemon2);
}

// Funktion för att jämföra Pokémon mot varandra
function comparePokemons(pokemon1, pokemon2) {
  console.log(pokemon1, pokemon2);

  // Jämför först p-taggarna weight och height
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

  pokemon1.forEach((pokemon) => {
    console.log(pokemon.stats);
  });

  pokemon2.forEach((pokemon) => {
    console.log(pokemon.stats);
  });
  // Loopa igenom pokemon1 (alltså selectedPokemon1). Det är hela pokemonobjektet. stats är ett obejkt i sig med HP, attack Speed osv.
  for (let stat in pokemon1.stats) {
    let statValue1 = pokemon1.stats[stat];
    let statValue2 = pokemon2.stats[stat];

    console.log("statValue1: ", statValue1);
    console.log("statValue2: ", statValue2);

    let progressBar1 = pokemon1Container.querySelectorAll(".progress");
    let progressBar2 = pokemon2Container.querySelectorAll(".progress");

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

      if (statValue1 > statValue2) {
        progressBarStat1.classList.add("greenProgress");
        progressBarStat2.classList.add("redProgress");
      } else if (statValue1 < statValue2) {
        progressBarStat1.classList.add("redProgress");
        progressBarStat2.classList.add("greenProgress");
      } else {
        progressBarStat1.classList.add("green");
        progressBarStat2.classList.add("green");
      }
      console.log("progressBarStat1: ", progressBarStat1);
    }
  }
}
