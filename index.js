"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var matrix_bot_sdk_1 = require("matrix-bot-sdk");
var homeserverUrl = "https://matrix.bpulse.org";
var accessTokens = {
    client1: "MDA...KMDA...",
    client2: "MDA...KMDA...",
    client3: "MDA...KMDA...",
    client4: "MDA...KMDA..."
};
var test_room_id = '!cPzJFAuMmgYvdupPAd:bpulse.org';
var client1userid = "@client1:bpulse.org";
var badword = "badword";
var client1 = new matrix_bot_sdk_1.MatrixClient(homeserverUrl, accessTokens.client1, new matrix_bot_sdk_1.SimpleFsStorageProvider("client1.json"));
matrix_bot_sdk_1.AutojoinRoomsMixin.setupOnClient(client1);
client1.on("room.message", function (roomId, event) {
    if (!event["content"] || event["content"]["msgtype"] !== "m.text")
        return;
    if (event["sender"] === client1userid)
        return;
    if (event['origin_server_ts'] < (new Date()).valueOf() - 1000)
        return;
    var body = event["content"]["body"];
    if (!body)
        return;
    if (body.indexOf("keyword") !== -1) {
        client1.sendMessage(roomId, {
            "msgtype": "m.text",
            "body": "" + badword
        });
    }
});
client1.start().then(function () { return console.log("Client1 started!"); });
var client2 = new matrix_bot_sdk_1.MatrixClient(homeserverUrl, accessTokens.client2, new matrix_bot_sdk_1.SimpleFsStorageProvider("client2.json"));
matrix_bot_sdk_1.AutojoinRoomsMixin.setupOnClient(client2);
client2.start().then(function () { return console.log("Client2 started!"); });
function client2baitsclient1() {
    return __awaiter(this, void 0, void 0, function () {
        var members;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("client2baitsclient1");
                    return [4 /*yield*/, client2.getJoinedRoomMembers(test_room_id)];
                case 1:
                    members = _a.sent();
                    if (members.includes(client1userid)) {
                        client2.sendMessage(test_room_id, {
                            "msgtype": "m.text",
                            "body": "keyword"
                        });
                    }
                    setTimeout(client2baitsclient1, 5000);
                    return [2 /*return*/];
            }
        });
    });
}
setTimeout(client2baitsclient1, 5000);
var client3 = new matrix_bot_sdk_1.MatrixClient(homeserverUrl, accessTokens.client3, new matrix_bot_sdk_1.SimpleFsStorageProvider("client3.json"));
matrix_bot_sdk_1.AutojoinRoomsMixin.setupOnClient(client3);
client3.on("room.message", function (roomId, event) {
    if (!event["content"] || event["content"]["msgtype"] !== "m.text")
        return;
    var body = event["content"]["body"];
    if (!body)
        return;
    if (body.indexOf(badword) !== -1) {
        client3.kickUser(event["sender"], roomId, "no!")
            .then(function () {
            client3.sendMessage(roomId, {
                "msgtype": "m.text",
                "body": "please don't say that in here"
            });
            setTimeout(client4invitesclient1, 6000);
        });
    }
});
client3.start().then(function () { return console.log("Client3 started!"); });
var client4 = new matrix_bot_sdk_1.MatrixClient(homeserverUrl, accessTokens.client4, new matrix_bot_sdk_1.SimpleFsStorageProvider("client4.json"));
matrix_bot_sdk_1.AutojoinRoomsMixin.setupOnClient(client4);
function client4invitesclient1() {
    return __awaiter(this, void 0, void 0, function () {
        var members;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("client4invitesclient1");
                    return [4 /*yield*/, client4.getJoinedRoomMembers(test_room_id)];
                case 1:
                    members = _a.sent();
                    if (!members.includes(client1userid)) {
                        client4.inviteUser(client1userid, test_room_id);
                    }
                    else {
                        setTimeout(client4invitesclient1, 6000);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
client4invitesclient1();
client4.start().then(function () { return console.log("Client4 started!"); });
