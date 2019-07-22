import {
    MatrixClient,
    SimpleFsStorageProvider,
    AutojoinRoomsMixin,
} from "matrix-bot-sdk";

const homeserverUrl = "https://matrix.bpulse.org";
const accessTokens = {
    client1: "MDA...KMDA...",
    client2: "MDA...KMDA...",
    client3: "MDA...KMDA...",
    client4: "MDA...KMDA...",
};    

const test_room_id = '!cPzJFAuMmgYvdupPAd:bpulse.org';
var client1userid = "@client1:bpulse.org";
const badword = "badword";

const client1 = new MatrixClient(homeserverUrl, accessTokens.client1, new SimpleFsStorageProvider("client1.json"));

AutojoinRoomsMixin.setupOnClient(client1);
client1.on("room.message", (roomId, event) => {
    if (!event["content"] || event["content"]["msgtype"] !== "m.text") return;
    if (event["sender"] === client1userid) return;
    if (event['origin_server_ts'] < (new Date()).valueOf() - 1000) return;
    const body = event["content"]["body"];
    if (!body) return;
    if (body.indexOf("keyword") !== -1){
        client1.sendMessage(roomId, {
            "msgtype": "m.text",
            "body": `${badword}`
        });
    } 
});
client1.start().then(() => console.log("Client1 started!"));

const client2 = new MatrixClient(homeserverUrl, accessTokens.client2, new SimpleFsStorageProvider("client2.json"));
AutojoinRoomsMixin.setupOnClient(client2);
client2.start().then(() => console.log("Client2 started!"));

async function client2baitsclient1() {
    console.log("client2baitsclient1");
    const members = await client2.getJoinedRoomMembers(test_room_id);
    if (members.includes(client1userid)) {
        client2.sendMessage(test_room_id, {
            "msgtype": "m.text",
            "body": "keyword"
        });
    }
    setTimeout(client2baitsclient1, 5000);
   
}

setTimeout(client2baitsclient1, 5000);
const client3 = new MatrixClient(homeserverUrl, accessTokens.client3, new SimpleFsStorageProvider("client3.json"));
AutojoinRoomsMixin.setupOnClient(client3);
client3.on("room.message", (roomId, event) => {
    if (!event["content"] || event["content"]["msgtype"] !== "m.text") return;
    const body = event["content"]["body"];
    if (!body) return;
    if (body.indexOf(badword) !== -1){
        client3.kickUser(event["sender"], roomId, "no!")
            .then(() => {
                client3.sendMessage(roomId, {
                    "msgtype": "m.text",
                    "body": `please don't say that in here`
                });
                setTimeout(client4invitesclient1, 6000);
            });
    } 
});
client3.start().then(() => console.log("Client3 started!"));

const client4 = new MatrixClient(homeserverUrl, accessTokens.client4, new SimpleFsStorageProvider("client4.json"));
AutojoinRoomsMixin.setupOnClient(client4);
async function client4invitesclient1() {
    console.log("client4invitesclient1");
    const members = await client4.getJoinedRoomMembers(test_room_id);
    if (! members.includes(client1userid)) {
        client4.inviteUser(client1userid, test_room_id);
    } else {
        setTimeout(client4invitesclient1, 6000);
    }
    
    //setTimeout(client2baitsclient1, 8000);
}
client4invitesclient1();
client4.start().then(() => console.log("Client4 started!"));