/*!
GPII Linux Personalization Framework Node.js Bootstrap

Copyright 2014 RFT-US
Copyright 2014 Inclusive Design Research Centre, OCAD University.

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt

Author:  Steven Githens
Author:  Joseph Scheuhammer

*/

/* global module */
/* jshint strict: false */

module.exports = function(grunt) {
    var usbListenerDir = "./usbDriveListener";

    function nodeGypCompileShell(dir) {
        return {
            options: {
                stdout: true,
                stderr: true,
                execOptions: {
                    cwd: dir
                }
            },
            command: function() {
                return "node-gyp configure build"; 
            }
        };
    }

    function nodeGypCleanShell(dir) {
        return {
            options: {
                stdout: true,
                stderr: true,
                execOptions: {
                    cwd: dir
                }
            },
            command: function() {
                return "node-gyp clean";
            }
        };
    }

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        shell: {
            compileGSettings: nodeGypCompileShell("node_modules/gsettingsBridge/nodegsettings"),
            cleanGSettings: nodeGypCleanShell("node_modules/gsettingsBridge/nodegsettings"),
            compileAlsaBridge: nodeGypCompileShell("node_modules/alsa/nodealsa"),
            cleanAlsaBridge: nodeGypCleanShell("node_modules/alsa/nodealsa"),
            compileXrandrBridge: nodeGypCompileShell("node_modules/xrandr/nodexrandr"),
            cleanXrandrBridge: nodeGypCleanShell("node_modules/xrandr/nodexrandr"),
            installUsbLib: {
                options: {
                    stdout: true,
                    stderr: true
                },
                command: [
                    "sudo cp " + usbListenerDir + "/gpii-usb-user-listener /usr/bin/",
                    "sudo cp " + usbListenerDir + 
                        "/gpii-usb-user-listener.desktop /usr/share/applications/"
                ].join("&&")
            },
            uninstallUsbLib: {
                options: {
                    stdout: true,
                    stderr: true
                },
                command: [
                    "sudo rm /usr/bin/gpii-usb-user-listener",
                    "sudo rm /usr/share/applications/gpii-usb-user-listener.desktop" 
                ].join("&&")
            },
            startGpii: {
                options: {
                    stdout: true,
                    stderr: true
                },
                command: function() {
                    return "node gpii.js";
                }
            }
        },
        jshint: {
          sources: {
            src: ["gpii.js", "node_modules/**/*.js"],
            filter: function(filepath) {
                return ( (filepath.indexOf ("grunt") === -1) &&
                         (filepath.indexOf ("linuxDeviceReporter") === -1));
            }
          },
          buildScripts: ["Gruntfile.js"],
          options: {
            jshintrc: true
          }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-jshint");

    grunt.registerTask("build", "Build the entire GPII", function() {
        grunt.task.run("gpiiUniversal");
        grunt.task.run("shell:compileGSettings");        
        grunt.task.run("shell:compileAlsaBridge");        
        grunt.task.run("shell:compileXrandrBridge");        
    });

    grunt.registerTask("clean", "Clean the GPII binaries and uninstall", function() {
        grunt.task.run("shell:cleanGSettings");
        grunt.task.run("shell:cleanAlsaBridge");
        grunt.task.run("shell:cleanXrandrBridge");
    }); 

    grunt.registerTask("start", "Start the GPII", function() {
        grunt.task.run("shell:startGpii");
    });

    grunt.registerTask("install", "Install system level GPII Components", function() {
        grunt.task.run("shell:installUsbLib");
    });

    grunt.registerTask("uninstall", "Uninstall system level GPII Components", function() {
        grunt.task.run("shell:uninstallUsbLib");
    });
};
