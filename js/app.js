const wrapper = document.querySelector(".wrapper"),
      wordInput = wrapper.querySelector(".form input"),
      findBtn = wrapper.querySelector(".form button"),
      loadingSpinner = document.querySelector(".loading-spinner"),
      synonymList = document.getElementById("synonym-list"),
      antonymList = document.getElementById("antonym-list"),
      synonymTitle = document.querySelector(".synonym-title"),
      antonymTitle = document.querySelector(".antonym-title");

findBtn.addEventListener("click", async () => {
    let word = wordInput.value.trim();
    if (!word) {
        alert("Please enter a valid word");
        return;
    }

    findBtn.innerText = "Finding...";
    findBtn.disabled = true;
    loadingSpinner.style.display = "block";

    try {
        const apiKey = ''; // Replace with your actual API key from https://api-ninjas.com
        const response = await fetch(`https://api.api-ninjas.com/v1/thesaurus?word=${word}`, {
            headers: {
                'X-Api-Key': apiKey
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.synonyms && data.antonyms) {
            if (data.synonyms.length > 0 || data.antonyms.length > 0) {
                displayResults(data.synonyms, data.antonyms);
            } else {
                displayNoResults();
            }
        } else {
            throw new Error("Invalid API response structure");
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        alert("API KEY NOT SET! Failed to fetch synonyms and antonyms. Please try again.");
        displayNoResults();
    } finally {
        findBtn.innerText = "Find";
        findBtn.disabled = false;
        loadingSpinner.style.display = "none";
    }
});

function displayResults(synonyms, antonyms) {
    if (synonyms.length > 0) {
        synonymTitle.style.display = 'block';
        synonymList.innerHTML = synonyms.map(s => `<li>${s}</li>`).join('');
    } else {
        synonymTitle.style.display = 'none';
        synonymList.innerHTML = '';
    }
    
    if (antonyms.length > 0) {
        antonymTitle.style.display = 'block';
        antonymList.innerHTML = antonyms.map(a => `<li>${a}</li>`).join('');
    } else {
        antonymTitle.style.display = 'none';
        antonymList.innerHTML = '';
    }
}

function displayNoResults() {
    synonymTitle.style.display = 'none';
    antonymTitle.style.display = 'none';
    synonymList.innerHTML = '<li>No synonyms found</li>';
    antonymList.innerHTML = '<li>No antonyms found</li>';
}
