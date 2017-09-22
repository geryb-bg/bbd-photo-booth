function startCountdown() {
    let timer = 3;
  
    let overlay = document.getElementById("overlay");
    overlay.style.display = "block";
    overlay.innerHTML = timer.toString();
  
    let intervalId = setInterval(() => {
      timer--;
      overlay.innerHTML = timer.toString();
      if (timer <= 0) {
        clearInterval(intervalId);
        overlay.style.display = "none";
        record();
      }
    }, 1000)
  }
  
  
  let video = document.getElementById("video");
  let stream = null;
  
  let resolution = {
    width: { exact: 640 },
    height: { exact: 480 }
    //,frameRate: { ideal: 5, max: 5 }
  };
  
  let mediaRecorder;
  function record() {
    console.log("recording...")
    const options = { mimeType: "video/webm" };
    const recordedChunks = [];
    mediaRecorder = new MediaRecorder(stream, options);
  
    mediaRecorder.addEventListener("dataavailable", function(e) {
      if (e.data.size > 0) {
        recordedChunks.push(e.data);
      }
    });
  
    mediaRecorder.addEventListener("stop", function() {
      let downloadLink = document.getElementById("download");
      let blob = new Blob(recordedChunks);
  
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = "blah.webm";
  
      var formdata = new FormData();
      formdata.append('video', blob);
  
      var xhr = new XMLHttpRequest();
      
      xhr.open("POST", "/save", true);
      // xhr.send();
      xhr.send(formdata);
      
    });
  
    mediaRecorder.start();
  
    let recordDiv = document.getElementById("recording");
    recordDiv.style.display = "block";
    setTimeout(() => {
      stop();
      recordDiv.style.display = "none";
    }, 6000);
  }
  
  function stop() {
    mediaRecorder.stop();
  }
  
  function startCamera() {
    navigator.mediaDevices
      .getUserMedia({ video: resolution, audio: false })
      .then(function(s) {
        stream = s;
        video.srcObject = s;
        video.play();
      })
      .catch(function(err) {
        console.log("An error occured! " + err);
      });
  
    video.addEventListener(
      "canplay",
      function(ev) {
        height = video.videoHeight;
        width = video.videoWidth;
        video.setAttribute("width", width);
        video.setAttribute("height", height);
        streaming = true;
      },
      false
    );
  }
  
  startCamera();
  