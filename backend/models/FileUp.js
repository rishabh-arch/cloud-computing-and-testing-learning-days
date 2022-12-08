const multer = require("multer") 
const path = require("path")
// var upload = multer({ dest: "Upload_folder_name" }) 
    
var profile_photo = multer.diskStorage({ 
    destination: function (req, file, cb) { 
  
        // Uploads is the Upload_folder_name 
        cb(null, "./static/profile_photo") 
    }, 
    filename: function (req, file, cb) { 
      cb(null, file.fieldname + "-" + Date.now()+".jpg") 
    } 
  }) 

var hookah = multer.diskStorage({ 
    destination: function (req, file, cb) { 
  
        // Uploads is the Upload_folder_name 
        cb(null, "./static/hookah") 
    }, 
    filename: function (req, file, cb) { 
      cb(null, file.fieldname + "-" + Date.now()+".jpg") 
    } 
  }) 
var Emp_Address_proof = multer.diskStorage({ 
    destination: function (req, file, cb) { 
  
        // Uploads is the Upload_folder_name 
        cb(null, "./static/addressProof") 
    }, 
    filename: function (req, file, cb) { 
      cb(null, file.fieldname + "-" + Date.now()+".jpg") 
    } 
  }) 
var Slides_photo = multer.diskStorage({ 
    destination: function (req, file, cb) { 
  
        // Uploads is the Upload_folder_name 
        cb(null, "./static/Slides_photo") 
    }, 
    filename: function (req, file, cb) { 
      cb(null, file.fieldname + "-" + Date.now()+".jpg") 
    } 
  }) 
// Define the maximum size for uploading 
// picture i.e. 1 MB. it is optional 
const maxSize = 10 * 1000 * 1000; 

var P_P_Upload = multer({  
    storage: profile_photo, 
    limits: { fileSize: maxSize }, 
    fileFilter: function (req, file, cb){ 
    
        // Set the filetypes, it is optional 
        var filetypes = /jpeg|jpg|png/; 
        var mimetype = filetypes.test(file.mimetype); 
  
        var extname = filetypes.test(path.extname( 
                    file.originalname).toLowerCase()); 
        
        if (mimetype && extname) { 
            return cb(null, true); 
        } 
      
        cb("Error: File upload only supports the "
                + "following filetypes - " + filetypes); 
      }  
  
// mypic is the name of file attribute 
}).single("images");        

var hookah_Upload = multer({  
    storage: hookah, 
    limits: { fileSize: maxSize }, 
    fileFilter: function (req, file, cb){ 
    
        // Set the filetypes, it is optional 
        var filetypes = /jpeg|jpg|png/; 
        var mimetype = filetypes.test(file.mimetype); 
  
        var extname = filetypes.test(path.extname( 
                    file.originalname).toLowerCase()); 
        
        if (mimetype && extname) { 
            return cb(null, true); 
        } 
      
        cb("Error: File upload only supports the "
                + "following filetypes - " + filetypes); 
      }  
  
// mypic is the name of file attribute 
}).array("images");        
var Emp_Address_Upload = multer({  
    storage: Emp_Address_proof, 
    limits: { fileSize: maxSize }, 
    fileFilter: function (req, file, cb){ 
    
        // Set the filetypes, it is optional 
        var filetypes = /jpeg|jpg|png/; 
        var mimetype = filetypes.test(file.mimetype); 
  
        var extname = filetypes.test(path.extname( 
                    file.originalname).toLowerCase()); 
        
        if (mimetype && extname) { 
            return cb(null, true); 
        } 
      
        cb("Error: File upload only supports the "
                + "following filetypes - " + filetypes); 
      }  
  
// mypic is the name of file attribute 
}).single("images");        
var Slidesphoto = multer({  
    storage: Slides_photo, 
    limits: { fileSize: maxSize }, 
    fileFilter: function (req, file, cb){ 
    
        // Set the filetypes, it is optional 
        var filetypes = /jpeg|jpg|png/; 
        var mimetype = filetypes.test(file.mimetype); 
  
        var extname = filetypes.test(path.extname( 
                    file.originalname).toLowerCase()); 
        
        if (mimetype && extname) { 
            return cb(null, true); 
        } 
      
        cb("Error: File upload only supports the "
                + "following filetypes - " + filetypes); 
      }  
  
// mypic is the name of file attribute 
}).single("images");        

module.exports.P_P_Upload = P_P_Upload
module.exports.hookah_Upload = hookah_Upload
module.exports.Emp_Address_Upload = Emp_Address_Upload
module.exports.Slidesphoto = Slidesphoto