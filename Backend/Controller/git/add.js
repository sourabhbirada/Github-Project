const path = require('path');
const fs = require('fs').promises;


async function add(filepath) {
    const repopath = path.resolve(process.cwd() , ".privgit")
    const stagging = path.join(repopath , "stagginh")

    try {
        await fs.mkdir(stagging , {recursive:true})
        const filename = path.basename(filepath)
        await fs.copyFile(filename , path.join(stagging , filename))

        console.log("file add to staggin area");
        

        
    } catch (error) {

        console.log(error);
        
        
    }
    
}


module.exports = {
    add,
}