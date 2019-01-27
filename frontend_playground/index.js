let mistyIP = ""

document.addEventListener('DOMContentLoaded', () => {

})

//Misty API Calls
function getFaces(){
  console.log("API1")
  axios.get(`http://${mistyIP}/api/beta/faces`)
    .then(res => {
      console.log(res)
    })
    .catch(err => {
      console.log(err)
    })
}

