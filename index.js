const API_KEY = 'api_key=97b143511210cce0a5eb60a8b8d20279';

const BASE_URL = 'https://api.themoviedb.org/3';

const LANGUAGUE_URL = '&language=es-ES';

const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&'+ API_KEY + LANGUAGUE_URL;

const IMG_URL = 'https://image.tmdb.org/t/p/w500';

const SEARCH_URL = BASE_URL + '/search/movie?' + API_KEY + LANGUAGUE_URL ; 

const UPDATE_URL = BASE_URL + '/discover/movie?primary_release_year=2022&sort_by=popularity.desc&' + API_KEY + LANGUAGUE_URL;

const BEST_URL = BASE_URL + '/discover/movie?sort_by=vote_average.desc&' + API_KEY + LANGUAGUE_URL;

$('.ui.dropdown')
    .dropdown()
;

let btnTop = document.getElementById("btnTop");
    
btnTop.addEventListener('click', () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
});
window.addEventListener('scroll', ()=>{
    if(window.scrollY > 100){
        btnTop.classList.remove("hide");
    }else{
        btnTop.classList.add("hide");
    }
})

const createGenreUrl = (x) => {
    let GENRE_URL = BASE_URL + `/discover/movie?with_genres=${x}&` + API_KEY  + LANGUAGUE_URL;
    return GENRE_URL;
}

let loader =
`
    <div class="ui segment load-div">
        <div class="ui active inverted dimmer load-div-box">
            <div class="ui text loader">Cargando..</div>
        </div>
        <p></p>
    </div>
`;

const prev = document.getElementById('prev');
const next = document.getElementById('next');
const current = document.getElementById('number');

let currentPage = 1;
let nextPage = 2;
let prevPage = 3;
let lastUrl = '';
let totalPages = 100;

getMovies(API_URL);

function getMovies(url){
    lastUrl = url;
    document.getElementById('output-buttons').classList.add("hide");
    document.getElementById('output').innerHTML='';
    document.getElementById('output').classList.remove('output-margin');
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    document.getElementById('output').innerHTML= loader;
    
    fetch(url)
    .then(res => res.json())
    .then(data => {
        document.getElementById('output').innerHTML = ``;
        console.log(data)
        console.log(data.results)
        
        if(data.results.length !== 0){
            showMovies(data.results);
            showModal(data.results);
            document.getElementById('output-buttons').classList.remove("hide");
            currentPage = data.page;
            current.innerHTML = currentPage;
            nextPage = currentPage + 1;
            prevPage = currentPage - 1;
            totalPages = data.total_pages;

            if(currentPage <= 1){
                prev.classList.add("disabled");
                next.classList.remove("disabled");
            }else if(currentPage >= totalPages){
                prev.classList.remove("disabled");
                next.classList.add("disabled");
            }else{
                prev.classList.remove("disabled");
                next.classList.remove("disabled");
            }

        }else{
            document.getElementById('output').innerHTML= `
                <h3 class="no-results-title">No hay Resultados</h3>
            `;
            document.getElementById('output-buttons').classList.add("hide");
        }
    })
}

const showMovies = (data) => {
    let acu = '';
    data.forEach(movie => {
        let dataSplitYear;
        let dataSplit;
        if(movie.release_date != undefined){
            dataSplit = movie.release_date.split('-');
            dataSplitYear = dataSplit[0];
        }else{
            dataSplitYear = "";
        }
        
        acu += 
        `
            <div class="ui card">
                <div class="image">
                    <img src="${movie.backdrop_path ? IMG_URL+movie.backdrop_path : IMG_URL+movie.poster_path}" alt="${movie.title}">
                </div>
                <div class="content center aligned card-body">
                    <p class="header">${movie.title}</p>
                    <div class="meta">
                        <span class="date">${dataSplitYear}</span>
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
    document.getElementById('output').insertAdjacentHTML('beforeend', acu);
    document.getElementById('output').classList.add('output-margin');
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
            
            let htmlGenres = '';
            movieId.genres.forEach(genre => {
                htmlGenres += `<div class="ui left pointing teal basic label">${genre.name}</div>`;                
            })

            let dataDate;
            let dataYear;

            if(movieId.release_date != undefined){
                dataDate = movieId.release_date.split('-');
                dataYear = dataDate[0];
            }else{
                dataYear = "";
            }
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
                            <div class="ui black tag label">${dataYear}</div>
                        </div>
                        <div class="ui horizontal label ${getColor(movieId.vote_average)}">
                            <i class="star icon"></i> ${movieId.vote_average}
                        </div>
                        <div class="ui header">Sinopsis:</div>
                        <p class="description-text">${movieId.overview}</p>
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

            document.getElementById('modal').insertAdjacentHTML('beforeend', acuModal);
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
})

next.addEventListener('click', () => {
    if(nextPage <= totalPages){
        pageCall(nextPage)
    }
})
prev.addEventListener('click', () => {
    if(prevPage > 0){
        pageCall(prevPage)
    }
})
const pageCall = (page) => {
    let urlSplit = lastUrl.split('?');
    let queryParams = urlSplit[1].split('&');
    let key = queryParams[queryParams.length -1].split('=');
    current.innerHTML = page;
    if(key[0] != "page"){
        let url = lastUrl + "&page=" + page;
        console.log(url)
        getMovies(url);
    }else{
        let newUrl = lastUrl.slice(0, (lastUrl.length-2));
        let url = newUrl + "=" + page;
        console.log(url)
        getMovies(url);
    }
}
