
const API_KEY = 'api_key=97b143511210cce0a5eb60a8b8d20279';

const BASE_URL = 'https://api.themoviedb.org/3';

const LANGUAGUE_URL = '&language=es-AR';

const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&'+ API_KEY + LANGUAGUE_URL;

const IMG_URL = 'https://image.tmdb.org/t/p/w500';

const SEARCH_URL = BASE_URL + '/search/movie?' + API_KEY + LANGUAGUE_URL; 

const UPDATE_URL = BASE_URL + '/discover/movie?primary_release_year=2022&sort_by=popularity.desc&' + API_KEY + LANGUAGUE_URL;

const BEST_URL = BASE_URL + '/discover/movie?sort_by=vote_average.desc&' + API_KEY + LANGUAGUE_URL;

getMovies(API_URL);

function getMovies(url){
    document.getElementById('output').innerHTML='';
    fetch(url)
    .then(res => res.json())
    .then(data => {
        console.log(data)
        
        showMovies(data.results)
        showModal(data.results)
    })
}

const showMovies = (data) => {
    let acu = '';
    data.forEach(movie => {
       acu += 
       `
        <div class="ui card">
            <div class="image">
                <img src="${movie.backdrop_path ? IMG_URL+movie.backdrop_path : IMG_URL+movie.poster_path}" alt="${movie.title}">
            </div>
            <div class="content center aligned card-body">
                <p class="header">${movie.title}</p>
                <div class="meta">
                    <span class="date">${movie.release_date}</span>
                </div>
                <div class="ui horizontal label ${getColor(movie.vote_average)}">
                    <i class="star icon"></i> ${movie.vote_average}
                </div>
            </div>
            <div class="extra content center aligned">
                <button class="ui button" id="${movie.id}">Ver más</button>
            </div>
        </div>

        <div class="ui modal" id="modal${movie.id}">
        <i class="close icon"></i>
        <div class="image content">
            <div class="ui massive image">
                <img src="${IMG_URL+movie.poster_path}" alt="${movie.title}">
            </div>
            <div class="description">
                <div class="title-modal">
                    <h1 class="header olive">${movie.title}</h1>
                    <div>${movie.release_date}</div>
                </div>
                <div class="ui header">Resumen:</div>
                <p class="description-text">${movie.overview}</p>
                <p class="ui header description-text">Géneros:</p>
                <div class="list-gender">
                    <div class="ui left pointing teal basic label">${movie.genre_ids[0]}</div>
                    <div class="ui left pointing teal basic label">${movie.genre_ids[1]}</div>
                    <div class="ui left pointing teal basic label">Comedia</div>
                    <div class="ui left pointing teal basic label">Drama</div>
                </div>
            </div>
            </div>
            <div class="actions">
                <div class="ui violet deny button">
                    Cerrar
                </div>
            </div>
        </div>

       `;

    });
    document.getElementById('output').insertAdjacentHTML("beforeend", acu);
}

const showModal = (data) => {
    data.forEach(movie => {
        
        document.getElementById(movie.id).addEventListener('click', ()=>{
            $(`#modal${movie.id}`).modal('show')
        })
    });
}

const getColor = (x) => {
    if(x >= 8){
        return 'green';
    }else if(x >= 5){
        return 'yellow'
    }else{
        return 'red';
    }
}


let inputSearch = document.getElementById('inputSearch');
console.log(inputSearch)

let search = document.getElementById('button-search');
console.log(search)

search.addEventListener('click', (e) => {
    e.preventDefault();
    if(inputSearch.value){
        getMovies(SEARCH_URL+'&query='+inputSearch.value)
    }
    console.log(inputSearch.value)
})






