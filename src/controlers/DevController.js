const axios = require('axios');
const Dev = require('../models/Dev');
const pasreStringAsArray = require('../utils/parseStringAsArray');

module.exports = {
  async index(request, response) {
    const devs = await Dev.find();

    return response.json(devs);
  },

  async store(request, response) {
    const { github_username, techs, latitude, longitude } = request.body;

    let dev = await Dev.findOne({ github_username });

    if (!dev) {
      const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);

      const { name = login, avatar_url, bio } = apiResponse.data;

      const techsArray = pasreStringAsArray(techs);

      const location = {
        type: 'Point',
        coordinates: [longitude, latitude]
      };

      dev = await Dev.create({
        github_username,
        name,
        avatar_url,
        bio,
        techs: techsArray,
        location
      })
    }

    return response.json(dev);
  },

  async update(request, response) {
    const { github_username, techs, latitude, longitude } = request.body;
    
    let dev = await Dev.findOne({ github_username });
    
    if (!dev) {
      
      return console.log("Teeeste");

    } else {

      const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);

      const { name = login, avatar_url, bio } = apiResponse.data;

      const techsArray = pasreStringAsArray(techs);

      const location = {
        type: 'Point',
        coordinates: [longitude, latitude]
      };

      
      dev = await Dev.findByIdAndUpdate({github_username},
        {$set:{          
          name: name, 
          avatar_url: avatar_url, 
          bio: bio,
          techs: techsArray,
          location: location }}, {
            new: true
          }
        );
    }

    return response.json(devs);
  },

  async destroy(request, response) {
    const { github_username } = request.query;
    const dev = await Dev.findOne({ github_username });

    if (!dev) {
      return alert("Dev not found")
    } else {
      await Dev.findOne({ github_username }).remove()
      const devs = await Dev.find();
      return response.json(devs);   
    }

  },
};