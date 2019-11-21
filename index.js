const inq = require('inquirer');
const https = require('https');
const fs = require('fs');
const pup = require('puppeteer');
const generateHTML = require('./generateHTML.js');


const isGoodData = async (data) => {
    const colorList = ["green" , "blue" , "pink" , "red"]
    if (colorList.includes(data.color)) {
        if (data.username !== '') {
            let result = await new Promise((resolve,rej)=>{
                let rawData = ''
                var options = {
                    host:'api.github.com',
                    path: '/users/' + data.username,
                    method: 'GET',
                    headers: {'user-agent':'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)'}
                };
                https.get( options , (res)=>{
                    res.on('data', (chunk)=>{
                        rawData = rawData + chunk
                    } )
                    res.on('end', ()=>{
                        resolve(rawData)
                    })
                })
            })
            result = JSON.parse(result)
            if (result.message) {
                process.stdout.write('\033c')
                console.log('\n')
                console.log('!!!~ Invalid Username')
                return false
            } else {
                return result
            }    
        } else {
            process.stdout.write('\033c')
            console.log('\n')
            console.log('!!!~ Invalid Username') 
            return false  
        }
    } else {
        process.stdout.write('\033c')
        console.log('\n')
        console.log('!!!~ Invalid Color')
        return false
    }
}

const askQuestions = async () => {
    console.log('\n')
    console.log('~~ Please answer the following questions')
        data = {
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
        let result = await isGoodData(data);
        if (result === false){
            await askQuestions()
        } else {
            return [data,result];
        }    
}

const takeScreenShot = async (name) => {
    const optionsSetContent = {
        waitUntil: "networkidle2",

    }
    const optionsPDF={
        path: `${name}.pdf`,
        printBackground:false,
        format: "A4",
        pageRanges: '1',

    }
    const browser = await pup.launch();
    const page = await browser.newPage();
    const content = fs.readFileSync('index.html' , 'utf8' )
    await page.setContent( content ,optionsSetContent)
    await page.pdf(optionsPDF)
    await browser.close()
}


const cleanUp = async () => {
    fs.unlink('index.html', (err)=>{
        if (err) {
            throw err
        }
    })
}

const init = async () => {
    const data = await askQuestions() 
    const htmlCode = await generateHTML(data)
    fs.writeFile( 'index.html' , htmlCode , 'utf8' , (err)=>{
        if (err) {
            throw err
        }
    })
    await takeScreenShot(data[0].username)
    await cleanUp()

    process.stdout.write('\033c')
    console.log('~~ Your File Is Ready')
}

process.stdout.write('\033c')
init();
