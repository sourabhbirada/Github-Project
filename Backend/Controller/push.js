const fs = require('fs').promises;
const path = require('path');


async function push() {
    const repopath = path.resolve(process.cwd(), ".privgit")
    const commitpath = path.join(repopath, "commit")
    const pushdir = path.resolve(repopath, "push")

    try {
        await fs.mkdir(pushdir, { recursive: true })
        const commitdirs = await fs.readdir(commitpath)
        for (const commitdir of commitdirs) {
            const commitdirpath = path.join(commitpath, commitdir)
            const checkfile = await fs.stat(commitdirpath)

            if (checkfile.isDirectory()) {
                const files = await fs.readdir(commitdirpath)
                for (const file of files) {
                    const filepath = path.join(commitdirpath, file)
                    await fs.copyFile(
                        filepath, path.join(pushdir, file)
                    )
                }
            } else if (checkfile.isFile()) {
                await fs.copyFile(commitdirpath, path.join(pushdir, commitdir))
            }
        }
        console.log("push sussefully");


    } catch (error) {
        console.log(error);

    }

}


module.exports = {
    push,
}