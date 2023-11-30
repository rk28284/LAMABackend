const express = require("express");
const  projectModel =require("../model/project.model")
const projectRouter = express.Router();


// projectRouter.get("/", async (req, res) => {


//   const {query}=req.query.userEmail;
//   try {
//     const projects=await projectModel.find(query);
//     res.send(projects);
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({ message:"Something went wrong..Check Again"});
//   }
// });

projectRouter.post("/add", async (req, res) => {
  const payload = req.body;
  try {
    const newProject = new projectModel(payload);
    await newProject.save();
    res.send("Project created successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong..Check Again" });
  }
});

projectRouter.get("/:id", async (req, res) => {
  try {
    const {id} =req.params;
    const projects = await projectModel.findById(id);
    if (!projects) {
      res.status(404).send({ message:"Projects not found"});
    } else {
      res.send({projects});
    }
  } catch(error) {
    console.log(error.message);
    res.status(500).send({message:"Something went wrong"});
  }
});

projectRouter.patch("/update/:id", async (req, res) => {
  const {id}=req.params;
  const payload=req.body;
  try {
    const project=await projectModel.findById(id);
    const projectID_in_post=project.userID;
    const projectID_in_req =req.body.userID;
    if (projectID_in_post!==projectID_in_req) {
      res.status(401).send({ message:"You are not authorized to proceed projectID" });
    } else {
      await projectModel.findByIdAndUpdate(id, payload);
      res.send("Project Updated Successfully");
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message:"Something went wrong" });
  }
});

projectRouter.delete("/delete/:id",async (req, res) => {
  const {id} = req.params;
  try {
    const project = await projectModel.findById(id);
    const projectID_in_post =project.userID;
    const projectID_in_req =req.body.userID;
    if (projectID_in_post!==projectID_in_req) {
      res.status(401).send({ message: "You are not authorized to proceed.Try Again" });
    } else {
      await projectModel.findByIdAndDelete(id);
      res.send("Deleted post successfully");
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: "Something went wrong" });
  }
});


projectRouter.get("/search",async(req,res)=>{
  try {
    const query = req.query.value;
    const store = query.toLowerCase();
    console.log(query,store);
   let searchData=await projectModel.find({fileName:store})
   res.json(searchData)
  } catch (error) {
    res.status(500).json({ message: "something goes wrong", error: error.message });
  }
})

module.exports = {
  projectRouter
};
