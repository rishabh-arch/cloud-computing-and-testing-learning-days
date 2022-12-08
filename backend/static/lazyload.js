window.addEventListener('scroll', reveal);
        function reveal(){
        var reveals = document.querySelectorAll("img[data-src]");

        for(var i = 0; i < reveals.length; i++){
        var item = reveals[i]
            var windowheight = window.innerHeight;
            var revealtop = reveals[i].getBoundingClientRect().top;
            var revealpoint = 150;

            if(revealtop < windowheight - revealpoint){
            var src = item.getAttribute("data-src");
                item.src = src;
                item.removeAttribute('data-src');    	
            }
            else{
            reveals[i].classList.remove('active');
            }
        }
        }