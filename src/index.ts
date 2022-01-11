import dotenv from "dotenv";
import tmi from "tmi.js";
import apiService from "./api-service";

dotenv.config();

// Define configuration options
if (!process.env.CHANNEL_NAME) {
  process.exit(1);
}

const opts: tmi.Options = {
  identity: {
    username: process.env.BOT_USERNAME,
    password: process.env.OAUTH_TOKEN,
  },
  channels: [process.env.CHANNEL_NAME],
};

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on("message", onMessageHandler);
client.on("connected", onConnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onMessageHandler(
  target: string,
  context: tmi.ChatUserstate,
  msg: string,
  self: boolean
) {
  if (self) {
    return;
  }

  const commandName = msg.trim();

  const matched = commandName.match("(點:|點：).*");
  if (matched == null) return;

  const [, m] = matched;
  console.log("debug", matched);
  const sr = commandName.replace(m, "").trim();
  apiService
    .create(sr)
    .then(() => console.log("success"))
    .catch((err) => console.error("create-error", err));
}

function onConnectedHandler(addr: string, port: number) {
  console.log(`* Connected to ${addr}:${port}`);
}
