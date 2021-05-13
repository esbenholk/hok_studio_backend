const express = require('express');
const app = express();
const cors = require('cors')
const {cloudinary} = require('./utils/cloudinary')

const port = process.env.PORT || 3001


app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit:'50mb', extended: true}))

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
  });



app.get('/api/getallimages', async (req, res)=>{
    const {resources}= await cloudinary.search.expression(
        'folder:contentRedistribution' // add your folder
        ).sort_by('public_id','desc').max_results(99).execute()

    const publicUrls = await resources.map((file)=> file.url);

    console.log(publicUrls);

    res.json({images: publicUrls});

})
app.post('/api/upload', async (req, res)=>{
    try {
        const fileStr = req.body.data;
        const uploadedResponse = await cloudinary.uploader.upload(fileStr, {upload_preset:'contentRedistribution'})
        console.log("there is sucess", uploadedResponse);
        res.json({msg: "succes"});
    } catch (error) {
        console.error("there is error", error)
        res.status(500).json({err: 'there is an error'})
    }
})



app.listen(port, ()=>{
    console.log('i am listening on', port);

})


