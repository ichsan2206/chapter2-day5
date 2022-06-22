const { request, query } = require('express')
const express = require('express')
const moment = require('moment');
const app = express()
const port = 8000

const db = require('./connection/db')

app.set('view engine', 'hbs') // set view engine hbs

app.use('/assets', express.static(__dirname + '/assets')) 
app.use(express.urlencoded({extended: false}))

db.connect(function(err, client, done){
    if (err) throw err // menampilkan error koneksi database

app.get('/', function(request, response){

        client.query('SELECT * FROM tb_projects', function(err, result){
           
            if (err) throw err

            let data = result.rows

            let  dataProjects= data.map(function(item){
                return {
                    ...item,


                }
            })

            response.render('index',{ projects: dataProjects})
        })
    })



app.get('/contact', function(request, response){
    response.render('contact')
})


app.get('/myproject', function(request, response){
    response.render('myproject')
})

app.post('/myproject', function(request, response){
    const data = request.body
    // console.log(data);
    const technologies = request.body.tech;
    console.log(technologies);

    const query = `INSERT INTO public.tb_projects(
       name, start_date, end_date, description, technologies, image)
        VALUES ( '${data.inputTitle}', '${data.startDate}', '${data.endDate}', '${data.inputDescription}','{"${technologies}"}','${data.inputImage}');`

    client.query(query, function(err, result){
        if(err) throw err

        response.redirect('/')
    })
})

app.get('/detail-project/:id', function(request, response){
   
    let id = request.params.id

    client.query(`SELECT * FROM public.tb_projects WHERE id=${id}`, function(err, result){
        if (err) throw err
        // console.log(result.rows[0]);
        let data = result.rows[0]
        // data.post_at = getFullTime(data.post_at)
        console.log(data);
        response.render('detail-project', data)
    })
})

app.get('/delete-project/:id', function(request, response){
   
    const id = request.params.id
    const query = `DELETE FROM public.tb_projects   WHERE id=${id};`

    client.query(query, function(err, result){
        if(err) throw err

        response.redirect('/')
    })
})

app.get('/update/:id', function(request, response){
const id = request.params.id
client.query(`SELECT * FROM public.tb_projects WHERE id=${id}`, function(err,result){
    if(err) throw err;

    let data = result.rows[0];
    response.render("update",{project: data})
});
})

app.post('/update/:id', function(request, response){
const id = request.params.id;
data = request.body;
const technologies = request.body.tech;

const query = `UPDATE public.tb_projects
SET name='${data.inputTitle}', start_date='${data.startDate}', end_date='${data.endDate}', description='${data.inputDescription}', technologies='{${technologies}}', image='${data.inputImage}'
WHERE id='${id}';`

 client.query(query, function(err, result){
     if(err) throw err

response.redirect('/');
});
})

app.listen(port, function(){
    console.log(`Server running on port ${port}`);
})

})

function duration() {
    let startM = new Date (request.body.startDate).getMonth();
       let endM = new Date (request.body.endDate).getMonth()
       let startY = new Date (request.body.startDate).getFullYear();
       let endY= new Date (request.body.endDate).getFullYear();
       let selisihHasil = (startM+12*endY)-(endM+12*startY);
     return Math.abs(selisihHasil);
}