

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
function get_phonetic_box(data,word){
    phonetic = data[0].phonetic
    
     // FIRST PART
    // CREATING SEARCHED WORD CONTAINER [searched-word-div]
    let searched_word_div = document.createElement('div')
    searched_word_div.classList.add('searched-word-div','container')
    
    let searched_word = document.createElement('div')
    searched_word.classList.add('searched-word')
    searched_word_div.appendChild(searched_word)
    // added searched word [h2]
    let h2 = document.createElement('h2')
    h2.textContent = word
    // added speaker_icon [icon]
    let speaker_icon = document.createElement('iconify-icon')
    const audio_url = data[0].phonetics[0].audio

    if (audio_url.length != 0){
        var audio = new Audio(audio_url)
        speaker_icon.setAttribute('icon','fluent:speaker-2-28-filled')
    }else{
        speaker_icon.setAttribute('icon','clarity:volume-mute-solid')
    }
    speaker_icon.addEventListener('click',()=>{
        audio.play()
    })
    speaker_icon.classList.add('speaker')

    //appending h2 and speaker inside searched-word-div [h2 + speaker]
    searched_word.appendChild(h2)
    searched_word.appendChild(speaker_icon)
    // adding phonetic
    let phonetic_el = document.createElement('p')
    phonetic_el.classList.add('phonetic')
    phonetic_el.textContent = phonetic
    //appending searched-word to searched-word-div then to section
    searched_word_div.appendChild(searched_word)
    searched_word_div.appendChild(phonetic_el)
    // searched_word_div.appendChild(document.createElement('hr'))
    meaning_container.appendChild(searched_word_div)

}

function create_white_box_with_meanings(element){

    let number_of_definitions = element.definitions.length
    let part_of_speech = element.partOfSpeech
    let color_class = 'part-of-speech-others'

     //Creating [meaning-div]
    let meaning_div = document.createElement('div') //0
    meaning_div.classList.add('meaning-div','container','white-box')
    let part_of_speech_el = document.createElement('p')//1
    if(part_of_speech == 'noun'){
        color_class = 'part-of-speech-noun'
    }
    else if(part_of_speech == 'verb'){
        color_class = 'part-of-speech-verb'
    }
    else if(part_of_speech == 'adjective'){
        color_class = 'part-of-speech-adjective'
    }

    part_of_speech_el.classList.add('part-of-speech',color_class)
    part_of_speech_el.textContent = part_of_speech
    meaning_div.appendChild(part_of_speech_el)
    let meanings = document.createElement('div') //1
    meanings.classList.add('meanings')

    for(let i = 0; i < number_of_definitions; i++){
        let definition = element.definitions[i].definition
        let meaning = document.createElement('div')//2
        meaning.classList.add('meaning')
        //span
        let span_div = document.createElement('div')//3
        span_div.classList.add('span-div')
        let span = document.createElement('span')
        span.textContent = i+1
        span_div.appendChild(span)

        //p
        let p = document.createElement('p')//3
        p.classList.add('definition')
        p.textContent = definition

        //copy icon + copy to clipboard
        let copy_icon = document.createElement('iconify-icon')
        copy_icon.setAttribute('icon','solar:copy-bold-duotone')
        copy_icon.classList.add('copy-icon')
        copy_icon.addEventListener('click',(e)=>{
            e.target.style.color = '#1c7000'
            e.target.style.opacity = 1
            let p = e.target.previousElementSibling
            navigator.clipboard.writeText(p.textContent)
        })
        
        
        //make copy visible on mouse enter
        meaning.addEventListener('mouseenter',(e)=>{
            const parent_div = e.target
            icon = parent_div.querySelector('iconify-icon')
            icon.style.opacity = '50%'

        })
        //opposite of above
        meaning.addEventListener('mouseleave',(e)=>{
            const parent_div = e.target
            icon = parent_div.querySelector('iconify-icon')
            icon.style.opacity = '0%'
        })
        meaning.appendChild(span_div)
        meaning.appendChild(p)
        meaning.appendChild(copy_icon)
        meanings.appendChild(meaning)
        
        
        if(i != number_of_definitions - 1)
            meanings.appendChild(document.createElement('hr'))
    }
    meaning_div.appendChild(meanings)
    meaning_container.appendChild(meaning_div)
}



function render_data(data,word){
    
    get_phonetic_box(data,word)

    data[0].meanings.forEach(element => {
        create_white_box_with_meanings(element)
    });

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
            console.log(data)
            render_data(data, word) //render_data func call
        }).catch(error=>{
            console.error(error)
            data_not_available_message()
        })
    }else{
        console.log('offline - no connection !')
        offline_message()
    }
}


function data_not_available_message(){
    console.log('data_not_available_message in')
    // FIRST PART
    // CREATING SEARCHED WORD CONTAINER [searched-word-div]
    let searched_word_div = document.createElement('div')
    searched_word_div.classList.add('searched-word-div','container')
    
    let searched_word = document.createElement('div')
    searched_word.classList.add('searched-word')
    searched_word_div.appendChild(searched_word)
    // console.log(searched_word_div)
    // added searched word [h2]
    let h3 = document.createElement('h3')
    h3.textContent = 'Please check the spelling 🤓, \nData not availaible for this word !🥲'
    h3.style.whiteSpace = 'pre-line'
    searched_word.appendChild(h3)
    searched_word.style.textAlign = 'center'
    searched_word.classList.add('flex-center')
    meaning_container.appendChild(searched_word_div)
}

function offline_message(){
    console.log('data_not_available_message in')
    // FIRST PART
    // CREATING SEARCHED WORD CONTAINER [searched-word-div]
    let searched_word_div = document.createElement('div')
    searched_word_div.classList.add('searched-word-div','container')
    
    let searched_word = document.createElement('div')
    searched_word.classList.add('searched-word')
    searched_word_div.appendChild(searched_word)
    // console.log(searched_word_div)
    // added searched word [h2]
    let h3 = document.createElement('h3')
    h3.textContent = 'Please check your internet connection !🔌'
    searched_word.appendChild(h3)
    searched_word.style.textAlign = 'center'
    searched_word.classList.add('flex-center')
    meaning_container.appendChild(searched_word_div)
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

search_area.addEventListener('click',(e)=>{
    if (e.target.id == 'search-btn'){
        // console.log('search-btn')
        // if()
        clear_section_first()
        get_meaning()
    }
    else if (e.target.id == 'clear-btn'){
        clear_search_bar()
    }
})

document.body.addEventListener('keydown',(event)=>{
    if (event.code == 'Enter'){
        clear_section_first()
        get_meaning()
    }
})


// test

get_meaning()
