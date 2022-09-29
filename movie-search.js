const upcomingUrl ='https://api.themoviedb.org/3/movie/upcoming?api_key=66e6ab7809b0bc46997bd9b3681f34a0&language=en-AU&release_date.gte=2021-12-17&release_date.lte=2022-01-07&region=AU'
const reviewUl= document.querySelector('.review-ul')
const h1=document.querySelector('h1');
const divContainer=document.querySelector('.container')
const movieNameInput=document.querySelector('#search')
const divMoreInfo=document.querySelector('#more-info');
const goBack=document.querySelector('.go-back')
const preBtn=document.querySelector('.prepage');
const nextBtn=document.querySelector('.nextpage')
let number =1;

//DOM init;
getUpComingMovies(upcomingUrl);
renderMovies();

//Loading upcoming movies as carousel slides
function getUpComingMovies(url){
    const li=document.createElement('li')
    const ul=document.querySelector('.upcoming');
    fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=66e6ab7809b0bc46997bd9b3681f34a0&language=en-US&page=1&region=AU`)
    .then(resp=>resp.json())
    .then(data=>{
        const upcomingMovies=data.results;
        //console.log(upcomingMovies);
        //set showing video and info function for each movie
        for(let i=0;i<upcomingMovies.length;i++){
            ul.innerHTML +=`
           <li><a href="#"> <img data-id=${upcomingMovies[i].id} src="https://www.themoviedb.org/t/p/w1280${upcomingMovies[i].poster_path}" alt="POSTER HAS GONE"></a></li>`
        }
        ul.innerHTML=ul.innerHTML+ul.innerHTML;
        let lis=ul.querySelectorAll('li');
        for(let j=0;j<lis.length;j++){
            lis[j].addEventListener('click',getMovieInfo)
        }
        let btnS=document.querySelectorAll('.btn')
        let spa=-2;
// calculates ul width
        ul.style.width=lis[0].offsetWidth*lis.length+'px';

// moving function
        
        function move(){
        if(ul.offsetLeft < -ul.offsetWidth/2){
        // moving left, estimate if slides finished(doubled the width of ul, so /2)
        ul.style.left='0';
        }
        if(ul.offsetLeft > 0){
        // moving right
        ul.style.left=-ul.offsetWidth/2+'px';
        }
    // sets offset
        ul.style.left=ul.offsetLeft+spa+'px';
        }
//
        let timer=setInterval(move,50);

// btn events
// moving left
        btnS[0].addEventListener('click',function(e){
            e.preventDefault();
        spa=-2;
        })
// moving right
        btnS[1].addEventListener('click',function(e){
            e.preventDefault();
         spa=2;
        })
    })
    .catch(err=>{
        alert(err)
    })
    
}

//main area of movies
function renderMovies(number){
    renderReviews();
    fetch(`https://api.themoviedb.org/3/movie/popular?api_key=66e6ab7809b0bc46997bd9b3681f34a0&language=en-US&region=AU&page=${number}`)
    .then(resp=>resp.json())
    .then(data=>{
        const main=document.querySelector('#main');
        const onMovies=data.results;
        onMovies.forEach(onMovie => {
            const movieDiv=document.createElement('div');
            movieDiv.classList.add('movie');
            //console.log(onMovie);
            movieDiv.innerHTML = `
            <div class="img-container">
                    <img src="https://www.themoviedb.org/t/p/w440_and_h660_face${onMovie.poster_path}" alt="Can't find picture">
            </div>
            <div class="movie-info">
                <h3>${onMovie.title}</h3>
                <span class="${changeRate(onMovie.vote_average)}">${onMovie.vote_average}</span>
            </div>
            <div class="overview">
                <h3>Overview</h3>
                <a href="#more-info">
                    <div data-id=${onMovie.id} class="text">
                        ${onMovie.overview}
                    </div>
                </a>
            </div>`
            main.appendChild(movieDiv);
            const onMovieText=movieDiv.querySelector('.text');
            //adding events on each movie, clicking links to show info
            onMovieText.addEventListener('click',getMovieInfo)
            //btn event to showing next page/pre page
            preBtn.addEventListener('click',renderPreviousMovies);
            nextBtn.addEventListener('click',renderNextMovies)  
            
        });
    })
    .catch(err=>{
        alert(err)
    })
    
}
// rating number color
function changeRate(vote) {
    if(vote >= 8) {
        return 'green'
    } else if(vote >= 5) {
        return 'orange'
    } else {
        return 'red'
    }
}

//jump to previous page
function renderPreviousMovies(){
    main.innerHTML=''
    1<number?(number--,renderMovies(number)):alert('This is the first page!')
    renderMovies();
    } 
//move to next page
    function renderNextMovies(){
        main.innerHTML=''
        if(number<3){number++,renderMovies(number);}
        else{
            alert('This is the last page')
            renderMovies(3);
        }
    
      }  


// search movie function
const form=document.querySelector('#search-form');
console.log(form);
form.addEventListener('submit',searchMovie);

