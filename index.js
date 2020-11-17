const config = require("./config");
const Twit = require("twit");

const T = new Twit(config);

T.get("account/verify_credentials", {
    include_entities: false,
    skip_status: true,
    include_email: false,
  }, onAuthenticated);

function onAuthenticated(err, res) {
  if (err) {
    throw err;
  }
  console.log("auth successful. running bot");

  var b64content = fs.readFileSync('/path/to/img', { encoding: 'base64' })
 


// first we must post the media to Twitter
T.post('media/upload', { media_data: b64content }, function (err, data, response) {
  // now we can assign alt text to the media, for use by screen readers and
  // other text-based presentations and interpreters

  var mediaIdStr = data.media_id_string
  var altText = ""
  var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }
 
  T.post('media/metadata/create', meta_params, function (err, data, response) {
    if (!err) {
      // now we can reference the media and post a tweet (media will attach to the tweet)
      // include post name? and attribution from unsplash
      var params = { status: '', media_ids: [mediaIdStr] }
 
      T.post('statuses/update', params, function (err, data, response) {
        console.log(data)
      })
    }
  })
})

}
