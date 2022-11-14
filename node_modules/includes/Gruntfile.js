module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        jshint: {
            all: [
                "*.js",
                "src/*.js",
                "spec/*.js",
                "!src/includes.min.js"
            ]
        },
        watch: {
            files: [
                "*.js",
                "src/*.js",
                "spec/*.js",
                "!src/includes.min.js"
            ],
            tasks: ["test"]
        },
        jasmine: {
            src: "src/includes.js",
            options: {
                specs: "spec/spec.js",
                vendor: "node_modules/functional.js/functional.min.js"
            }
        },
        uglify: {
            my_target: {
                files: {
                    "src/includes.min.js": [
                        "src/includes.js"
                    ]
                }
            },
            options: {
                banner: "/*!\n    " +
                        "<%= pkg.name %> (v<%= pkg.version %>) <%= grunt.template.today('dd-mm-yyyy') %>\n    " +
                        "(c) <%= pkg.author %>\n" +
                        "*/\n"
            }
        }
    });
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-jasmine");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.registerTask("test", ["jshint", "uglify", "jasmine"]);
};