

// VARIABLES


let word = ''
let is_dark_mode = false
const toggle_container = document.getElementById('toggle-icon')
const search_area = document.getElementById('search-area')
const search_bar = document.getElementById('search-bar')
const meaning_container = document.getElementById('meaning-container')
const result_container = document.getElementById('result-container')
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
    searched_word.appendChild(h2)

    // adding phonetic
    let phonetic_el = document.createElement('p')
    if(phonetic){
        phonetic_el.textContent = phonetic
        phonetic_el.classList.add('phonetic')
        searched_word.appendChild(phonetic_el)
    }
    
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
    //appending searched-word to searched-word-div then to section
    searched_word_div.appendChild(searched_word)
    searched_word_div.appendChild(speaker_icon)
    // searched_word_div.appendChild(document.createElement('hr'))
    meaning_container.appendChild(searched_word_div)

}

function create_white_box_with_meanings(element){

    let number_of_definitions = element.definitions.length
    let part_of_speech = element.partOfSpeech
    // let color_class = 'part-of-speech-others'

     //Creating [meaning-div]
    let meaning_div = document.createElement('div') //0
    meaning_div.classList.add('meaning-div','container','white-box')
    let part_of_speech_el = document.createElement('p')//1
    part_of_speech_el.classList.add('part-of-speech')
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
        span.textContent = i+1 +'. '
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
    }
    meaning_div.appendChild(meanings)
    meaning_container.appendChild(meaning_div)

    if(is_dark_mode){
        darkMode_for_result(is_dark_mode)
    }
}



function render_data(data,word){
    
    get_phonetic_box(data,word)

    data[0].meanings.forEach(element => {
        create_white_box_with_meanings(element)
    });

}


function get_meaning(){
    //first clear the meaning container
    clear_section_first()

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
            // console.log(data)
            render_data(data, word) //render_data func call
        }).catch(error=>{
            console.error(error)
            data_not_available_message(word)
        })
    }else{
        console.log('offline - no connection !')
        offline_message()
    }
}

function create_respnse_box(response_title_val, response_val) {
    let parent_div = document.createElement('div')
    parent_div.classList.add('unexpected-response-div','container')

    let p = document.createElement('p')
    p.classList.add('emoji')
    p.textContent = '😶'

    let response_title = document.createElement('h3')
    response_title.classList.add('response-title')
    response_title.textContent = response_title_val

    let response = document.createElement('p')
    response.classList.add('response')
    response.textContent = response_val

    parent_div.appendChild(p)
    parent_div.appendChild(response_title)
    parent_div.appendChild(response)

    return parent_div
}


function data_not_available_message(word){

    let response_title_value = 'No Definition Found'
    let response_value = `Sorry Pal, definition for the word "${word}" not available at this time. You can check this out later or head to the web instead.`

    let parent_div = create_respnse_box(response_title_value,response_value)
    console.log(parent_div)
    meaning_container.appendChild(parent_div)
}

function offline_message(){
    let response_title_value = 'No Internet Connection'
    let response_value = 'Please do check your network connection then try again.'

    let parent_div = create_respnse_box(response_title_value,response_value)
    meaning_container.appendChild(parent_div)
}




function darkMode(){

    is_dark_mode = !is_dark_mode

    let body = document.body
    let toggle_circle = toggle_container.children[0]
    let footer = document.getElementsByTagName('footer')[0]

    //BODY DARK
    body.classList.toggle('body-dark-mode')
    //TOGGLE DARK
    toggle_container.classList.toggle('dark-toggle-cont')
    toggle_circle.classList.toggle('dark-circle')
    console.log(search_bar)
    search_bar.classList.toggle('input-dark-mode')

    darkMode_for_result(is_dark_mode)
    


    meaning_container.classList.toggle('dark-meaning-container')
    footer.classList.toggle('dark-footer')
}

function darkMode_for_result (is_dark_mode){
    let white_boxes = meaning_container.children
    
    if(white_boxes.length> 1){
        if(is_dark_mode){
            for(let i = 0; i<white_boxes.length; i++){
                let white_box = white_boxes[i]
                white_box.style.backgroundColor = '#1d2026'
                white_box.style.color = '#cccccc'
            }
        }else{
            for(let i = 0; i<white_boxes.length; i++){
                let white_box = white_boxes[i]
                white_box.style.backgroundColor = '#ffffff'
                white_box.style.color = '#757575'
            }
        }
        
    }

}

// SMALL FUNCTIONS

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

//EVENT LISTENERS

toggle_container.addEventListener('click',()=>{
    let toggle_btn = toggle_container.firstElementChild
    
    if(!toggle_btn.classList.contains('night')){
        toggle_btn.style.marginLeft = '30px'
        toggle_btn.classList.toggle('night')
    }else{
        toggle_btn.style.marginLeft = '3px'
        toggle_btn.classList.toggle('night')
    }

    darkMode()

    
})


document.body.addEventListener('keydown',(event)=>{
    if (event.key == 'Enter' || event.key == 'Return'){
        get_meaning()
    }
})

//Desktop touch to search
result_container.addEventListener('dblclick',(e)=>{
    let selected_text = document.getSelection().toString()
    if(selected_text.split(' ').length == 1){
        search_bar.value = selected_text
        get_meaning()
    }
})

//Phone touch to search 
result_container.addEventListener('touchend',(e)=>{
    let selected_text = window.getSelection.toString()
    if(selected_text){
        search_bar.value = selected_text
        get_meaning()
    }
})

