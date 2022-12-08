(() => {
    'use strict';
    const menu = document.getElementsByClassName('menu')[0];
    const menuItems = document.querySelectorAll('.menu__item');
    const menuItemIcons = document.querySelectorAll('.menu__item__icon');
    const menuItemTexts = document.querySelectorAll('.menu__item__text');
    const menuItemDots = document.querySelectorAll('.menu__item__dot'); 
    const menuItemCircles = document.querySelectorAll('.circle');
    
    let currentIndex = 0;
  
    const init = () => {
      
      for (let i = 0; i < menu.children.length; i++) {
        (function(index){
          // menuItemCircles[i].addEventListener("webkitAnimationEnd", stopAnimation);
          // menuItemCircles[i].addEventListener("animationend", stopAnimation);
          menu.children[i].onclick = function(){
            unsetActiveMenuItem(currentIndex);
            setActiveMenuIndex(index);
            currentIndex = index;
          }
        })(i);
      } 
     
      setActiveMenuIndex(0);
    }
  
    
    const toggleAnimation = (i) => {
      menuItemCircles[i].classList.toggle('animate');
    }
    
    const unsetActiveMenuItem = (i) => {
      menuItemIcons[i].classList.toggle('selected');
      menuItemTexts[i].classList.toggle('selected');
      menuItemDots[i].classList.toggle('selected');
      toggleAnimation(i);
    }
  
    const setActiveMenuIndex = (i) => {
      menuItemIcons[i].classList.toggle('selected');
      menuItemTexts[i].classList.toggle('selected');
      menuItemDots[i].classList.toggle('selected');
      toggleAnimation(i);
    }
  
  
    document.addEventListener('DOMContentLoaded', function() {
      init();
    })
    
  })();
  
  