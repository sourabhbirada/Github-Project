const path = require('path');
const fs = require('fs').promises;


async function pull() {
    const repopath = path.resolve(process.cwd() , ".privgit")
    const pushpath = path.join(repopath , "push")
    const pulldir = path.join(repopath , "pull")

    try {

        await fs.mkdir(pulldir , {recursive:true})
        const files = await fs.readdir(pushpath)
        for(const file of files){
            await fs.copyFile(
                path.join(pushpath , file) , 
                path.join(pulldir , file)
            )
        }

        console.log("pull successfull");
        
        
    } catch (error) {
        console.log(error);
        
    }
    
}


module.exports = {
    pull,
}