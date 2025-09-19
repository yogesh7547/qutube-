const asyncHandler=(requestHandler)=>{
    return (req, res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).catch((err)=next(err))
    }
}

export {asyncHandler}















// higher-order function (a function that takes another function as input and returns a new function) designed to handle async/await errors in Express.js routes automatically.



//FLOW
// 1. Route called: app.get('/users/:id', asyncHandler(yourAsyncFunction))

// 2. Express calls: wrappedFunction(req, res, next)

// 3. wrappedFunction calls: Promise.resolve(yourAsyncFunction(req, res, next))

// 4a. If success: Response sent normally
// 4b. If error: .catch() triggers → next(error) → Error middleware handles it



 //.catch((err) => next(err))
        // ^^^       ^^^^^^^^
        //  |         |
        //  |         └─ Pass error to Express error handler
        //  └─ The error that was thrown




















// const asyncHandler=()=>{}
// const asyncHandler=(func)=>()=>{}
// const asyncHandler=(func)=>async()=>{}


// const asyncHandler=(fn)=>async(req, res, next)=>{
//     try {
//         await fn(req, res, next)
//     } catch (error) {
//         res.status(error.code || 500).json({
//             success:false,
//             message:error.message
//         })
//     }
// }