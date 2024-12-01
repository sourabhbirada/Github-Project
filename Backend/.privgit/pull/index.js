const yargs = require('yargs');

const {hideBin} = require('yargs/helpers')
const {init} = require('./Controller/init');
const { add } = require('./Controller/add');
const { commit } = require('./Controller/commit');
const { push } = require('./Controller/push');
const { pull } = require('./Controller/pull');


yargs(hideBin(process.argv)).command("init", "init for a new repo", {}, init)
                            .command("add <file>", "add file to staged area", 
                                (yargs) => {
                                    yargs.positional("file"  ,{
                                        describe:"file is add to stagged area",
                                        type:"string",
                                    })
                                }, (argv) => {
                                    add(argv.file)
                                })
                            .command("commit <comment>", "commit succesfully", (yargs) =>{
                                yargs.positional('comment' , {
                                    describe:"to upgread stagged",
                                    type:"string"
                                })
                            }, commit)
                            .command("push <repo>", "push succesfully", (yargs) =>{
                                yargs.positional('repo' , {
                                    describe:"to pull a repo",
                                    type:"string"
                                })
                            }, push)
                            .command("pull", "pull succesfully", {}, pull)
                            .demandCommand(1 , "where is cmd")
                            .help().argv;


