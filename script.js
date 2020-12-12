const form = document.getElementById('form');
const search = document.getElementById('search');
const result = document.getElementById('result');
const more = document.getElementById('more');

const apiURL = 'https://api.lyrics.ovh';

//Search by song or artist
async function searchSongs(term){
    // fetch(`${apiURL}/suggest/${term}`).then(res => res.json()).then(data => console.log(data))

    const res = await fetch(`${apiURL}/suggest/${term}`);
    const data = await res.json();

    // console.log(data)
    showData(data)
}

//show song and artist in DOM
function showData(data){
    let output = '';
    // data.data.forEach(song => {
    //     output += `
    //     <li>
    //     <span><strong>${song.artist.name}</strong> - ${song.title}</span>
    //     <button class="btn" data-artist="${song.artist.name}" data-songtitle="${song.title}">Get Lyrics</button>
    //     </li>
    //     `;
    // });

    // result.innerHTML = `
    // <ul class="songs">
    //     ${output}
    // </ul>
    // `;

    result.innerHTML = `
    <ul class="songs">
        ${data.data.map(song => `
        <li>
        <span><strong>${song.artist.name}</strong> - ${song.title}</span>
        <button class="btn" data-artist="${song.artist.name}" data-songtitle="${song.title}">Get Lyrics</button>
        </li>   
        `).join('')}
    </ul>
    `;

    if(data.prev || data.next){
        more.innerHTML = `
        ${data.prev ? `<button class="btn" onclick="getMoreSongs('${data.prev}')">Prev</button>` : ''}
        ${data.next ? `<button class="btn" onclick="getMoreSongs('${data.next}')">Next</button>` : ''}
        `;
    }else{
        more.innerHTML = '';
    }
}

//Get the next or prev batch of songs also for cors policy the link will be essential
async function getMoreSongs(url) {
    const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
    const data = await res.json();
  
    showData(data);
  }

  //Get song Lyrics
  async function getLyrics(artist,songTitle){
    const res = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
    const data = await res.json();
  
    // console.log(data);
    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g,'<br>');

    if(lyrics === ''){
        result.innerHTML = `<h2><stong>${artist}'s</stong> ${songTitle} Lyrics is NOT available</h2>`;
        more.innerHTML = '';
    }else{
        result.innerHTML = `<h2><strong>${artist}</strong> - ${songTitle}</h2>
        <span>${lyrics}</span>
        `;

        more.innerHTML = '';
    }
  }

//Event Listeners
form.addEventListener('submit',(e) =>{
    e.preventDefault();

    const searchTerm = search.value.trim();
    if(!searchTerm){
        alert('Please Enter a Search Term!')
    }else{
        searchSongs(searchTerm);
    }
})

//since all the get lyrics buttons are wrtenn for the DOM already we need to grab the perant element of the button  / EVENT DELEGATION

//Click get lyrics button
result.addEventListener('click',e =>{
    const clickedEl = e.target;

    //for the tagName property you need to use uppercase
    if(clickedEl.tagName === 'BUTTON'){
        const artist = clickedEl.getAttribute('data-artist');
        const songTitle = clickedEl.getAttribute('data-songtitle');

        getLyrics(artist,songTitle)
    }
})