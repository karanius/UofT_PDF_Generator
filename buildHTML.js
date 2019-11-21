const cheerio = require('cheerio')
const gen = require('./generateHTML.js')
const fs = require('fs');





async function buildHTML(data){
    const index = await new Promise((res, rej)=>{
        fs.readFile('./rawHTML' , 'utf8' ,  (err , data)=>{
            res(data)
        })
    })
    const $ = cheerio.load(index, { ignoreWhitespace: true })
        
    const link = $('img').attr('src'); //document.querySelector('img').src //this is the link to the pic
    const bio = $($('.user-profile-bio')[0]).text() // document.querySelector('.user-profile-bio').children[0].innerText //this is the bio
    const name = $(".p-name.vcard-fullname.d-block.overflow-hidden").text() //document.querySelector(".p-name.vcard-fullname.d-block.overflow-hidden").innerText // this is the name of the person
    const work = $(".p-org").text(); //document.querySelector().innerText // this is the place they are working at
    const live = $(".p-label").text() //document.querySelector('.p-label').innerText // this is where they live
    const email = $('.u-email').text() //document.querySelector('.u-email').innerText // this is their email
    const aElems = $('a')  //document.querySelector('[rel="nofollow me"]').innerText //this is their website

    const chosenAElem = aElems.map((a,i)=>{
        if (i.attribs['rel'] === 'nofollow me') {
            return a
        }
    })

    console.log(chosenAElem)

    console.log('\n')
    
//     
//     // / 
//     
//     
//     let generatedHTML = gen(data);
//     fs.writeFile('index.html' , generatedHTML , (err)=>{
//         if (err){
//             console.log(err)
//         }
//     } )
    
//     // the user picture is in the <img>
}


module.exports = buildHTML;