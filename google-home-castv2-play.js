const Client = require("castv2-client").Client;
const DefaultMediaReceiver = require("castv2-client").DefaultMediaReceiver;
const mdns = require("mdns-js");

const play = function (deviceName, mp3Url, mp3Title, callback) {
  const browser = mdns.createBrowser(mdns.tcp("googlecast"));
  mdns.excludeInterface("0.0.0.0");

  browser.on("ready", function () {
    console.log("ready");
    browser.discover();
  });

  browser.on("update", function (service) {
    if (
      service.fullname != undefined &&
      service.fullname.includes(deviceName)
    ) {
      console.log(
        'found device "%s" at %s:%d',
        service.fullname,
        service.addresses[0],
        service.port
      );
      ondeviceup(service.addresses[0], mp3Url, mp3Title, function (res) {
        callback(res);
      });
      browser.stop();
    }
  });
};

function ondeviceup(host, mp3Url, mp3Title, callback) {
  const client = new Client();

  client.connect(host, function () {
    console.log("connected, launching app ...");

    client.launch(DefaultMediaReceiver, function (err, player) {
      if (err) {
        callback(err);
        return;
      }

      const media = {
        contentId: mp3Url,
        contentType: "audio/mp3",
        streamType: "LIVE", // BUFFERED or LIVE

        metadata: {
          type: 0,
          metadataType: 0,
          title: mp3Title,
        },
      };

      player.on("status", function (status) {
        console.log("status broadcast playerState=%s", status.playerState);
      });

      console.log(
        'app "%s" launched, loading media %s ...',
        player.session.displayName,
        media.contentId
      );

      player.load(media, { autoplay: true }, function (err, status) {
        if (err) {
          callback(err);
        } else {
          console.log("media loaded playerState=%s", status.playerState);
          callback(status.playerState);
        }
      });
    });
  });

  client.on("error", function (err) {
    console.log("Error: %s", err.message);
    client.close();
    callback("error");
  });
}

exports.play = play;
