// Copyright (c) 2015 Randy Westlund, All rights reserved.
// This code is under the BSD-2-Clause license.

'use strict';
var Xbee = require('./digimesh');

// connect to xbee
var xbee = new Xbee({ device: '/dev/cu.usbserial-A50056U4', baud: 115200 }, function() {
    console.log('xbee is ready');

    console.log('getting node identifier...');
    // ask for node identifier string
    xbee.get_ni_string(function(err, data) {
        if (err) return console.err(err);
        console.log("my NI is '" + data.ni + "'");

        console.log('scanning for nodes on the network...');
        xbee.discover_nodes(function(err, nodes) {
            if (err) return console.err(err);
            console.log('%d nodes found:', nodes.length);
            console.dir(nodes);

            // if we found anyone
            if (nodes.length) {
                console.log("saying 'hello' to node %s...", nodes[0].addr);
                xbee.send_message({
                    data: new Buffer("hello"),
                    addr: nodes[0].addr,
                    broadcast: false,
                },
                // callback
                function(err, data) {
                    if (err) return console.error(err);
                    // print the string status message for the status we got back
                    console.log('delivery status: %s',
                        xbee.DELIVERY_STATUS_STRINGS[data.status]);
                    console.dir(data);
                    // console.log('goodbye');
                    // process.exit(0);
                });
            }
        });
    });
});

xbee.on('error', function(err) {
    console.error(err);
    //process.exit(1);
});

xbee.on('message_received', function(data) {
  //var hexout = hex_to_ascii(data.data);

  var length = data.data.length;
  var outstring = "";
  switch (length) {
    case 5:

      for(var i = 0;i<data.data.length;i++){
        //console.log(data.data[i]+" "+data.data[i].toString(16));
        var char = data.data[i].toString(16);
        //console.log(typeof char);
        if(typeof char === 'string'){
          outstring +=char;
        };

        //console.log(outstring);
        //console.log(data.data[i].toString(16));
      }
      console.log('received a message from %s with data: %s', data.addr,outstring);
      break;
    default:
      console.log('received a message from %s with data: %s', data.addr,data.data);
  }

  //console.log(parseInt(data.data, 16));
  //var newData = new Buffer(4);
  // xbee.at_command_helper("DB",function(data2){
  //   console.log(data2);
  // })
  //console.dir(data);
});

function hex_to_ascii(str1)
 {
    var hex  = str1.toString();
    var str = '';
    for (var n = 0; n < hex.length; n += 2) {
        str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
    }
    return str;
 }
//13A20040EA26ED   13A20040E87BF8
//7E 0020 11 01 0013A20040E87BF8 FFFE E6 E6 0014 C105 00 00 0013A20040EA26ED 0028 03E8 EB
//00 13 A2 00 40 EA 26 ED 00 28 03 E8   03 E8 00 00 00 0A 28 37 36
