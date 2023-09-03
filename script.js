// VARIABLES


let word = ''
const search_area = document.getElementById('search-area')
const search_bar = document.getElementById('search-bar')
const meaning_container = document.getElementById('meaning-container')
const base_url = 'https://api.dictionaryapi.dev/api/v2/entries/en/'
const options = {
    method:'GET'
}



// FUNTIONS
function render_data(data,word){

    // console.log(data[0].meanings[0].definitions.length)
    let number_of_meanings = data[0].meanings[0].definitions.length
    let part_of_speech = data[0].meanings[0].partOfSpeech
    let phonetic = data[0].phonetic


    // FIRST PART
    // CREATING SEARCHED WORD CONTAINER [searched-word-div]
    let searched_word_div = document.createElement('div')
    searched_word_div.classList.add('searched-word-div','container')
    
    let searched_word = document.createElement('div')
    searched_word.classList.add('searched-word')
    searched_word_div.appendChild(searched_word)
    // console.log(searched_word_div)
    // added searched word [h2]
    let h2 = document.createElement('h2')
    h2.textContent = word
    // added speaker_icon [icon]
    let speaker_icon = document.createElement('iconify-icon')
    speaker_icon.setAttribute('icon','fluent:speaker-2-28-filled')
    speaker_icon.classList.add('speaker')
    //appending h2 and speaker inside searched-word-div [h2 + icon]
    searched_word.appendChild(h2)
    searched_word.appendChild(speaker_icon)
    //adding phonetic
    let phonetic_el = document.createElement('p')
    phonetic_el.classList.add('phonetic')
    phonetic_el.textContent = phonetic
    //appending searched-word to searched-word-div then to section
    searched_word_div.appendChild(searched_word)
    searched_word_div.appendChild(phonetic_el)
    searched_word_div.appendChild(document.createElement('hr'))
    meaning_container.appendChild(searched_word_div)

    // 2ND PART
    //Creating [meaning-div]
    let meaning_div = document.createElement('div')
    meaning_div.classList.add('meaning-div','container')
    let part_of_speech_el = document.createElement('p')
    part_of_speech_el.classList.add('part-of-speech')
    part_of_speech_el.textContent = part_of_speech
    meaning_div.appendChild(part_of_speech_el)
    let meanings = document.createElement('div')
    meanings.classList.add('meanings')

    for(let i = 0; i < number_of_meanings; i++){
        let definition = data[0].meanings[0].definitions[i].definition
        let meaning = document.createElement('div')
        meaning.classList.add('meaning')
        let span_div = document.createElement('div')
        span_div.classList.add('span-div')
        let span = document.createElement('span')
        span.textContent = i+1
        span_div.appendChild(span)
        let p = document.createElement('p')
        p.textContent = definition
        meaning.appendChild(span_div)
        meaning.appendChild(p)
        meanings.appendChild(meaning)
    }
    meaning_div.appendChild(meanings)
    searched_word_div.appendChild(meaning_div)
    
    

    // console.log('total meanings: ', number_of_meanings)
    // console.log('Part of Speech',part_of_speech)
    // console.log('Phonetic',phonetic)

  
}

function get_meaning(){
    if (navigator.onLine){

        word = get_word()
        clear_search_bar()        
        url = base_url + word

        fetch(url,options).then(response =>{
            if (!response.ok){
                throw new Error('response not ok!')
            }
            return response.json()
        }).then(data=>{
            render_data(data, word) //render_data func call
        }).catch(error=>{
            console.error(error)
        })
    }else{
        console.log('offline - no connection !')
    }
}



// small function

function get_word(){
    return search_bar.value
}

function clear_search_bar(){
    search_bar.value = ''
}

function clear_section_first(){
    if(meaning_container.hasChildNodes){
        while(meaning_container.firstChild){
            meaning_container.removeChild(meaning_container.firstChild)
        }
    }
}

//OTHERS

search_area.addEventListener('click',(event)=>{
    if (event.target.id == 'search-btn'){
        // console.log('search-btn')
        clear_section_first()
        get_meaning()
    }
    else if (event.target.id == 'clear-btn'){
        clear_search_bar()
    }
})

document.body.addEventListener('keydown',(event)=>{
    if (event.code == 'Enter'){
        clear_section_first()
        get_meaning()
    }
})
