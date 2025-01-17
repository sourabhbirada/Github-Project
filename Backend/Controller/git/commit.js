const fs = require('fs/promises');
const path = require('path');
const {v4:uuidv4} = require('uuid');



async function commit(comment) {
    const repopath = path.resolve(process.cwd() , ".privgit")
    const stagginpath = path.join(repopath , "stagginh")
    const commitpath = path.join(repopath , "commit")

    try {
        const commitId = uuidv4();
        const commitdir = path.join(commitpath , commitId)

        await fs.mkdir(commitdir , {recursive:true})

        const allfiles = await fs.readdir(stagginpath)

        for(const file of allfiles){
            await fs.copyFile(
                path.join(stagginpath , file),
                path.join(commitdir , file)
            )
        }
        await fs.writeFile(
            path.join(commitdir, "commit.json"),
            JSON.stringify({ comment, date: new Date().toISOString() })
        );

        console.log("commit sucesufull");
        

    } catch (error) {
        console.log(error);
        
    }
    
}


module.exports = {
    commit,
}