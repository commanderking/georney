const request = require("request"); // "Request" library

export default function handler(req, res) {
  const authOptions = {
    url: "https://accounts.spotify.com/api/token",
    headers: {
      Authorization:
        "Basic " +
        new Buffer(
          process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID +
            ":" +
            process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET
        ).toString("base64"),
    },
    form: {
      grant_type: "client_credentials",
    },
    json: true,
  };

  // 'https://api.spotify.com/v1/search?type=album&include_external=audio'

  request.post(authOptions, async (error, response, body) => {
    if (!error && response.statusCode === 200) {
      console.log({ body });
      await res.status(200).json(body);

      // use the access token to access the Spotify Web API
      var token = body.access_token;
      var options = {
        url: "https://api.spotify.com/v1/users/jmperezperez",
        headers: {
          Authorization: "Bearer " + token,
        },
        json: true,
      };

      console.log({ options });
      request.get(options, function (error, response, body) {
        console.log(body);
      });
    }

    if (error) {
      res.status(400).json();
    }
  });
}
