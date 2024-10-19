document.addEventListener('DOMContentLoaded', () => {
    const prevButton = document.getElementById('previous');
    const nextButton = document.getElementById('next');
    const searchButton = document.getElementById('searchButton');

    let currentPage = 1;
    let affiliationsData = {};

    const normalizeName = (name) => {
        return name.trim().toLowerCase();
    };

    const loadAffiliations = async () => {
        try {
            const response = await fetch('affiliations.json');
            affiliationsData = await response.json();
    
            const normalizedAffiliations = {};
            Object.keys(affiliationsData).forEach(key => {
                const normalizedKey = normalizeName(key);
                normalizedAffiliations[normalizedKey] = affiliationsData[key];
            });
            affiliationsData = normalizedAffiliations;

            console.log("Affiliations Data Loaded:", affiliationsData);
        } catch (error) {
            console.error('Error loading affiliations:', error);
        }
    };

    const loadFirstCharacter = async () => {
        try {
            const response = await fetch(`https://swapi.dev/api/people/1/`); 
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const character = await response.json();
            displayCharacter(character);  
        } catch (error) {
            console.error('Error fetching character:', error);
            alert('Error fetching character: ' + error.message);
        }
    };

    async function searchCharacter() {
        const searchInput = document.getElementById('searchInput').value.trim().toLowerCase();
        const foundCharacterAffiliation = affiliationsData[searchInput];

        if (foundCharacterAffiliation) {
            try {
                const response = await fetch(`https://swapi.dev/api/people/?search=${searchInput}`);
                const data = await response.json();
                
                if (data.results.length > 0) {
                    const character = data.results[0];
                    displayCharacter(character);  
                    document.getElementById('errorScreen').style.display = 'none';  
                } else {
                    document.getElementById('errorScreen').style.display = 'block';
                }
            } catch (error) {
                console.error('Error fetching character from SWAPI:', error);
            }
        } else {
            document.getElementById('errorScreen').style.display = 'block';
        }
    }

    const getCharacter = async (id = 1) => {
        try {
            const response = await fetch(`https://swapi.dev/api/people/${id}/`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const character = await response.json();
            displayCharacter(character);
        } catch (error) {
            console.error('Error fetching character:', error);
            alert('Error fetching character: ' + error.message);
        }
    };

const displayCharacter = async (character) => {
    const container = document.getElementById('character-container');
    container.innerHTML = ''; 

    const homeworldResponse = await fetch(character.homeworld);
    const homeworld = await homeworldResponse.json();

    const speciesResponse = character.species.length ? await fetch(character.species[0]) : null;
    const species = speciesResponse ? await speciesResponse.json() : { name: 'Unknown' };

    const normalizedCharacterName = normalizeName(character.name);

    const affiliations = affiliationsData[normalizedCharacterName] || ['N/A'];

    const characterCard = `
        <div class="character-card">
            <h2>${character.name}</h2>
            <img src="https://starwars-visualguide.com/assets/img/characters/${character.url.match(/\d+/)[0]}.jpg" alt="${character.name}" class="character-img">
            <p><strong>ID:</strong> ${character.url.match(/\d+/)[0]}</p>
            <p><strong>Height:</strong> ${character.height} cm</p>
            <p><strong>Mass:</strong> ${character.mass} kg</p>
            <p><strong>Gender:</strong> ${character.gender}</p>
            <p><strong>Species:</strong> ${species.name}</p>
            <p><strong>Homeworld:</strong> ${homeworld.name}</p>
            <p><strong>Affiliations:</strong> ${affiliations.join(', ')}</p>
            <a href="https://starwars.fandom.com/wiki/${character.name.replace(/ /g, '_')}" target="_blank">Wiki Page</a>
        </div>
    `;

    container.innerHTML += characterCard;
};


    nextButton.addEventListener('click', () => {
        currentPage++;
        if (currentPage > 82) {
            currentPage = 1; 
        }
        getCharacter(currentPage);
    });

    prevButton.addEventListener('click', () => {
        currentPage--;
        if (currentPage < 1) {
            currentPage = 82;
        }
        getCharacter(currentPage);
    });

    loadAffiliations().then(() => {
        loadFirstCharacter();  
        searchButton.addEventListener('click', searchCharacter);
    });
});