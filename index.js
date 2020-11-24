const Twit = require("twit");
const fs = require("fs");
const path = require("path");
const CronJob = require("cron").CronJob;
const config = require(path.join(__dirname, "config.js"));

const T = new Twit(config);

const job = new CronJob('0 9 * * *', function() {
    T.get(
      "account/verify_credentials",
      {
        include_entities: false,
        skip_status: true,
        include_email: false,
      },
      onAuthenticated
    );

    function onAuthenticated(err, res) {
      if (err) {
        throw err;
      }
      console.log("auth successful. running bot");

      function randomImageArr(images) {
        return images[Math.floor(Math.random() * images.length)];
      }

      function tweetImage() {
        fs.readdir(__dirname + "/imgs/", function (err, files) {
          if (err) {
            console.log("error: ", err);
          } else {
            let images = [];
            files.forEach(function (f) {
              images.push(f);
            });
            console.log("opening image");

            const imagePath = path.join(
                __dirname,
                "/imgs/" + randomImageArr(images)
              ),
              b64content = fs.readFileSync(imagePath, { encoding: "base64" });

            console.log("uploading image");

            T.post("media/upload", { media_data: b64content }, function (
              err,
              data,
              response
            ) {
              if (err) {
                console.log("error: ", err);
              } else {
                console.log("image uploaded, tweeting it..");

                T.post(
                  "statuses/update",
                  {
                    media_ids: new Array(data.media_id_string),
                  },
                  function (err, data, response) {
                    if (err) {
                      console.log("error: ", err);
                    } else {
                      console.log("posted image!");
                    }
                  }
                );
              }
            });
          }
        });
      }
    }
  },  null,  true, "America/Los_Angeles"
);
job.start();
