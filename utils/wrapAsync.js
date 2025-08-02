module.exports=(fn)=>{   //wrap async function
    return (req,res,next)=>{
        fn(req,res,next).catch(next);
    }
}