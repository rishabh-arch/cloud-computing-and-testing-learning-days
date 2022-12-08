var mainElement = new Vue({
    el: '#app',
    data() {
      return {
        progressBarOn: true,
        progressBar: 0,
        intervalProgress: undefined,
        intervalItem: undefined,
        currentChairIndex: undefined,
        currentMatIndex: undefined,
        mats: [
          {
            thumbnail: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/867725/jarvis-silver-rec-base%5B1%5D.png',
            main: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/867725/overlay-stand-mat-black%5B1%5D.png',
          },
          {
            thumbnail: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/867725/cd8d9d636efc7bed2d7bb96d3925cd7c%5B1%5D.png',
            main: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/867725/topom-black%5B1%5D.png',
          },
          {
            thumbnail: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/867725/09b6e9f4d055b575b094a9c85dc89594%5B1%5D.png',
            main: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/867725/fully-jarvis-standing-desk-floatdeck-balance-board-ov-01%5B1%5D.png',
          }
        ],
        chairs: [
          {
            thumbnail: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/867725/09710f3d9e55a7f8ad2e8353327ac7ff%5B1%5D.png',
            main: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/867725/fully-luna-standing-desk-stool-jarvis-config-black-black-v01%5B1%5D.png',
          },
          {
            thumbnail: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/867725/d0b4d1278dbe18b7c0c99753953a1e7b%5B1%5D.png',
            main: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/867725/config-ttc-natural-v2%5B1%5D.png'
          },
          {
            thumbnail: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/867725/be784f6a320c39e063bba64cf936f09c%5B1%5D.png', 
            main: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/867725/fully-jarvis-crank-config-8010-blackblack%5B1%5D.png'
          }
        ]
      }
    },
    methods: {
      /**
       * @params event is an object
       * key = type of item clicked
       * value = index passed in
       */
      _handleImagePreview(event){
        // Disable timer functionality
        clearInterval(this.intervalItem);
        clearInterval(this.intervalProgress);
        this.progressBarOn = false;
        
        // Show item clicked
        let index = event.value;
        let dataType = event.key;
        if(this[dataType] == index){
          this[dataType] = undefined;
        } else {
          this[dataType] = index;
        }
      },
    },
    mounted(){
      let progressCount = 0;
      let count = 0;
      let maxArrayLength = this.chairs.length;
      
      this.intervalProgress = setInterval(() => {
        this.progressBar = progressCount + '%'
        progressCount += 0.1111111; /* 100%/(9000/10) */
        if(progressCount > 100){
          progressCount = 0;
        }
      }, 10);
      
      this.intervalItem = setInterval(() =>{
        console.log("I ran");
        this.currentChairIndex = count;
        this.currentMatIndex = count;
        if(count < maxArrayLength - 1){
          count++;
        } else {
          count = 0;
        }
      },3000)
    }
  });
  
  