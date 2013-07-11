#!/usr/bin/env node

/* Automatically grade files for the presence of specified HTML tage/attributes.
Uses commander.js and cheerio. Teaches command line application dev and basic DOM
parsin */

var fs = require('fs');
var util = require('util');
var program = require('commander');
var rest = require('restler');
var cheerio = require('cheerio');
var URL_DEFAULT = "http://arcane-sierra-2511.herokuapp.com/";
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";



var assertFileExists = function(infile){
    var instr = infile.toString();
    if(!fs.existsSync(instr)){
	console.log("%s does not exist. Exiting.", instr);
	process.exit(1);
    }
    return instr;
};

var cheerioHtmlFile = function(htmlfile){
    return cheerio.load(fs.readFileSync(htmlfile));
};


var loadChecks = function(checksfile){
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile){
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks){
	var present = $(checks[ii]).length > 0;
	out[checks[ii]] = present;
    }
    return out;
};

var clone = function (fn){
    return fn.bind({});
};

var makehtmlfile = function(result, response){
	var htmlfile = "temp.html"
	if(result instanceof Error){
	    console.error('Error: ' + util.format(response.message));
	}else{
//	    console.error("Wrote %s", htmlfile);
	fs.writeFileSync(htmlfile, result);
	}

    var checkJson = checkHtmlFile("temp.html", program.checks);   
    var outJson = JSON.stringify(checkJson, null,4);
    console.log(outJson);
    
};


if(require.main == module){
    program
	.option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
	.option('-f, --file <html_file>', 'path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
	.option('-u, --url <url>', 'url to html.') 
	.parse(process.argv);
        
    if(program.url){
	rest.get(program.url).on('complete', makehtmlfile);
  
    }else{
	var checkJson = checkHtmlFile(program.file, program.checks);   
	var outJson = JSON.stringify(checkJson, null, 4);
	console.log(outJson);
    }

}else{
    exports.checkHtmlFile = checkHtmlFile;
}
