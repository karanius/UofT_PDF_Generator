const buildHTML = require('./buildHTML')

const inq = require('inquirer');
const https = require('https');
const fs = require('fs')

const urlTemplate = "https://github.com/"


async function getProfile(url,purpose){
    if (purpose === 'test'){
        const requestCode = await new Promise( (res,rej)=> {
            https.get(url , (response)=>{
                res(response.statusCode)
            })
        } )        
        if (requestCode === 200) {
            // process.stdout.write('\033c')
            console.log('~~~ Valid Github Username')
            return true
        }else{
            // process.stdout.write('\033c')
            console.log('!!!~ Invalid Github Username')
            return false
        }
    }
    
    if (purpose = 'build') {
        let rawData = "";
        let target = urlTemplate + url.username;

        https.get(target, (res)=>{
            res.on('data', (data)=>{
                rawData = rawData + data
            })

            res.on('end',()=>{
                fs.writeFile('rawHTML', rawData , (err)=>{
                    if (err) {
                        console.log(err)
                    }
                } 
                )
            })
        })

    }

}


async function checkValidGithub(data){
    //check for valid github account
    const username = data.username;
    const target = urlTemplate+username
    let response = await getProfile(target,'test');
    return response
}

async function askQuestions(){
    const data = {
        username: '',
        color: ''
    }
    await inq.prompt([
        {
            name: "username",
            message: "what is your Github's username? ( example: karanius )\n"
        },
        {
            name: "color",
            message: 'What is your fave color? ( example: red || choose ONLY from: [green , blue , pink , red] ) \n',
        }
    ])
    .then((answer)=>{
        data.username = answer.username.toLowerCase();
        data.color = answer.color.toLowerCase();
    })

    const colorList = ["green" , "blue" , "pink" , "red"]

     if (colorList.includes(data.color) && (data.username !== '')) {
         return data;
     } else {
        return false;
     }

}



async function generateFile(data){
    console.log("~~ generating the pdf for you")
    await getProfile(data,'build');
    await buildHTML(data);
    // await builtPDF(data);
}




async function init() {
    console.log('Please answer the following questions')
    let data = await askQuestions() // 1. ask the questions and get the data
    if (data !== false ){
        if (await checkValidGithub(data) === true ) { //2. use the data to generate the file ONLY IF github profile data is valid
            const file = await generateFile(data) // 3. generate the file
            await saveFile(file)
            letUserKnowWhenDon()
        } else { // if not, ask again...
            console.log('Could Not find Github Profile. Please Enter a Valid Username')
            init()
        }
    } else {
        // process.stdout.write('\033c')
        console.log('!!!~ Invalid INPUT')
        init()
    }



}


process.stdout.write('\033c')
init();
