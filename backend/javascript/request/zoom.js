// $(document).ready( () => {

// $('#zoom_btn').click(function(){
//     const el = document.querySelector('#image');
//     console.log(el.src)
//     const src = el.src;
//     el.dataset.magnifySrc = src;
//   });


// });
// function myFunction(x) {
//     if (x.matches) { // If media query matches
//         $("#image").removeClass("zoom");
//     } else {
//         $("#image").addClass("zoom");
//     }
//   }
document.getElementById ("image").addEventListener ("click", lightbox, false);
function lightbox(){
   n=  document.querySelector('#image').src;
    document.querySelector('#light').src = n;
console.log(n)
}
// });
//   var x = window.matchMedia("(max-width: 600px)")
//   myFunction(x) // Call listener function at run time
//   x.addListener(myFunction) // Attach listener function on state changes
  