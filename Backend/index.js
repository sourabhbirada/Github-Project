const yargs = require('yargs');

const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { default: mongoose } = require('mongoose');
const cors = require('cors');
const http = require('http');

const { Server } = require('socket.io');


dotenv.config();


const {hideBin} = require('yargs/helpers')
const {init} = require('./Controller/git/init');
const { add } = require('./Controller/git/add'); 
const { commit } = require('./Controller/git/commit');
const { push } = require('./Controller/git/push');
const { pull } = require('./Controller/git/pull');
const userrouter = require('./Router/user')
const reporouter = require('./Router/repo');
const gitrepo = require('./Router/feature');
const Errorhandling = require('./middleware/errorhandling');
const cookieParser = require('cookie-parser');




yargs(hideBin(process.argv)).command("start" , "start the server" , start)
                            .command("init", "init for a new repo", {}, init)
                            .command("add <file>", "add file to staged area", 
                                (yargs) => {
                                    yargs.positional("file"  ,{
                                        describe:"file is add to stagged area",
                                        type:"string",
                                    })
                                }, (argv) => {
                                    add(argv.file)
                                })
                                .command(
                                    "commit <comment>",
                                    "Commit files successfully",
                                    (yargs) => {
                                        yargs.positional("comment", {
                                            describe: "Commit message",
                                            type: "string",
                                        });
                                    },
                                    async (argv) => {
                                        await commit(argv.comment);
                                    }
                                )
                            .command("push", "push succesfully" ,push)
                            .command("pull", "pull succesfully", {}, pull)
                            .demandCommand(1 , "where is cmd")
                            .help().argv;


function start() {
    const app = express();
    const PORT = process.env.PORT || 3000

    app.use(bodyParser.json())
    app.use(cookieParser());
    app.use(express.urlencoded({extended:true}))
    app.use(express.json())
    app.use(cors({ origin :"https://github-project-lake.vercel.app" , 
        credentials:true
    }))
    app.use( '/uploads' , express.static('uploads'))
    

    const Mongo_url = process.env.MONGODB_URL

    

    mongoose.connect(Mongo_url , { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log("connted DB"))
                               .catch((err) => console.log(err))


    app.use('/' , userrouter )
    app.use('/' , reporouter)
    app.use('/feature' , gitrepo)


    app.use(Errorhandling)



    const httpServer = http.createServer(app);
    const io = new Server(httpServer , {
        cors: {
            origin: "*",
            methods: ["GET" , "POST"],
        }
    })

    io.on("connection" , (socket) => {
        socket.on("joinroom" , (userid) => {
            user = userid,
            console.log("===");
            console.log(user);
            console.log("===");
            socket.join(userid)
        })
    })

    const db = mongoose.connection

    db.once("open" , async () => {
        console.log("DB called");
        
    })
    
    httpServer.listen(PORT, () => {
        console.log("Server started");
        
    })
}