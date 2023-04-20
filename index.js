const express = require("express");
const Moralis = require("moralis").default;
const discord = require("discord.js");
require("dotenv").config();
const app = express();
const port = 8000;

const client = new discord.Client({
  intents: [discord.GatewayIntentBits.Guilds],
  restRequestTimeout: 60000
});

client.login(process.env.PASS);

client.once(discord.Events.ClientReady, c => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});
//  const channel = client.channels.cache.get(process.env.CHANNEL);
//  console.log(channel, 'client')
// console.log(client,'client')
// client.user.setStatus('online');


app.use(express.json());

app.post("/webhook", async (req, res) => {
  const {
    body,
    headers
  } = req;

  try {
    // Moralis.Streams.verifySignature({
    //   body,
    //   signature: headers["x-signature"],
    // });


    let erc20TransfersList = body.erc20Transfers;
    console.log(erc20TransfersList, 'body')

    // if (erc20TransfersList?.length != 0) {
    //   return res.status(200).json();
    // }
    const channel = await client.channels.fetch(process.env.CHANNEL);
    console.log(channel, 'client')

    erc20TransfersList.map(item => {
      let msg = `from:${item.from} to: ${item.to} value:${Number(item.value / item.tokenDecimals)} ${item.tokenSymbol} \n`
      console.log(msg, 'msg', )

      channel.send(msg).catch((e) => console.log(e, 'error'));;

    })


    return res.status(200).json();
  } catch (e) {
    console.log("Not Moralis", e);
    return res.status(400).json();
  }
});

Moralis.start({
  apiKey: process.env.APIKEY,
}).then(() => {
  app.listen(port, () => {
    console.log(`Listening to streams`);
  });
});