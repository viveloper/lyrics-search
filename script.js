const form = document.getElementById('form');
const search = document.getElementById('search');
const result = document.getElementById('result');
const more = document.getElementById('more');

const apiURL = 'https://api.lyrics.ovh';

// Event listeners
form.addEventListener('submit', e => {
  e.preventDefault();
  const searchTerm = search.value.trim();
  if (!searchTerm) {
    alert('Please type in a search term');
  } else {
    searchSongs(searchTerm);
  }
});

result.addEventListener('click', e => {
  const clickedEl = e.target;
  if (clickedEl.tagName.toUpperCase() === 'BUTTON') {
    const artist = clickedEl.dataset['artist'];
    const songTitle = clickedEl.dataset['songtitle'];
    getLyrics(artist, songTitle);
  }
});

// Search by song or artist
async function searchSongs(term) {
  const res = await fetch(`${apiURL}/suggest/${term}`);
  const data = await res.json();

  showData(data);
}

// Show song and artist in DOM
function showData(data) {
  result.innerHTML = `
    <ul class="songs">
      ${data.data.reduce((html, song) => {
        return (
          html +
          `
          <li>
            <span><strong>${song.artist.name}</strong> - ${song.title}</span>
            <button class="btn" data-artist="${song.artist.name}" data-songtitle="${song.title}">Get Lyrics</button>
          </li>
        `
        );
      }, '')}
    </ul>
  `;

  if (data.prev || data.next) {
    more.innerHTML = `
      ${
        data.prev
          ? `<button class="btn" onclick="getMoreSongs('${data.prev}')">Prev</button>`
          : ''
      }
      ${
        data.next
          ? `<button class="btn" onclick="getMoreSongs('${data.next}')">Next</button>`
          : ''
      }
    `;
  } else {
    more.innerHTML = '';
  }
}

async function getMoreSongs(url) {
  const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
  const data = await res.json();
  showData(data);
  console.log(data);
}

async function getLyrics(artist, title) {
  const res = await fetch(`${apiURL}/v1/${artist}/${title}`);
  const data = await res.json();
  if (data.lyrics) {
    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');
    result.innerHTML = `
    <h2><strong>${artist}</strong> - ${title}</h2>
    <span>${lyrics}</span>
  `;
    more.innerHTML = '';
  } else {
    alert(data.error);
  }
}
