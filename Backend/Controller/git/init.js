const path = require('path');
const fs = require('fs').promises;



async function init() {
    const repopath = path.resolve(process.cwd() , ".privgit")
    const commitpath = path.join(repopath , "commit")

    try {

        await fs.mkdir(repopath , {recursive:true})
        await fs.mkdir(commitpath , {recursive:true})
        fs.writeFile(
            path.join(repopath , "config.json"),
            JSON.stringify({bucket : process.env.S3_amazon})
        )
        console.log("repo init done");
        
    } catch (error) {
        console.log("error" , error);   
    }
}


module.exports = {
    init
}