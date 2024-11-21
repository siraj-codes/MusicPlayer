class SongNode {
    constructor(songName, filePath) {
        this.songName = songName;
        this.filePath = filePath;
        this.next = null;
        this.prev = null;
    }
}

class CircularDoublyLinkedList {
    constructor() {
        this.current = null;
    }

    addSong(songName, filePath) {
        const newNode = new SongNode(songName, filePath);
        if (!this.current) {
            newNode.next = newNode;
            newNode.prev = newNode;
            this.current = newNode;
        } else {
            const last = this.current.prev;
            last.next = newNode;
            newNode.prev = last;
            newNode.next = this.current;
            this.current.prev = newNode;
        }
    }

    nextSong() {
        this.current = this.current.next;
    }

    prevSong() {
        this.current = this.current.prev;
    }
}

const songList = new CircularDoublyLinkedList();
songList.addSong("Song 1", "./Songs/song1.mp3");
songList.addSong("Song 2", "./Songs/song2.mp3");
songList.addSong("Song 3", "./Songs/song3.mp3");
songList.addSong("Song 4", "./Songs/song4.mp3");
songList.addSong("Song 5", "./Songs/song5.mp3");
songList.addSong("Song 6", "./Songs/song6.mp3");
songList.addSong("Song 7", "./Songs/song7.mp3");

const audio = new Audio();
const playBtn = document.getElementById("play-btn");
const nextBtn = document.getElementById("next-btn");
const prevBtn = document.getElementById("prev-btn");
const shuffleBtn = document.getElementById("shuffle-btn");
const loopBtn = document.getElementById("loop-btn");
const muteBtn = document.getElementById("mute-btn");
const volumeBar = document.getElementById("volume-bar");
const songName = document.getElementById("song-name");
const timeBar = document.getElementById("time-bar");
const currentTimeElem = document.getElementById("current-time");
const totalTimeElem = document.getElementById("total-time");

let isPlaying = false;
let isLooping = false;
let isMuted = false;

function updateSongDetails() {
    songName.textContent = songList.current.songName;
    audio.src = songList.current.filePath;
}

function playPauseSong() {
    if (isPlaying) {
        audio.pause();
        playBtn.innerHTML = '<i class="fas fa-play"></i>'; // Play Icon
    } else {
        audio.play();
        playBtn.innerHTML = '<i class="fas fa-pause"></i>'; // Pause Icon
    }
    isPlaying = !isPlaying;
}

function updateProgress() {
    if (audio.duration) {
        timeBar.value = (audio.currentTime / audio.duration) * 100;
        currentTimeElem.textContent = formatTime(audio.currentTime);
        totalTimeElem.textContent = formatTime(audio.duration);
    }
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
}

function onAudioEnd() {
    if (isLooping) {
        audio.currentTime = 0;
        audio.play();
    } else {
        nextSong();
    }
}

function nextSong() {
    songList.nextSong();
    updateSongDetails();
    audio.play();
    isPlaying = true;
    playBtn.innerHTML = '<i class="fas fa-pause"></i>'; // Pause Icon
}

function prevSong() {
    songList.prevSong();
    updateSongDetails();
    audio.play();
    isPlaying = true;
    playBtn.innerHTML = '<i class="fas fa-pause"></i>'; // Pause Icon
}

function shuffleSongs() {
    const songs = [];
    let temp = songList.current;
    do {
        songs.push(temp);
        temp = temp.next;
    } while (temp !== songList.current);
    const randomSong = songs[Math.floor(Math.random() * songs.length)];
    songList.current = randomSong;
    updateSongDetails();
    audio.play();
    isPlaying = true;
    playBtn.innerHTML = '<i class="fas fa-pause"></i>'; // Pause Icon
}

function muteToggle() {
    isMuted = !isMuted;
    if (isMuted) {
        audio.muted = true;
        muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>'; // Mute Icon
    } else {
        audio.muted = false;
        muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>'; // Volume Up Icon
    }
}

audio.addEventListener("ended", onAudioEnd);
audio.addEventListener("timeupdate", updateProgress);
audio.addEventListener("loadedmetadata", () => {
    totalTimeElem.textContent = formatTime(audio.duration);
});

timeBar.addEventListener("input", (e) => {
    audio.currentTime = (e.target.value / 100) * audio.duration;
});

volumeBar.addEventListener("input", (e) => {
    audio.volume = e.target.value / 100;
});

playBtn.addEventListener("click", playPauseSong);
nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);
shuffleBtn.addEventListener("click", shuffleSongs);
muteBtn.addEventListener("click", muteToggle);

loopBtn.addEventListener("click", () => {
    isLooping = !isLooping; // Toggle loop state
    loopBtn.classList.toggle("loop-active", isLooping); // Add/remove loop-active class
    loopBtn.innerHTML = isLooping ? '<i class="fas fa-sync-alt"></i>' : '<i class="fas fa-sync"></i>';
});


// Function to handle keyboard events
function handleKeyboardInput(event) {
    switch (event.key) {
        case " ":
            // Spacebar for play/pause
            playPauseSong();
            break;
        case "ArrowRight":
            // Right Arrow for next song
            nextSong();
            break;
        case "ArrowLeft":
            // Left Arrow for previous song
            prevSong();
            break;
        default:
            break;
    }
}

// Add event listener for keydown events
document.addEventListener("keydown", handleKeyboardInput);


updateSongDetails(); // Initial song setup
