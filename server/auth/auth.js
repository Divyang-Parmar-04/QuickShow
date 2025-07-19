const {clerkClient} = require('@clerk/express')

async function protectAdmin(req,res,next) {
    try {
        const {userId} = req.body

        const user = await clerkClient.users.getUser(userId)
        if(user.privateMetadata.role!=='admin'){
            return res.json({msg:"success"})
        }
        
        next();
        
    } catch (error) {
        console.log(error)
        return res.json({msg:"ERROR"})
    }
}
module.exports = protectAdmin;