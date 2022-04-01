const request = require("request"); // "Request" library

export default function handler(req, res) {
  const body = JSON.parse(req.body);

  console.log({ token: body.token });

  // use the access token to access the Spotify Web API
  var options = {
    url: "https://api.spotify.com/v1/search/jmperezperez",
    headers: {
      Authorization: "Bearer " + body.token,
    },
    json: true,
  };

  console.log({ options });
  request.get(options, function (error, response, body) {
    console.log(body);

    res.status(200).json(body);
  });
}
