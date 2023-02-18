const audio = new Audio();
let dataSongs = [];
let urlVideo = "";
let currentSong = "";
let toggleSong = false;
let toggleV = false;
let startdur = document.querySelector('.startduration');
let enddur = document.querySelector('.endduration')

var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

if (isMobile) {
  window.addEventListener("orientationchange", function () {
    if (screen.orientation.type === "portrait-primary") {
      screen.orientation.lock("landscape-primary");
    }
  });
}




async function main(e) {
    const menuImage = document.querySelector(".imgMenu");
    const menuText = document.querySelector(".name");
    const iconPlay = document.querySelector(".menu");
    const footer = document.querySelector('footer');
    footer.style.transform = "translateY(0px)"; // if loaded then make footer 0 to show music menu 

    recherche(e.children[0].src);
    l = await getAudio(urlVideo)
    audio.src = l.url
    progressBar();
    audio.play();
    menuImage.children[0].src = e.children[0].src;
    menuText.innerText = currentSong;
    iconPlay.children[0].className = "fa-solid fa-circle-pause";
    audio.addEventListener('ended', function() {
        footer.style.transform = "translateY(500px)"; // if music is finished then hide it :)
        startdur.textContent = formatTime(audio.duration);
        enddur.textContent = formatTime(audio.duration);
    });
}
const iconPlay = document.querySelector(".menu i:nth-child(1)");
iconPlay.addEventListener('click', ()=> {
    let tog = togglePlay()
    console.log(tog);
    if (!tog) {
        iconPlay.className = "fa-solid fa-circle-pause";
        audio.play();
    } else {
        audio.pause();
        iconPlay.className = "fas fa-circle-play fa-thin";
    }
})


const iconVolume = document.querySelector(".menu i:nth-child(2)");
iconVolume.addEventListener('click', ()=> {
    let tog = toggleVolume()
    console.log(tog);
    if (!tog) {
        iconVolume.className = "fas fa-volume-up fa-fw";
        audio.muted = false;
    } else {
        audio.muted = true;
        iconVolume.className = "fa-solid fa-volume-xmark";
    }
})


function progressBar() {
    const progress = document.querySelector('.progress');
    const progressBar = document.querySelector('.progress-bar');
audio.addEventListener('timeupdate', function() {
        const currentTime = audio.currentTime;
        const duration = audio.duration;
        const progressPercent = (currentTime / duration) * 100;
        progress.style.width = progressPercent + '%';
});
progressBar.addEventListener('click', (event) => {
    const boundingRect = progressBar.getBoundingClientRect();
    const offsetX = event.clientX - boundingRect.left;
    const percentage = offsetX / boundingRect.width;
    audio.currentTime = audio.duration * percentage;
  });
      
}


// Listen for when the audio has loaded its metadata


audio.addEventListener('loadedmetadata', () => {
    const duration = Math.floor(audio.duration); // Round down to nearest second
    enddur.textContent = formatTime(duration);
    startdur.textContent = formatTime(0);
    // Update timer every second
    setInterval(() => {
      const currentTime = Math.floor(audio.currentTime);
        startdur.textContent = formatTime(currentTime);
        enddur.textContent = formatTime(duration);
    }, 500);
  });


  function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

function toggleVolume() {
    if (toggleV === false) {
        toggleV = true;
    } else {
        toggleV = false
    }
    return toggleV;
}

function togglePlay() {
    if (toggleSong === false) {
        toggleSong = true;
    } else {
        toggleSong = false
    }
    return toggleSong;
}



function recherche(ch) {
        for (let i = 0; i < dataSongs[0].length; i++) {
            if (dataSongs[0][i]["thumbnail"] === ch) {
                urlVideo = dataSongs[0][i]["link"]
                currentSong = dataSongs[0][i]["title"]
                return true
            }
        }
        return false
    }


function refreshBtns() {
    const btns = document.querySelectorAll('li')
    btns.forEach(e => {
    e.addEventListener('click', () => {
        main(e);
    })
})
}




async function getAudio(p){
    const response = await fetch("https://youtube.fishyflick.repl.co/?url="+p);
    const data = response.json();
    return data
}


document.querySelector('.input-wrapper').addEventListener('keypress', async function (e) {
    if (e.key === 'Enter') {
        l = await search(e.target.value)
        dataSongs.push(l);
        createItems(l);
    }
});

async function search(text) {
    dataSongs = [];
    const response = await fetch("https://searchvideo.fishyflick.repl.co/search?q="+text);
    const data = response.json();
    if (data) {
        return data
    } else {
        return console.log('failed to fetch')
    }
}


function createItems(arr) {
    let ul = document.querySelector('ul')
    ul.innerHTML = "";
    for (let i = 0; i < arr.length; i++) {
        let li = document.createElement("li");
        let img = document.createElement("img");
        let text = document.createElement("span");


        text.innerText = arr[i].title
        img.src = arr[i].thumbnail;
        li.appendChild(img);
        li.appendChild(text);
        ul.appendChild(li);        
        
    }
    refreshBtns();

    

}