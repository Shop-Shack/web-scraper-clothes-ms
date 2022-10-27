const axios = require('axios');
const express = require('express');
const cheerio = require('cheerio');
const PORT = 8080;
const app = express();

const url = 'https://www.marksandspencer.in/l/women/all-women/?cgid=IN_SubCategory_1100035&prefn1=isOnline&prefv1=online&prefn2=productStyle&prefv2=Dresses%20%26%20Jumpsuit|Tops|Sweatshirts|Denim%20jacket';

let womenAPI = []
axios(url)
.then(response=>{

    const html = response.data;
    // console.log(html);

    const $ = cheerio.load(html);

    $('.product',html).each(function(){
        const title = $(this).find('img').attr('title')
        const dataPID = $(this).attr('data-pid')
        const url = $(this).find('.tile-image').attr('data-src')
        const price = $(this).find('.sales .value').text();
        const productURL = 'https://www.marksandspencer.in/'+$(this).find('.image-container a').attr('href');
        

        womenAPI.push({
            dataPID, 
            title,
            url,
            price,
            productURL,
            

        })
    })

    console.log(womenAPI)
    console.log(womenAPI.length)


    fetchProductDesc();
    // console.log(womenAPI)

}).catch(err => console.log(err));

const fetchProductDesc = function(){

    for(let i = 0; i<womenAPI.length; i++){

        axios(womenAPI[i].productURL)
        .then(response => {
            const html = response.data;
            const $ = cheerio.load(html);
            // console.log(html);
            $('.product-information',html).each(function(){
                
                const desc=$(this).find('.editors-notes').text();
            // console.log(desc);

            womenAPI[i]['desc'] = desc;
            console.log(JSON.stringify(womenAPI[i]))

            })

        }).catch(err => console.log(err));
    }

    
    
}

app.listen(PORT,()=>{
    console.log(`The server is listening on port ${PORT}`);
});