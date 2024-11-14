import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {

    const {token} = req.headers ;

        if(!token){
            return res.json({
                success: false,
                message: "No token provided"
            })
        }

      try {
         
        const tokenDecod = jwt.verify(token, process.env.JWT_SECRET);

        req.body.userId = tokenDecod.id;


        next();
    } catch (error) {
        res.status(401).json({ error: "Unauthorized" });
    }
};

export default authUser