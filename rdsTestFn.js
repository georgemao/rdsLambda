//https://github.com/mysqljs
var mysql      = require('mysql');
var fs = require('fs');
var AWS = require('aws-sdk');
var mysql2 = require('mysql2');

exports.handler = (event, context, callback) => {

    console.log("Starting query ...");
    
    var token;
    
    if(process.env['useIAM'] == 1){
        console.log("Using IAM Auth");
        var signer = new AWS.RDS.Signer({
          //credentials: new AWS.SharedIniFileCredentials({profile: 'default'}),
          region: 'us-west-2',
          hostname: 'myaurorards.cvbjqjhsfcqp.us-west-2.rds.amazonaws.com',
          port: 3306,
          username: 'rds_user'
        });
        
        token = signer.getAuthToken({
          // these options are merged with those defined when creating the signer, overriding in the case of a duplicate option
          // credentials are not specified here or when creating the signer, so default credential provider will be used
          username: 'rds_user' // overriding username
        });
        
        console.log ("Token obtained: " + token);
        
    }
    
    /*
    var connection = mysql.createConnection({
      host     : process.env['endpoint'],
      user     : process.env['user'],
      password : process.env['password'],
      database : process.env['my_db']
    });
    */
    
    var connection;
    
    if(process.env['useIAM'] != 1){
    	// For SSL: https://github.com/mysqljs/mysql#ssl-options
    	connection = mysql.createConnection({
          host     : process.env['endpoint'],
          user     : process.env['user'],
          password : process.env['password'],
          database : process.env['my_db'],
    	  ssl	   : { 
    	      ca : fs.readFileSync('./rds-combined-ca-bundle.pem')
    	  }
        });
    }
    else{
        console.log("running iam auth ... ");
        
        var connectionConfig = {
          //insecureAuth:true,
          host: process.env['endpoint'],
          user: 'rds_user',
          database: process.env['my_db'],
          ssl: {
            ca: fs.readFileSync('./rds-combined-ca-bundle.pem')
          },
          password: token
          /*authSwitchHandler: function ({pluginName, pluginData}, cb) {
              console.log("@@@@@@@@");
          }*/
        };
        

        connectionConfig.authSwitchHandler = (data, cb) => {
            console.log("!!!!!!!!!!!!");
            if (data.pluginName === 'mysql_clear_password') {
              // https://dev.mysql.com/doc/internals/en/clear-text-authentication.html
              console.log("pluginName: "+data.pluginName);
              var password = token + '\0';
              var buffer = Buffer.from(password);
              cb(null, password);
            }
        };
        
        
        connection = mysql2.createConnection(connectionConfig);
    }
    
    

    connection.connect(function(err) {
	  if (err) {
	    console.error('error connecting: ' + err.stack);
	    return;
	  }
	 
	  console.log('connected as id ' + connection.threadId);
	});

    /*connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
	  if (error) throw error;
	  console.log('The solution is: ', results[0].solution);
	});
	*/

	connection.query('SELECT * FROM Employees', function (error, results, fields) {
	  if (error) 
	  	throw error;
	  console.log("Results:  " +  results.length);

	  if(results.length > 0){
	  	console.log('Record: ', results[0].fname + ' ' + results[0].lname);
	   }
	   
	   connection.end(function(error, results) {
    	  // The connection is terminated now 
    	  console.log("Connection ended");
    	  callback(null, 'Success!');
    	});
	});
	 
};