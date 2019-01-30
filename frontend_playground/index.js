let mistyIP = "10.9.22.79";
let textBox = document.getElementById('mytext')

document.addEventListener('DOMContentLoaded', () => {
  textBox = document.getElementById("mytext");
})

function connect(){
  axios.get("http://10.9.22.79/api/info/device")
    .then(res => {
      let myJSON = res.data.substring(1,res.data.length -1)
      let result = JSON.parse(myJSON)
      console.log(result.status)
      textBox.innerText = result.status
    })
}

//Misty API Calls
function getFaces(){
  console.log("getting faces")
  axios.get(`http://${mistyIP}/api/beta/faces`)
    .then(res => {
      let myData = JSON.parse(res.data)
      console.log(myData[0].result);
      textBox.innerText = myData[0].result;
    })
    .catch(err => {
      console.log(err)
    })
}

await function setFace(name = "Andy"){
  console.log("saving face")
  axios.post(`http://${mistyIP}/api/beta/faces/recognition/start`, {faceid:name})
    .then(res => {
      console.log("face saved")
      console.log(res)
      textBox.innerText = "Face saved"
    })
    .catch(err => console.log(err))
}

