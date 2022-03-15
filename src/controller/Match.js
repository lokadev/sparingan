const Match = require("../model/Match");
const User = require("../model/User");
const Sport = require("../model/Sport");

exports.read = (req,res) => {
  Match.find().then(Match => {
      res.status(200).json(Match)
  })
  .catch((err) => {
      res.status(500).send({
        message: err.message || "Error Occured",
      }); 
    });
}

exports.create = (req,res) => {
  try{
      Match.find({id_user:req.body.id_user}).then(user => {
        if(user.length == 0){
          const dataMatch = new Match({
            id_user: req.body.id_user,
            id_sport: req.body.id_sport,
            match_player: req.body.match_player,
            match_description: req.body.match_description,
            match_location: req.body.match_location,
            match_date: req.body.match_date,
            match_cost: req.body.match_cost,
          });

          dataMatch.save().then(data => {
            const success = {
              data,
              meta: {
                message: "Successfully to make Match"
              }
            }
            res.json(success)
          }).catch((err) => {
            res.status(500).send({
              message: "Failed to registred or Please fill out all the forms",
            });
          });

        }
      })
  }catch(err){
      console.log({message: err});
  }
}

exports.find = (req,res) => {
  try{
    Match.findById(req.params.id)
    .then(match => {
        if (!match) {
            return res.status(404).send({
              message: "Match not found with id " + req.params.id,
            });
          }
          User.findById(match.id_user).then(user => {
            Sport.findById(match.id_sport).then(sport => {
              const success = {
                match,
                user,
                sport
              }
              res.status(200).send(success);
            })
          })
    })
  }catch(err) {
      return res.status(500).send({
          message: "Error retrieving Match with id " + req.params.id,
        });
  }
}

exports.update = (req,res) => {
  Match.findByIdAndUpdate(req.params.id, req.body, { new: true })
  .then((match) => {
    if (!match) {
      return res.status(404).send({
        message: "no match found",
      });
    }
    const success = {
      match,
      meta:{
        message: "Successfully update"
      }
    }
    res.status(200).send(success);
  })
  .catch((err) => {
    return res.status(404).send({
      message: "error while updating the post",
    });
  });
}

exports.delete = (req, res) => {
  try{
    Match.findByIdAndRemove(req.params.id)
    .then(match => {
        if (!match){
            return res.status(404).send({
                message: "match not found ",
              });
        }
        res.send({ message: "match deleted successfully!" });
    })
  }catch(err) {
    return res.status(500).send({
        message: "Cannot delete match",
      });
  }
}