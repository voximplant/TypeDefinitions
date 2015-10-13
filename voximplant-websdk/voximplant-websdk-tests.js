/// <reference path="./voximplant-websdk.d.ts"/>
var vox = VoxImplant.getInstance(), call;
vox.init({
    micRequired: true
});
vox.addEventListener("SDKReady", function (event) {
    console.log("VoxImplant SDK ver. " + event.version + " initialized");
    vox.connect();
});
vox.addEventListener("ConnectionEstablished", function (event) {
    console.log("Connection established");
    vox.login("username", "password");
});
vox.addEventListener("ConnectionClosed", function (event) {
    console.log("Connection closed");
});
vox.addEventListener("ConnectionFailed", function (event) {
    console.log("Connection failed. Reason: " + event.message);
});
vox.addEventListener("AuthEvent", function (event) {
    if (event.result === true) {
        // Authorized successfully
        console.log("Logged in as " + event.displayName);
        call = vox.call("some_number", false);
        call.addEventListener("Connected", function (callevent) {
            console.log("Call connected");
        });
        call.addEventListener("Failed", function (callevent) {
            console.log("Call failed, reason: " + callevent.reason);
        });
        call.addEventListener("Disconnected", function (callevent) {
            console.log("Call disconnected");
        });
        var msg_id = vox.sendInstantMessage("other_user", "Hello World!");
    }
    else {
        console.log("Authorization failed. Code: " + event.code);
    }
});
vox.addEventListener("MicAccessResult", function (event) {
    console.log("Microphone access allowed: " + event.result);
});
vox.addEventListener("IncomingCall", function (event) {
    call = event.call;
    call.addEventListener("Connected", function (callevent) {
        console.log("Inbound Call Connected");
        setTimeout(function () {
            vox.disconnect();
        }, 5000);
    });
    call.answer();
});
vox.addEventListener("MessageReceived", function (event) {
    console.log("Message received: " + event.content + " from " + event.id + " id " + event.message_id);
});
vox.addEventListener("SourcesInfoUpdated", function (event) {
    var audioSources = vox.audioSources(), videoSources = vox.videoSources();
    console.log("Received recording sources data:");
    console.log("Audio: " + audioSources);
    console.log("Video: " + videoSources);
    vox.useAudioSource(audioSources[0].id, function () { console.log('OK'); }, function () { console.log('Failed'); });
    vox.useVideoSource(videoSources[0].id, function () { console.log('OK'); }, function () { console.log('Failed'); });
});
vox.addEventListener("RosterReceived", function (event) {
    var roster = event.roster;
    console.log("Roster received: " + roster);
});