function searchMovie(e){
    e.preventDefault();

    preBtn.hidden=true;
    nextBtn.hidden=true;
    const inputName=document.querySelector('#search');
    const searchUrl=`https://api.themoviedb.org/3/search/movie?api_key=66e6ab7809b0bc46997bd9b3681f34a0&query=${inputName.value}`;
    main.innerHTML=''
    fetch(searchUrl)
    .then(resp=>resp.json())
    .then(data=>{
        const main=document.querySelector('#main');
        const onMovies=data.results;
        onMovies.forEach(onMovie => {
            const movieDiv=document.createElement('div');
            movieDiv.classList.add('movie');
            //console.log(onMovie);
            movieDiv.innerHTML = `
            <div class="img-container">
                    <img src="https://www.themoviedb.org/t/p/w440_and_h660_face${onMovie.poster_path}" alt="Can't find picture">
            </div>
            <div class="movie-info">
                <h3>${onMovie.title}</h3>
                <span class="${changeRate(onMovie.vote_average)}">${onMovie.vote_average}</span>
            </div>
            <div class="overview">
                <h3>Overview</h3>
                <a href="#more-info">
                    <div data-id=${onMovie.id} class="text">
                        ${onMovie.overview}
                    </div>
                </a>
            </div>`
            main.appendChild(movieDiv);
            //same function as renderMovie()
            const onMovieText=movieDiv.querySelector('.text');
            onMovieText.addEventListener('click',getMovieInfo)
             
            
        });
    })
    .catch(err=>{
        alert(err)
    })
    
    
    inputName.value=''
}




//showing movie info 
function getMovieInfo(e){
    e.preventDefault();
    const onMovieText=document.querySelector('.text');
    const id=e.target.dataset.id;
    renderReviews(id);
    loadMovieInfo(id);
    hideMain();
}  
//load reviews of that movie from local server
function renderReviews(id){
    fetch(`http://localhost:3000/reviews?quoteId=${id}`)
    .then(resp=>resp.json())
    .then(data=>{
        const li=document.createElement('li')
        const p=document.createElement('p')
        for(let i=0;i<data.length;i++){
            const createDate= data[i].created_at
            reviewUl.innerHTML +=`<li><p>Written by ${data[i].author} on ${createDate}</p>${data[i].content}</li>`
            divMoreInfo.append(reviewUl);
        }
    
    })
    .catch(err=>{
        alert(err)
    })
    
   }
   //showing trailor video
   function loadMovieInfo(id){
    fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=66e6ab7809b0bc46997bd9b3681f34a0&language=en-US&append_to_response=videos`)
    .then(resp=>resp.json())
    .then(data=>{
        const a =data.videos.results.length;
        const b= data.videos.results
        // no video back to main showing session
        if (a==0){
            backToMain();
            alert('Sorry, there is no videos')
        }else {
        divMoreInfo.innerHTML=`
        <iframe width="560" height="340" src="https://www.youtube.com/embed/${b[a-1].key}?rel=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        <p class="go-back"><a href="#">BACK</a></p>
        <div class="small-info">
            <p>Title: ${data.title}</p>
            <p>Release Date: ${data.release_date}</p>
            <P>Runtime: ${data.runtime} mins</P>
            <p>Original Language: ${data.spoken_languages[0].english_name}</p>
            <p>Vote Average: ${data.vote_average}</p>
        </div>
        <div id="reviews">
                <h3>Reviews</h3>
                <input type="text" id="fname" name="fname" placeholder="Your Name Please">
                <br>
                <textarea id="review" name="review" placeholder="text here"></textarea>
                <br>
                <button class="review" data-id:${id}>SUBMIT</button>
            </div>`}
            // writing review for that movie and save in local server
            const reviewBtn= document.querySelector('.review');
            reviewBtn.addEventListener('click', submitReview);
            function submitReview(e){
                e.preventDefault();
                const reviewAuthor=document.querySelector('#fname')
                const reviewContent=document.querySelector('#review')
                const createdDate=new Date();
                const newReview={
                    quoteId:id,
                    author: reviewAuthor.value,
                    content:reviewContent.value,
                    created_at: createdDate.toString()
                };
                fetch(`http://localhost:3000/reviews/`,{
                    method:'POST',
                    headers:{
                        'Content-Type': 'application/json'
                    },
                    body:JSON.stringify(newReview)
                })
                .then(resp=>resp.json())
                .then(data=>{
                    renderReviews(id)
                })
                reviewUl.innerHTML='';
                reviewAuthor.value='';
                reviewContent.value='';
            }
            const cancelBtn=document.querySelector('.go-back')
            cancelBtn.addEventListener('click',backToMain)
            
    })
    .catch(err=>{
        alert(err)
    })
    
   }
   
   //hiding movie info session, back to main movie showing session
function backToMain(){
    h1.hidden=false;
    divContainer.hidden=false;
    movieNameInput.hidden=false;
    form.hidden=false;
    divMoreInfo.hidden=true;
}
//when loading movie info, hides slides and main movie showing session
function hideMain(){
    h1.hidden=true;
    divContainer.hidden=true;
    movieNameInput.hidden=true;
    form.hidden=true;
    divMoreInfo.hidden=false;
}