
const API_KEY = 'api_key=97b143511210cce0a5eb60a8b8d20279';

const BASE_URL = 'https://api.themoviedb.org/3';

const LANGUAGUE_URL = '&language=es-ES';

const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&'+ API_KEY + LANGUAGUE_URL;

const IMG_URL = 'https://image.tmdb.org/t/p/w500';

const SEARCH_URL = BASE_URL + '/search/movie?' + API_KEY + LANGUAGUE_URL; 

const UPDATE_URL = BASE_URL + '/discover/movie?primary_release_year=2022&sort_by=popularity.desc&' + API_KEY + LANGUAGUE_URL;

const BEST_URL = BASE_URL + '/discover/movie?sort_by=vote_average.desc&' + API_KEY + LANGUAGUE_URL;

$('.ui.dropdown')
  .dropdown()
;
const createGenreUrl = (x) => {
    let GENRE_URL = BASE_URL + `/discover/movie?with_genres=${x}&` + API_KEY  + LANGUAGUE_URL;
    return GENRE_URL;
}


getMovies(API_URL);

function getMovies(url){
    document.getElementById('output').innerHTML='';
    fetch(url)
    .then(res => res.json())
    .then(data => {
        console.log(data)
        console.log(data.results[0])
        showMovies(data.results)
        showModal(data.results)
    })
}


const showMovies = (data) => {
    let acu = '';
    data.forEach(movie => {
        
        let dataSplit = movie.release_date.split('-');
        
        acu += 
        `
            <div class="ui card">
                <div class="image">
                    <img src="${movie.backdrop_path ? IMG_URL+movie.backdrop_path : IMG_URL+movie.poster_path}" alt="${movie.title}">
                </div>
                <div class="content center aligned card-body">
                    <p class="header">${movie.title}</p>
                    <div class="meta">
                        <span class="date">${dataSplit[0]}</span>
                    </div>
                    <div class="ui horizontal label ${getColor(movie.vote_average)}">
                        <i class="star icon"></i> ${movie.vote_average}
                    </div>
                </div>
                <div class="extra content center aligned">
                    <button class="ui button" id="${movie.id}">Ver más</button>
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

        let acuModal = ``;
        fetch(BASE_URL + `/movie/${movie.id}?` + API_KEY  + LANGUAGUE_URL)
        .then(res => res.json())
        .then(datos => {
            
            let movieId = datos;
            
            let htmlGenres = "";
            movieId.genres.forEach(genre => {
                htmlGenres += `<div class="ui left pointing teal basic label">${genre.name}</div>`;                
            })

            let dateYear = movieId.release_date.split('-');
            acuModal += 
            `
                <div class="ui modal" id="modal${movieId.id}">
                <i class="close icon"></i>
                <div class="image content">
                    <div class="ui massive image">
                        <img id="image-modal" src="${IMG_URL+movieId.poster_path}" alt="${movieId.title}">
                    </div>
                    <div class="description">
                        <div class="title-modal">
                            <h1 class="header">${movieId.title}</h1>
                            <div class="ui black tag label">${dateYear[0]}</div>
                        </div>
                        <div class="ui horizontal label ${getColor(movieId.vote_average)}">
                            <i class="star icon"></i> ${movieId.vote_average}
                        </div>
                        <div class="ui header">Resumen:</div>
                        <p class="description-text">${movieId.overview}</p>
                        <p class="ui header description-text">Géneros:</p>
                        <div class="list-gender">
                            ${htmlGenres}
                        </div>
                        <p class="description-text runtime-modal"><span class="ui header description-text">Duración: </span> ${movieId.runtime} minutos</p>
                        <a class="ui labeled button" tabindex="0" href="${movieId.homepage}" target="_blank">
                            <div class="ui pink button">
                                <i class="heart icon"></i>
                                <i class="tv icon"></i>
                            </div>
                            <div class="ui basic pink left pointing label">Ver</div>
                        </a>  
                    </div>
                    </div>
                    <div class="actions">
                        <div class="ui violet deny button">
                            Cerrar
                        </div>
                    </div>
                </div>

            `;

            document.getElementById('modal').insertAdjacentHTML("beforeend", acuModal);
        })
    
    });
    
}

const getColor = (x) => {
    if(x < 5){
        return 'red';
    }else if(x < 8){
        return 'yellow'
    }else{
        return 'green';
    }
}


let inputSearch = document.getElementById('inputSearch');

let search = document.getElementById('button-search');

search.addEventListener('click', (e) => {
    e.preventDefault();
    if(inputSearch.value){
        getMovies(SEARCH_URL+'&query='+ inputSearch.value)
    }else{
        getMovies(API_URL);
    }
    console.log(inputSearch.value)
})






