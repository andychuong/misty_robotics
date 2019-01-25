let mistyIP = ""

document.addEventListener('DOMContentLoaded', () => {

})

//Misty API Calls
function API1(){
  console.log("API1")
  axios.get("https://andy-ajax-blog.herokuapp.com/blogpost")
    .then(res => {
      console.log(res)
    })
    .catch(err => {
      console.log(err)
    })
}