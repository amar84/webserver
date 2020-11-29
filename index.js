var DEFAULT_PORT = (process.env.PORT || 3000);
var SERVER_NAME = 'webserver'
var DEFAULT_HOST ='127.0.0.1'

var http = require ('http');
var mongoose = require ("mongoose");

 var port = process.env.PORT;
 var ipaddress = process.env.IP;

 var counterGetRequest = 0;
 var uristring =
 process.env.MONGODB_URI ||
 'mongodb://127.0.0.1:27017/data';

 //setting up the connection to mongDB

 mongoose.connect(uristring, {useNewurlParser: true});
 mongoose.createConnection(uristring, { useNewUrlParser: true }); // new command by net

 const db = mongoose.connection;
 db.on('error', console.error.bind(console, 'connection error'));
 db.once('open', function() {
     console.log(" $$$ we are connected to mongoDB: " + uristring)

 });

 var patientSchema = new mongoose.Schema({
    first_name: String, 
    last_name: String, 
    address: String,
    date_of_birth: String,
    department: String,
    doctor: String
});


var Patient = mongoose.model('Patients', patientSchema);


var errors = require('restify-errors');
var restify = require('restify')

// creating a restify server
, server = restify.createServer({name: SERVER_NAME})

if (typeof ipaddress === "undefined") {
	
    console.warn('No process.env.IP var, using default: ' + DEFAULT_HOST);
    ipaddress = DEFAULT_HOST;
};

if (typeof port === "undefined") {
    console.warn('No process.env.PORT var, using default port: ' + DEFAULT_PORT);
    port = DEFAULT_PORT;
};

 

server.listen(port, ipaddress, function() {
    console.log('Server %s listening at %s' , server.name, server.url)
    console.log('information of the patients:')
    console.log('********* /patients************')
    console.log('/patients/: id')
}
)

server

.use(restify.plugins.fullResponse())

.use(restify.plugins.bodyParser())

server.get('/patients', function (req, res, next){
    console.log('GET request: patient');

   
        console.log("--- Geting the requests")
        counterGetRequest = counterGetRequest + 1;
        console.log("---- countGetRequest:-----" + counterGetRequest);

        Patient.find({}).exec(function (error, result) {
            if (error) return next(new Error(JSON.stringify(error.errors)))
            res.send(result);
        
    });
})

// getting the patients by there id

server.get('/patients/:id', function (req, res, next) {
    console.log('GET request: patient/' + req.params.id);

    
    Patient.find({ _id: req.params.id }).exec(function (error, patient) {
      if (patient) {
       
        res.send(patient)
      } else {
        
        res.send(404)
      }
    })
  })

        //adding a patient into the server
server.post('/patients' , function (req, res, next){
    console.log('POST request: patient params=>' + JSON.stringify(req.params));
    console.log('POST request: patient body=>' + JSON.stringify(req.body));

    if (req.body.first_name == undefined) {
        return next(new errors.BadRequestError('name must be supplied'))
    }

    if (req.body.last_name == undefined) {
        return next(new errors.BadRequestError('price must be supplied'))
    }

    if (req.body.address == undefined) {
        return next(new errors.BadRequestError('catagory must e supplied'))
    }

        if (req.body.date_of_birth == undefined) {
            return next(new errors.BadRequestError('name must be supplied'))
        }
    
        if (req.body.department == undefined) {
            return next(new errors.BadRequestError('price must be supplied'))
        }
    
        if (req.body.doctor == undefined) {
            return next(new errors.BadRequestError('catagory must e supplied'))
    
}

var newPatient = new Patient( {

    first_name:  req.body.first_name,
    last_name: req.body.last_name,
    address: req.body.address,
    date_of_birth: req.body.date_of_birth,
    department: req.body.department,
    doctor: req.body.doctor

});

//creating a database for the patient

newPatient.save(function (error, result) {
      
    if (error) return next(new Error(JSON.stringify(error.errors)))
   
    res.send(201, result)
  })
})


server.get('/patients/:id/records', function (req, res, next) {
        patientRecordSave.find({ patient_id: req.params - id }, function (error, patientRecord) {
            res.send(patientRecord);
        })
    })
    


server.post('/patients/:id/records', function (req, res, next){

    if (req.params.bloodgroup == undefined) {
        return next(new errors.BadRequestError('blood group must be supplied'))
    }
    
    if (req.params.date_of_birth == undefined) {
        return next(new errors.BadRequestError('date of borth must be provided'))
    }

    if (req.params.heartrate == undefined) {
        return next(new errors.BadRequestError('please provide the heart arte value'))
    }

    if (req.params.bloodpressure == undefined) {
        return next(new errors.BadRequestError('please provide the blood pressure value'))
    }

    if (req.params.nurse == undefined) {
        return next(new errors.BadRequestError('please provide the nurse name'))
    }


    // input of patients record
    var newPatientRecord = {
        Patient_id: req.body.id,
        bloodgroup: req.body.bloodgroup,
        date_of_birth: req.body.date_of_birth,
        heartrate: req.body.heartrate,
        bloodpressure: req.body.bloodpressure,
        nurse: req.body.nurse
    }
    patientRecordSave.create( newPatientRecord,function(error, patientRecord) {

        if  (error) return next(new errors.BadRequestError(JSON.stringify(error.errors)))

     res.send(201,newPatientRecord)   
    })
})
    //deleting the user with given id

    server.del('/patients/:id', function (req, res, next){
        console.log('DEleting the patinet on user request : patinets/' + res.params.id);
        Patient.remove({ _id: req.params.id }, function (error, result) {

            if (error) return next(new Error(JSON.stringify(error.errors)))

            res.send()

        })
        
    })