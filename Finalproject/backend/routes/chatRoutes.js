require("dotenv").config();
const express = require("express");
const router = express.Router();

const Course = require("../models/Course");
const { auth, userOnly } = require("../middleware/auth");


router.post("/", auth,userOnly, async(req,res)=>{

    try {
        const {message} = req.body;

        const courses = await Course.find();
        const courselist = courses.map((x)=>{
            return `${x.name} - ₹ ${x.price}`;
        }).join("\n");

        const {default:Groq} = await import("groq-sdk");
        const groq = new Groq({
            apiKey:process.env.GROQ_API_KEY
        });

        const completion = await groq.chat.completions.create({
            model:process.env.GROQ_MODEL || "openai/gpt-oss-20b",
            messages:[
                {
                    role:"system",
                    content:`
                    
                    your job:
                    1.recommand sutitable course
                    2.help students choose technologies
                    3.suggesst carrer path
                    4.suggest projects
                    5.courses  realted question answeer

                    available course: ${courselist}
                    `
                },

                {
                    role:"user",
                    content:message
                }
            ]

        });

        const reply = completion.choices[0]?.message?.content;
        res.json({reply:reply})

        
    } catch(err){
        console.log(err);

    }
});

module.exports = router;