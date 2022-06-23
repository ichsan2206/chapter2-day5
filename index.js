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
                    durasi: duration(item.start_date, item.end_date)

                }
            })
            console.log(dataProjects);

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
    
    const technologies = []

    if (data.node) {
        technologies.push('node');
    } else {
        technologies.push('')
    }
    if (data.react) {
        technologies.push('react');
    } else {
        technologies.push('')
    }
    if (data.android) {
        technologies.push('android');
    } else {
        technologies.push('')
    }
    if (data.java) {
        technologies.push('java');
    } else {
        technologies.push('')
    }

    const query = `INSERT INTO public.tb_projects(
       name, start_date, end_date, description, technologies, image)
        VALUES ( '${data.inputTitle}', '${data.startDate}', '${data.endDate}', '${data.inputDescription}',ARRAY ['${technologies[0]}', '${technologies[1]}','${technologies[2]}', '${technologies[3]}'],'${data.inputImage}');`

    client.query(query, function(err, result){
        if(err) throw err

        response.redirect('/')
    })
})

app.get('/detail-project/:id', function(request, response){

    let id = request.params.id
    
    const query =  `SELECT * FROM public.tb_projects WHERE id=${id}`
    client.query(query, function(err,result){
    if(err) throw err;

    const detail = result.rows[0];
    detail.start_date = moment(detail.start_date).format('DD MMM YYYY')
    detail.end_date = moment(detail.end_date).format('DD MMM YYYY')
    detail.durasi = duration(detail.start_date, detail.end_date);
    response.render("detail-project",{detailP: detail, id})
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

    let id = request.params.id
    const query =  `SELECT * FROM public.tb_projects WHERE id=${id}`
    client.query(query, function(err,result){
    if(err) throw err;

    const dataUpdate = result.rows[0];
    dataUpdate.start_date = moment(dataUpdate.start_date).format('YYYY-MM-DD')
    dataUpdate.end_date = moment(dataUpdate.end_date).format('YYYY-MM-DD')
    response.render("update",{update: dataUpdate, id})
});
})

app.post('/update/:id', function(request, response){

let id = request.params.id;

data = request.body;

 const technologies = []

    if (data.node) {
        technologies.push('node');
    } else {
        technologies.push('')
    }
    if (data.react) {
        technologies.push('react');
    } else {
        technologies.push('')
    }
    if (data.android) {
        technologies.push('android');
    } else {
        technologies.push('')
    }
    if (data.java) {
        technologies.push('java');
    } else {
        technologies.push('')
    }

    const query = `UPDATE tb_projects 
    SET name = '${data.inputTitle}', start_date = '${data.startDate}', end_date = '${data.endDate}', description = '${data.inputDescription}', technologies = ARRAY ['${technologies[0]}', '${technologies[1]}','${technologies[2]}', '${technologies[3]}'], image='${data.inputImage}' 
    WHERE id=${id};`

 client.query(query, function(err, result){
     if(err) throw err

response.redirect('/');
});
})

app.listen(port, function(){
    console.log(`Server running on port ${port}`);
})

})

function duration(startDate, endDate) {
    let startM = new Date (startDate).getMonth();
       let endM = new Date (endDate).getMonth()
       let startY = new Date (startDate).getFullYear();
       let endY= new Date (endDate).getFullYear();
       let selisihHasil = (startM+12*endY)-(endM+12*startY);
     return  Math.abs(selisihHasil);
}