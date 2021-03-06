/*jslint unparam: true */
/*jshint strict: true, -W097, unused:false,  undef:true, devel:true */
/*global window, document, d3, $, io, navigator, setTimeout */

/**
 * SparkFun Inventor's Kit for Edison
 * Experiment 6 - Part 2: Phone RGB LED
 * This sketch was written by SparkFun Electronics
 * November 9, 2015
 * https://github.com/sparkfun/Inventors_Kit_For_Edison_Experiments
 *
 * Runs as a web app on a smartphone. Creates a socket.io connection to the
 * Edison and sends RGB values.
 *
 * Released under the MIT License(http://opensource.org/licenses/MIT)
 */

// Connect to Edison server with socket.io
function connectIP() {
    
    // Put in strict mode to restrict some JavaScript "features"
    "use strict" ;
    
    // Declare our variables at the beginning of the scope
    var scoket;
    var ipEl = $('#ip_address');
    var portEl = $('#port');
    var connectionEl = $('#connection');
    var rgbEl = $('#rgb');
    var colorSelectorEl = $('#colorSelector');
    
    // Attach a socket.io object tot he main window object. We do this to avoid
    // a global socket variable, as we will need it in the colorPicker callback.
    window.socket = null;

    // Connect to Edison
    console.log("Connecting to: " + ipEl.val() + ":" + portEl.val());
    window.socket = io.connect("http://" + ipEl.val() + ":" + portEl.val());
        
    // If we don't have a connection, disconnect and hide the RGB selector
    window.socket.on('connect_error', function() {
        window.socket.disconnect();
        alert("Could not connect");
        rgbEl.fadeOut();
    });
    
    // If we do have a connection, make the RGB selector appear
    window.socket.on('connect', function() {
        rgbEl.fadeIn();
        colorSelectorEl.trigger('click');
    });
}

// Short for jQuery(document).ready() method, which is called after the page
// has loaded. We can use this to assign callbacks to elements on the page.
$(function() {
    "use strict" ;
    
    // Assign a callback to the "Connect" port
    $('#send_ip_port').on('click', function(){
        connectIP();
    });

    // Assign initial properties to the color picker element
    $('.color').colorPicker({
        opacity: false,
        preventFocus: true,
        color: 'rgb(0, 0, 0)',
        
        // This is called every time a new color is selected
        convertCallback: function(colors, type) {
            if (window.socket && window.socket.connected) {
                window.socket.emit('color', colors.RND.rgb);
            }
        }
    });
});